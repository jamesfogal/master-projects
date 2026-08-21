import { NextResponse } from "next/server";
import {
  createSessionCookie,
  getAuthConfigurationStatus,
  resolveRoleFromCode,
} from "../../../../lib/session-auth";

export const dynamic = "force-dynamic";

function redirectWithError(request: Request, error: string) {
  const target = new URL("/", request.url);
  target.searchParams.set("error", error);
  return NextResponse.redirect(target, { status: 303 });
}

export async function POST(request: Request) {
  const authStatus = getAuthConfigurationStatus();

  if (!authStatus.loginReady) {
    return redirectWithError(request, "config_missing");
  }

  const formData = await request.formData();
  const code = formData.get("code");

  if (typeof code !== "string") {
    return redirectWithError(request, "invalid_code");
  }

  const role = resolveRoleFromCode(code);

  if (!role) {
    return redirectWithError(request, "invalid_code");
  }

  const cookie = createSessionCookie(role, request.url);

  if (!cookie) {
    return redirectWithError(request, "config_missing");
  }

  const response = NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
