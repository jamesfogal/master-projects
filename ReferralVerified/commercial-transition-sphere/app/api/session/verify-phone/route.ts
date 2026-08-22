import { NextResponse } from "next/server";
import { verifyAccessRequestCode } from "../../../../lib/access-store";

export const dynamic = "force-dynamic";

function redirectHome(request: Request, values?: Record<string, string>) {
  const target = new URL("/", request.url);

  for (const [key, value] of Object.entries(values ?? {})) {
    target.searchParams.set(key, value);
  }

  return NextResponse.redirect(target, { status: 303 });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const requestId = formData.get("requestId");
  const code = formData.get("code");

  if (typeof requestId !== "string" || typeof code !== "string") {
    return redirectHome(request, {
      mode: "verify",
      error: "invalid_request",
    });
  }

  const result = verifyAccessRequestCode(requestId, code);

  if (result.status === "pending_approval") {
    return redirectHome(request, {
      mode: "pending",
      requestId: result.requestId,
    });
  }

  return redirectHome(request, {
    mode: "verify",
    requestId,
    error:
      result.status === "not_found" || result.status === "invalid_state"
        ? "invalid_request"
        : result.status,
  });
}

