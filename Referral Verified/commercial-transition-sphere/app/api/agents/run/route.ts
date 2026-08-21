import { processQueuedAgents, queueDueAgents, runSourceAgent } from "../../../../lib/runtime-store";
import { requireSession } from "../../../../lib/session-auth";

type RunPayload = {
  sourceId?: string;
  mode?: "run_due" | "process_queue";
  forceAll?: boolean;
  limit?: number;
};

export async function POST(request: Request) {
  try {
    const auth = await requireSession("super_admin");

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const payload = (await request.json()) as RunPayload;
    if (payload.sourceId) {
      return Response.json({ result: runSourceAgent(payload.sourceId) });
    }
    if (payload.mode === "process_queue") {
      return Response.json(processQueuedAgents(payload.limit ?? 4));
    }
    if (payload.mode === "run_due") {
      const queued = queueDueAgents(Boolean(payload.forceAll));
      const processed = processQueuedAgents(payload.limit ?? 4);
      return Response.json({ queued, ...processed });
    }
    return Response.json({ error: "sourceId, run_due, or process_queue is required" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Agent run failed" }, { status: 500 });
  }
}
