import { NextResponse } from "next/server";
import { authenticateMember } from "../../../../lib/access-store";
import {
  createSessionCookie,
  getAuthConfigurationStatus,
} from "../../../../lib/session-auth";

export const dynamic = "force-dynamic";

function redirectGate(request: Request, values?: Record<string, string>) {
  const target = new URL("/", request.url);

  for (const [key, value] of Object.entries(values ?? {})) {
    target.searchParams.set(key, value);
  }

  return NextResponse.redirect(target, { status: 303 });
}

function redirectWorkspace(request: Request) {
  return NextResponse.redirect(new URL("/workspace", request.url), {
    status: 303,
  });
}

export async function POST(request: Request) {
  const authStatus = getAuthConfigurationStatus();

  if (!authStatus.signInReady) {
    return redirectGate(request, {
      error: "request_access_unavailable",
    });
  }

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return redirectGate(request, {
      error: "invalid_credentials",
    });
  }

  const result = authenticateMember(email, password);

  if (result.status === "success") {
    const cookie = createSessionCookie(result.member, request.url);

    if (!cookie) {
      return redirectGate(request, {
        error: "request_access_unavailable",
      });
    }

    const response = redirectWorkspace(request);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  }

  if (result.status === "pending_phone_verification") {
    return redirectGate(request, {
      mode: "verify",
      requestId: result.requestId,
    });
  }

  if (result.status === "pending_approval") {
    return redirectGate(request, {
      mode: "pending",
      requestId: result.requestId,
      error: "pending_approval",
    });
  }

  if (result.status === "rejected") {
    return redirectGate(request, {
      mode: "request",
      requestId: result.requestId,
      error: "access_rejected",
    });
  }

  return redirectGate(request, {
    error: "invalid_credentials",
  });
}
