import { NextResponse } from "next/server";
import { createAccessRequest } from "../../../../lib/access-store";
import { getAuthConfigurationStatus } from "../../../../lib/session-auth";

export const dynamic = "force-dynamic";

function redirectHome(request: Request, values?: Record<string, string>) {
  const target = new URL("/", request.url);

  for (const [key, value] of Object.entries(values ?? {})) {
    target.searchParams.set(key, value);
  }

  return NextResponse.redirect(target, { status: 303 });
}

export async function POST(request: Request) {
  const authStatus = getAuthConfigurationStatus();

  if (!authStatus.requestAccessReady) {
    return redirectHome(request, {
      mode: "request",
      error: "request_access_unavailable",
    });
  }

  const formData = await request.formData();
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");
  const groupId = formData.get("groupId");

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof password !== "string" ||
    typeof groupId !== "string"
  ) {
    return redirectHome(request, {
      mode: "request",
      error: "invalid_input",
    });
  }

  const result = await createAccessRequest({
    fullName,
    email,
    phone,
    password,
    groupId,
  });

  if (result.status === "verification_required") {
    return redirectHome(request, {
      mode: "verify",
      requestId: result.requestId,
    });
  }

  return redirectHome(request, {
    mode: result.status === "pending_approval" ? "pending" : "request",
    ...(result.requestId
      ? {
          requestId: result.requestId,
        }
      : {}),
    error: result.status,
  });
}

