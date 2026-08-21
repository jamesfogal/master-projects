import { getDashboardState } from "../../../lib/runtime-store";

export async function GET() {
  try {
    const { projects, agents } = getDashboardState();
    return Response.json({ projects, agents, generatedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dashboard unavailable" }, { status: 500 });
  }
}
