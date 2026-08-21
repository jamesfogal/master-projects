import { getSourceAgents } from "../../../lib/runtime-store";
import { requireSession } from "../../../lib/session-auth";

export async function GET() {
  try {
    const auth = await requireSession("super_admin");

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    return Response.json({ agents: await getSourceAgents() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sources unavailable" }, { status: 500 });
  }
}
