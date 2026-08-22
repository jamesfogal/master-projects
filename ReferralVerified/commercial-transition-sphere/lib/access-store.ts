import { randomInt, scryptSync, timingSafeEqual } from "node:crypto";

export type MembershipRole = "member" | "group_admin" | "root_admin";

type AccessRequestStatus =
  | "pending_phone_verification"
  | "pending_approval"
  | "approved"
  | "rejected";

type AccessGroupRecord = {
  id: string;
  name: string;
  slug: string;
};

type AccessMemberRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  groupId: string;
  role: MembershipRole;
  createdAt: string;
  approvedAt: string;
};

type AccessRequestRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  groupId: string;
  requestedRole: Extract<MembershipRole, "member">;
  status: AccessRequestStatus;
  verificationCodeHash: string;
  verificationCodeExpiresAt: string;
  createdAt: string;
  phoneVerifiedAt: null | string;
  approvedAt: null | string;
  approvedByMemberId: null | string;
  rejectedAt: null | string;
  rejectedByMemberId: null | string;
  previewCode: null | string;
};

type AccessStore = {
  groups: AccessGroupRecord[];
  members: AccessMemberRecord[];
  requests: AccessRequestRecord[];
  memberCounter: number;
  requestCounter: number;
};

export type SessionMember = {
  id: string;
  fullName: string;
  email: string;
  groupId: string;
  groupName: string;
  role: MembershipRole;
};

export type AccessGroupOption = {
  id: string;
  name: string;
};

export type AccessRequestPreview = {
  id: string;
  fullName: string;
  email: string;
  groupId: string;
  groupName: string;
  maskedPhone: string;
  status: AccessRequestStatus;
  previewCode?: string;
};

export type AccessConfigurationStatus = {
  requestAccessReady: boolean;
  devPreviewSmsFallback: boolean;
};

export type ManagedMember = {
  id: string;
  fullName: string;
  email: string;
  phoneMasked: string;
  groupId: string;
  groupName: string;
  role: MembershipRole;
  approvedAt: string;
};

export type ApprovalRequest = {
  id: string;
  fullName: string;
  email: string;
  phoneMasked: string;
  groupId: string;
  groupName: string;
  createdAt: string;
  phoneVerifiedAt: string | null;
};

export type AuthenticateResult =
  | {
      status: "success";
      member: SessionMember;
    }
  | {
      status: "pending_phone_verification" | "pending_approval" | "rejected";
      requestId: string;
    }
  | {
      status: "invalid_credentials";
    };

export type CreateAccessRequestResult =
  | {
      status: "verification_required";
      requestId: string;
    }
  | {
      status:
        | "request_access_unavailable"
        | "existing_member"
        | "pending_approval"
        | "invalid_input";
      requestId?: string;
    };

export type VerifyAccessRequestResult =
  | {
      status: "pending_approval";
      requestId: string;
    }
  | {
      status:
        | "not_found"
        | "invalid_code"
        | "expired_code"
        | "invalid_state";
    };

const PASSWORD_SALT = "cts-member-login-preview";
const VERIFICATION_SALT = "cts-phone-code-preview";
const VERIFICATION_TTL_MINUTES = 10;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function hashValue(value: string, salt: string) {
  return scryptSync(value, salt, 64).toString("base64");
}

function compareHashes(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password: string) {
  return hashValue(password, PASSWORD_SALT);
}

function verifyPassword(password: string, passwordHash: string) {
  return compareHashes(hashPassword(password), passwordHash);
}

function hashVerificationCode(code: string) {
  return hashValue(code, VERIFICATION_SALT);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D+/g, "");
}

function maskPhone(phone: string) {
  const digits = normalizePhone(phone);
  const lastFour = digits.slice(-4).padStart(4, "0");
  return `••• ••• ${lastFour}`;
}

function nowIso() {
  return new Date().toISOString();
}

function futureIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function nextVerificationCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function groupRecords(): AccessGroupRecord[] {
  return [
    {
      id: "GRP-001",
      name: "Referral Verified",
      slug: "referral-verified",
    },
    {
      id: "GRP-002",
      name: "Security Partners",
      slug: "security-partners",
    },
    {
      id: "GRP-003",
      name: "Connectivity Partners",
      slug: "connectivity-partners",
    },
    {
      id: "GRP-900",
      name: "Operations",
      slug: "operations",
    },
  ];
}

function createMember(
  id: string,
  fullName: string,
  email: string,
  phone: string,
  password: string,
  groupId: string,
  role: MembershipRole,
) {
  return {
    id,
    fullName,
    email: normalizeEmail(email),
    phone: normalizePhone(phone),
    passwordHash: hashPassword(password),
    groupId,
    role,
    createdAt: nowIso(),
    approvedAt: nowIso(),
  } satisfies AccessMemberRecord;
}

function createInitialStore(): AccessStore {
  return {
    groups: groupRecords(),
    members: [
      createMember(
        "USR-001",
        "Referral Verified Member",
        "member@referralverified.local",
        "3145550101",
        "MemberPass123!",
        "GRP-001",
        "member",
      ),
      createMember(
        "USR-002",
        "Referral Verified Lead",
        "lead@referralverified.local",
        "3145550102",
        "LeadPass123!",
        "GRP-001",
        "group_admin",
      ),
      createMember(
        "USR-003",
        "Referral Verified Operations",
        "ops@referralverified.local",
        "3145550103",
        "OpsPass123!",
        "GRP-900",
        "root_admin",
      ),
    ],
    requests: [],
    memberCounter: 3,
    requestCounter: 0,
  };
}

declare global {
  var __transitionSphereAccessStore: AccessStore | undefined;
}

function getStore() {
  globalThis.__transitionSphereAccessStore ??= createInitialStore();
  return globalThis.__transitionSphereAccessStore;
}

function getGroupById(groupId: string) {
  return getStore().groups.find((group) => group.id === groupId) ?? null;
}

function toSessionMember(member: AccessMemberRecord): SessionMember {
  const group = getGroupById(member.groupId);

  return {
    id: member.id,
    fullName: member.fullName,
    email: member.email,
    groupId: member.groupId,
    groupName: group?.name ?? "Unknown group",
    role: member.role,
  };
}

function findActiveMemberByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return getStore().members.find((member) => member.email === normalized) ?? null;
}

function findRequestById(requestId: string) {
  return getStore().requests.find((request) => request.id === requestId) ?? null;
}

function findOpenRequestByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return (
    getStore().requests.find(
      (request) =>
        request.email === normalized &&
        (request.status === "pending_phone_verification" ||
          request.status === "pending_approval"),
    ) ?? null
  );
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

function canManageGroup(actor: SessionMember, groupId: string) {
  return actor.role === "root_admin" || actor.groupId === groupId;
}

async function deliverVerificationCode(phone: string, code: string) {
  const webhookUrl = process.env.CTS_SMS_WEBHOOK_URL?.trim();
  const bearerToken = process.env.CTS_SMS_WEBHOOK_BEARER_TOKEN?.trim();

  if (!webhookUrl) {
    return { mode: "preview" as const };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(bearerToken
        ? {
            authorization: `Bearer ${bearerToken}`,
          }
        : {}),
    },
    body: JSON.stringify({
      to: phone,
      message: `Your Commercial Transition Sphere verification code is ${code}.`,
    }),
  });

  if (!response.ok) {
    throw new Error("SMS delivery failed");
  }

  return { mode: "live" as const };
}

export function listAccessGroups(): AccessGroupOption[] {
  return getStore().groups
    .filter((group) => group.id !== "GRP-900")
    .map((group) => ({
      id: group.id,
      name: group.name,
    }));
}

export function getAccessConfigurationStatus(): AccessConfigurationStatus {
  const smsConfigured = Boolean(process.env.CTS_SMS_WEBHOOK_URL?.trim());
  return {
    requestAccessReady: smsConfigured || !isProduction(),
    devPreviewSmsFallback: !smsConfigured && !isProduction(),
  };
}

export function getSessionMemberById(memberId: string) {
  const member = getStore().members.find((current) => current.id === memberId);
  return member ? toSessionMember(member) : null;
}

export function authenticateMember(
  email: string,
  password: string,
): AuthenticateResult {
  const member = findActiveMemberByEmail(email);

  if (member && verifyPassword(password, member.passwordHash)) {
    return {
      status: "success",
      member: toSessionMember(member),
    };
  }

  const openRequest = findOpenRequestByEmail(email);

  if (openRequest && verifyPassword(password, openRequest.passwordHash)) {
    if (openRequest.status === "pending_phone_verification") {
      return {
        status: "pending_phone_verification",
        requestId: openRequest.id,
      };
    }

    return {
      status: "pending_approval",
      requestId: openRequest.id,
    };
  }

  const rejectedRequest =
    getStore().requests.find(
      (request) =>
        request.email === normalizeEmail(email) && request.status === "rejected",
    ) ?? null;

  if (rejectedRequest && verifyPassword(password, rejectedRequest.passwordHash)) {
    return {
      status: "rejected",
      requestId: rejectedRequest.id,
    };
  }

  return {
    status: "invalid_credentials",
  };
}

export async function createAccessRequest(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  groupId: string;
}): Promise<CreateAccessRequestResult> {
  const store = getStore();
  const fullName = input.fullName.trim();
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const password = input.password;
  const groupId = input.groupId.trim();
  const group = getGroupById(groupId);

  if (
    !fullName ||
    !email.includes("@") ||
    phone.length < 10 ||
    password.trim().length < 8 ||
    !group ||
    group.id === "GRP-900"
  ) {
    return {
      status: "invalid_input",
    };
  }

  if (findActiveMemberByEmail(email)) {
    return {
      status: "existing_member",
    };
  }

  const accessStatus = getAccessConfigurationStatus();

  if (!accessStatus.requestAccessReady) {
    return {
      status: "request_access_unavailable",
    };
  }

  const openRequest = findOpenRequestByEmail(email);
  const verificationCode = nextVerificationCode();

  if (openRequest?.status === "pending_approval") {
    return {
      status: "pending_approval",
      requestId: openRequest.id,
    };
  }

  await deliverVerificationCode(phone, verificationCode);

  if (openRequest) {
    openRequest.fullName = fullName;
    openRequest.phone = phone;
    openRequest.groupId = groupId;
    openRequest.passwordHash = hashPassword(password);
    openRequest.status = "pending_phone_verification";
    openRequest.verificationCodeHash = hashVerificationCode(verificationCode);
    openRequest.verificationCodeExpiresAt = futureIso(VERIFICATION_TTL_MINUTES);
    openRequest.phoneVerifiedAt = null;
    openRequest.previewCode = accessStatus.devPreviewSmsFallback
      ? verificationCode
      : null;

    return {
      status: "verification_required",
      requestId: openRequest.id,
    };
  }

  store.requestCounter += 1;
  const requestId = `REQ-${String(store.requestCounter).padStart(4, "0")}`;

  store.requests.unshift({
    id: requestId,
    fullName,
    email,
    phone,
    passwordHash: hashPassword(password),
    groupId,
    requestedRole: "member",
    status: "pending_phone_verification",
    verificationCodeHash: hashVerificationCode(verificationCode),
    verificationCodeExpiresAt: futureIso(VERIFICATION_TTL_MINUTES),
    createdAt: nowIso(),
    phoneVerifiedAt: null,
    approvedAt: null,
    approvedByMemberId: null,
    rejectedAt: null,
    rejectedByMemberId: null,
    previewCode: accessStatus.devPreviewSmsFallback ? verificationCode : null,
  });

  return {
    status: "verification_required",
    requestId,
  };
}

export function getAccessRequestPreview(
  requestId: string,
): AccessRequestPreview | null {
  const request = findRequestById(requestId);

  if (!request) {
    return null;
  }

  const group = getGroupById(request.groupId);

  return {
    id: request.id,
    fullName: request.fullName,
    email: request.email,
    groupId: request.groupId,
    groupName: group?.name ?? "Unknown group",
    maskedPhone: maskPhone(request.phone),
    status: request.status,
    ...(request.previewCode
      ? {
          previewCode: request.previewCode,
        }
      : {}),
  };
}

export function verifyAccessRequestCode(
  requestId: string,
  code: string,
): VerifyAccessRequestResult {
  const request = findRequestById(requestId);

  if (!request) {
    return {
      status: "not_found",
    };
  }

  if (request.status !== "pending_phone_verification") {
    return {
      status: "invalid_state",
    };
  }

  if (new Date(request.verificationCodeExpiresAt).getTime() < Date.now()) {
    return {
      status: "expired_code",
    };
  }

  if (!compareHashes(hashVerificationCode(code.trim()), request.verificationCodeHash)) {
    return {
      status: "invalid_code",
    };
  }

  request.status = "pending_approval";
  request.phoneVerifiedAt = nowIso();
  request.previewCode = null;

  return {
    status: "pending_approval",
    requestId: request.id,
  };
}

export function listApprovalRequests(actor: SessionMember): ApprovalRequest[] {
  if (rank(actor.role) < rank("group_admin")) {
    return [];
  }

  return getStore().requests
    .filter((request) => request.status === "pending_approval")
    .filter((request) => canManageGroup(actor, request.groupId))
    .map((request) => ({
      id: request.id,
      fullName: request.fullName,
      email: request.email,
      phoneMasked: maskPhone(request.phone),
      groupId: request.groupId,
      groupName: getGroupById(request.groupId)?.name ?? "Unknown group",
      createdAt: request.createdAt,
      phoneVerifiedAt: request.phoneVerifiedAt,
    }));
}

export function listManagedMembers(actor: SessionMember): ManagedMember[] {
  if (rank(actor.role) < rank("group_admin")) {
    return [];
  }

  return getStore().members
    .filter((member) => canManageGroup(actor, member.groupId))
    .map((member) => ({
      id: member.id,
      fullName: member.fullName,
      email: member.email,
      phoneMasked: maskPhone(member.phone),
      groupId: member.groupId,
      groupName: getGroupById(member.groupId)?.name ?? "Unknown group",
      role: member.role,
      approvedAt: member.approvedAt,
    }));
}

export function approveAccessRequest(actor: SessionMember, requestId: string) {
  if (rank(actor.role) < rank("group_admin")) {
    return {
      status: "forbidden" as const,
    };
  }

  const request = findRequestById(requestId);

  if (!request || request.status !== "pending_approval") {
    return {
      status: "not_found" as const,
    };
  }

  if (!canManageGroup(actor, request.groupId)) {
    return {
      status: "forbidden" as const,
    };
  }

  const store = getStore();
  store.memberCounter += 1;
  const memberId = `USR-${String(store.memberCounter).padStart(3, "0")}`;

  store.members.unshift({
    id: memberId,
    fullName: request.fullName,
    email: request.email,
    phone: request.phone,
    passwordHash: request.passwordHash,
    groupId: request.groupId,
    role: request.requestedRole,
    createdAt: request.createdAt,
    approvedAt: nowIso(),
  });

  request.status = "approved";
  request.approvedAt = nowIso();
  request.approvedByMemberId = actor.id;
  request.previewCode = null;

  return {
    status: "approved" as const,
    memberId,
  };
}

export function rejectAccessRequest(actor: SessionMember, requestId: string) {
  if (rank(actor.role) < rank("group_admin")) {
    return {
      status: "forbidden" as const,
    };
  }

  const request = findRequestById(requestId);

  if (!request || request.status !== "pending_approval") {
    return {
      status: "not_found" as const,
    };
  }

  if (!canManageGroup(actor, request.groupId)) {
    return {
      status: "forbidden" as const,
    };
  }

  request.status = "rejected";
  request.rejectedAt = nowIso();
  request.rejectedByMemberId = actor.id;
  request.previewCode = null;

  return {
    status: "rejected" as const,
  };
}

