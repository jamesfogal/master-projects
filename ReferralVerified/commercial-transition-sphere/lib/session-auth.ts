import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  getAccessConfigurationStatus,
  getSessionMemberById,
  type MembershipRole,
  type SessionMember,
} from "./access-store";

const SESSION_COOKIE_NAME = "cts_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const DEV_SESSION_SECRET = "cts-local-preview-session-secret";

type SessionPayload = {
  issuedAt: number;
  role: MembershipRole;
  userId: string;
};

export type AuthConfigurationStatus = {
  devPreviewSmsFallback: boolean;
  requestAccessReady: boolean;
  signInReady: boolean;
};

export type SessionState = SessionMember;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function getSessionSecret() {
  const configuredSecret = process.env.CTS_SESSION_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  return isProduction() ? "" : DEV_SESSION_SECRET;
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

function encodeSession(member: SessionMember, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      issuedAt: Math.floor(Date.now() / 1000),
      role: member.role,
      userId: member.id,
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
      !parsed.userId ||
      !Number.isFinite(parsed.issuedAt) ||
      !["member", "group_admin", "root_admin"].includes(parsed.role)
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

function rank(role: MembershipRole) {
  switch (role) {
    case "root_admin":
      return 2;
    case "group_admin":
      return 1;
    default:
      return 0;
  }
}

export function getAuthConfigurationStatus(): AuthConfigurationStatus {
  const accessStatus = getAccessConfigurationStatus();

  return {
    signInReady: Boolean(getSessionSecret()),
    requestAccessReady: accessStatus.requestAccessReady,
    devPreviewSmsFallback: accessStatus.devPreviewSmsFallback,
  };
}

export async function getSession(): Promise<null | SessionState> {
  const sessionSecret = getSessionSecret();

  if (!sessionSecret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = decodeSession(token, sessionSecret);

  if (!payload) {
    return null;
  }

  const member = getSessionMemberById(payload.userId);

  if (!member || member.role !== payload.role) {
    return null;
  }

  return member;
}

export async function requireSession(minimumRole: MembershipRole = "member") {
  const session = await getSession();

  if (!session) {
    return {
      ok: false as const,
      status: 401,
      error: "Authentication required",
    };
  }

  if (rank(session.role) < rank(minimumRole)) {
    return {
      ok: false as const,
      status: 403,
      error: "Administrator access required",
    };
  }

  return {
    ok: true as const,
    session,
  };
}

export function createSessionCookie(member: SessionMember, requestUrl?: string) {
  const sessionSecret = getSessionSecret();

  if (!sessionSecret) {
    return null;
  }

  return {
    name: SESSION_COOKIE_NAME,
    value: encodeSession(member, sessionSecret),
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

