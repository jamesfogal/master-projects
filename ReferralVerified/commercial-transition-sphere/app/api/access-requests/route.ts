import {
  approveAccessRequest,
  listApprovalRequests,
  rejectAccessRequest,
} from "../../../lib/access-store";
import { requireSession } from "../../../lib/session-auth";

export async function GET() {
  try {
    const auth = await requireSession("group_admin");

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    return Response.json({ requests: listApprovalRequests(auth.session) });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Approval queue unavailable",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireSession("group_admin");

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const payload = (await request.json()) as {
      action?: "approve" | "reject";
      requestId?: string;
    };

    if (!payload.requestId || !payload.action) {
      return Response.json(
        { error: "Request and action are required." },
        { status: 400 },
      );
    }

    const result =
      payload.action === "approve"
        ? approveAccessRequest(auth.session, payload.requestId)
        : rejectAccessRequest(auth.session, payload.requestId);

    if (result.status === "forbidden") {
      return Response.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    if (result.status === "not_found") {
      return Response.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Approval action failed",
      },
      { status: 500 },
    );
  }
}

