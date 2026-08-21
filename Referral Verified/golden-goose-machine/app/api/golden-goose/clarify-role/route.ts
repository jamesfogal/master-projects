import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON } from '@/lib/goldenGoose/claudeClient';
import { buildRoleClarificationPrompt } from '@/lib/goldenGoose/prompts';
import { checkGoldenGooseRateLimit } from '@/lib/rateLimiter';
import type { RoleClarificationResult, RoleClarificationTurn } from '@/lib/goldenGoose/types';

// Stateless — runs during intake, before any Supabase row exists. The
// client holds the running list of prior Q&A turns and stops asking after
// 3 rounds regardless of what this route returns, per the spec's "do not
// overwhelm the user with questions" rule. Rate-limited the same way as
// analyze-site (same IP/day cap) since this is the one Golden Goose route
// with no submission id to otherwise gate it — called directly and
// repeatedly, it would be an unlimited free path to paid Claude calls.
export async function POST(req: NextRequest) {
  try {
    const { companyName, roleDescription, priorTurns } = await req.json() as {
      companyName?: string; roleDescription?: string; priorTurns?: RoleClarificationTurn[];
    };

    if (!companyName || !roleDescription) {
      return NextResponse.json({ error: 'Company name and role description are required.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '0.0.0.0';
    const { limited } = await checkGoldenGooseRateLimit(ip);
    if (limited) {
      return NextResponse.json({ error: "You've reached today's free Golden Goose usage limit. Come back tomorrow." }, { status: 429 });
    }

    const prompt = buildRoleClarificationPrompt({ companyName, roleDescription, priorTurns: priorTurns ?? [] });
    const result = await callClaudeJSON<RoleClarificationResult>(prompt);

    return NextResponse.json(result);
  } catch (err) {
    console.error('GOLDEN_GOOSE_CLARIFY_ROLE_FAIL:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}
