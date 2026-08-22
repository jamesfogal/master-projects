// Single choke point for calling the Anthropic API. Every Golden Goose
// route that needs the model to "think" goes through here, using a forced
// tool call so the response is guaranteed-parseable JSON instead of prose
// we'd have to regex out of a text reply.

const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-5';

export class ClaudeCallError extends Error {}

interface CallClaudeJSONParams {
  system: string;
  user: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Record<string, unknown>;
  maxTokens?: number;
  timeoutMs?: number;
}

interface AnthropicToolUseBlock {
  type: 'tool_use';
  name: string;
  input: unknown;
}

interface AnthropicMessageResponse {
  content: Array<{ type: string } & Partial<AnthropicToolUseBlock>>;
}

async function callOnce<T>(params: CallClaudeJSONParams, apiKey: string): Promise<T> {
  const { system, user, toolName, toolDescription, inputSchema, maxTokens = 4096, timeoutMs = 45000 } = params;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
      tools: [{ name: toolName, description: toolDescription, input_schema: inputSchema }],
      tool_choice: { type: 'tool', name: toolName },
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ClaudeCallError(`Anthropic API ${res.status}: ${body.slice(0, 300)}`);
  }

  const data: AnthropicMessageResponse = await res.json();
  const toolUse = data.content.find((b): b is AnthropicToolUseBlock => b.type === 'tool_use' && b.name === toolName);
  if (!toolUse) {
    throw new ClaudeCallError('Anthropic response had no matching tool_use block');
  }

  return toolUse.input as T;
}

// One retry on transient failure (network blip, malformed block) — the
// underlying fetch already has its own timeout, so this isn't a retry loop
// that can hang indefinitely.
export async function callClaudeJSON<T>(params: CallClaudeJSONParams): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ClaudeCallError('ANTHROPIC_API_KEY is not set — add it to .env.local (see .env.local.example)');
  }

  try {
    return await callOnce<T>(params, apiKey);
  } catch (err) {
    console.error('CLAUDE_CALL_FAIL (retrying once):', err instanceof Error ? err.message : err);
    return await callOnce<T>(params, apiKey);
  }
}
