import { getDashboardState } from "../../../lib/runtime-store";
import { requireSession } from "../../../lib/session-auth";

export async function GET() {
  try {
    const auth = await requireSession();

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { projects, agents } = getDashboardState();
    return Response.json({ projects, agents, generatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dashboard unavailable" }, { status: 500 });
  }
}
