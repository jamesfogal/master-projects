import { NextResponse } from "next/server";
import { clearSessionCookie } from "../../../../lib/session-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), {
    status: 303,
  });
  const cookie = clearSessionCookie(request.url);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
