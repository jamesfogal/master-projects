import { listManagedMembers } from "../../../lib/access-store";
import { requireSession } from "../../../lib/session-auth";

export async function GET() {
  try {
    const auth = await requireSession("group_admin");

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    return Response.json({ members: listManagedMembers(auth.session) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Members unavailable",
      },
      { status: 500 },
    );
  }
}

