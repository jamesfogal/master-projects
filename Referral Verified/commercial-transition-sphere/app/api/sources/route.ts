import { getSourceAgents } from "../../../lib/runtime-store";

export async function GET() {
  try {
    return Response.json({ agents: await getSourceAgents() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sources unavailable" }, { status: 500 });
  }
}
