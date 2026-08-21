import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "cts_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const DEV_MEMBER_CODE = "cts-preview-member";
const DEV_SUPER_ADMIN_CODE = "cts-preview-super-admin";
const DEV_SESSION_SECRET = "cts-local-preview-session-secret";

export type SessionRole = "member" | "super_admin";

type SessionPayload = {
  role: SessionRole;
  issuedAt: number;
};

export type AuthConfigurationStatus = {
  loginReady: boolean;
  memberCodeReady: boolean;
  superAdminCodeReady: boolean;
  sessionSecretReady: boolean;
  devDefaultsActive: boolean;
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getCodes() {
  const memberCode = process.env.CTS_ACCESS_CODE?.trim();
  const superAdminCode = process.env.CTS_SUPER_ADMIN_CODE?.trim();
  const sessionSecret = process.env.CTS_SESSION_SECRET?.trim();
  const useDevDefaults = !isProduction();

  return {
    memberCode: memberCode || (useDevDefaults ? DEV_MEMBER_CODE : ""),
    superAdminCode:
      superAdminCode || (useDevDefaults ? DEV_SUPER_ADMIN_CODE : ""),
    sessionSecret: sessionSecret || (useDevDefaults ? DEV_SESSION_SECRET : ""),
    devDefaultsActive:
      useDevDefaults && (!memberCode || !superAdminCode || !sessionSecret),
  };
}

function compareValue(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function signValue(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function getCookieOptions(requestUrl?: string) {
  let localPreview = false;

  if (requestUrl) {
    const hostname = new URL(requestUrl).hostname;
    localPreview = hostname === "127.0.0.1" || hostname === "localhost";
  }

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction() && !localPreview,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

function encodeSession(role: SessionRole, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      role,
      issuedAt: Math.floor(Date.now() / 1000),
    } satisfies SessionPayload),
  ).toString("base64url");

  return `${payload}.${signValue(payload, secret)}`;
}

function decodeSession(token: string, secret: string): SessionPayload | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signValue(payload, secret);

  if (!compareValue(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      (parsed.role !== "member" && parsed.role !== "super_admin") ||
      !Number.isFinite(parsed.issuedAt)
    ) {
      return null;
    }

    const age = Math.floor(Date.now() / 1000) - parsed.issuedAt;

    if (age < 0 || age > SESSION_TTL_SECONDS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getAuthConfigurationStatus(): AuthConfigurationStatus {
  const { memberCode, superAdminCode, sessionSecret, devDefaultsActive } =
    getCodes();

  return {
    loginReady: Boolean(sessionSecret && (memberCode || superAdminCode)),
    memberCodeReady: Boolean(memberCode),
    superAdminCodeReady: Boolean(superAdminCode),
    sessionSecretReady: Boolean(sessionSecret),
    devDefaultsActive,
  };
}

export function resolveRoleFromCode(rawCode: string): SessionRole | null {
  const code = rawCode.trim();
  const { memberCode, superAdminCode } = getCodes();

  if (!code) {
    return null;
  }

  if (superAdminCode && compareValue(code, superAdminCode)) {
    return "super_admin";
  }

  if (memberCode && compareValue(code, memberCode)) {
    return "member";
  }

  return null;
}

export async function getSession(): Promise<SessionPayload | null> {
  const { sessionSecret } = getCodes();

  if (!sessionSecret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token, sessionSecret);
}

export async function requireSession(minimumRole: SessionRole = "member") {
  const session = await getSession();

  if (!session) {
    return {
      ok: false as const,
      status: 401,
      error: "Authentication required",
    };
  }

  if (minimumRole === "super_admin" && session.role !== "super_admin") {
    return {
      ok: false as const,
      status: 403,
      error: "Super admin access required",
    };
  }

  return {
    ok: true as const,
    session,
  };
}

export function createSessionCookie(role: SessionRole, requestUrl?: string) {
  const { sessionSecret } = getCodes();

  if (!sessionSecret) {
    return null;
  }

  return {
    name: SESSION_COOKIE_NAME,
    value: encodeSession(role, sessionSecret),
    options: getCookieOptions(requestUrl),
  };
}

export function clearSessionCookie(requestUrl?: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    options: {
      ...getCookieOptions(requestUrl),
      maxAge: 0,
    },
  };
}
