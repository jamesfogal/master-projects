import Link from "next/link";
import type { CSSProperties } from "react";
import BackdropScene from "../components/backdrop-scene";
import type {
  AccessGroupOption,
  AccessRequestPreview,
} from "../lib/access-store";
import { selectBackdrop } from "../lib/backdrop-selector";
import type { AuthConfigurationStatus } from "../lib/session-auth";

type AccessGateMode = "pending" | "request" | "sign-in" | "verify";

type AccessGateProps = {
  authStatus: AuthConfigurationStatus;
  errorMessage?: string;
  groups: AccessGroupOption[];
  mode: AccessGateMode;
  requestState: AccessRequestPreview | null;
};

function GateHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="access-header">
      <div className="access-brand">
        <span className="access-brand-rule" aria-hidden="true" />
        <div>
          <span className="access-brand-label">Referral Verified</span>
          <strong>Commercial Transition Sphere</strong>
        </div>
      </div>
      <div className="access-heading">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function NavSwitch({ current }: { current: AccessGateMode }) {
  return (
    <div className="access-switch">
      <Link
        className={current === "sign-in" ? "is-active" : ""}
        href="/"
      >
        Sign in
      </Link>
      <Link
        className={current === "request" ? "is-active" : ""}
        href="/?mode=request"
      >
        Sign up
      </Link>
    </div>
  );
}

function SignInForm({
  disabled,
}: {
  disabled: boolean;
}) {
  return (
    <form
      action="/api/session/login"
      className="access-form access-form-signin"
      method="post"
    >
      <label className="access-field">
        <span>Email</span>
        <input
          autoComplete="email"
          name="email"
          placeholder="name@company.com"
          required
          type="email"
        />
      </label>
      <label className="access-field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          placeholder="Password"
          required
          type="password"
        />
      </label>
      <button className="access-submit" disabled={disabled} type="submit">
        Sign in
      </button>
    </form>
  );
}

function RequestAccessForm({
  disabled,
  groups,
}: {
  disabled: boolean;
  groups: AccessGroupOption[];
}) {
  return (
    <form
      action="/api/session/request-access"
      className="access-form access-form-request"
      method="post"
    >
      <label className="access-field">
        <span>Full name</span>
        <input
          autoComplete="name"
          name="fullName"
          placeholder="Full name"
          required
          type="text"
        />
      </label>
      <label className="access-field">
        <span>Work email</span>
        <input
          autoComplete="email"
          name="email"
          placeholder="name@company.com"
          required
          type="email"
        />
      </label>
      <label className="access-field">
        <span>Mobile phone</span>
        <input
          autoComplete="tel"
          name="phone"
          placeholder="Mobile phone"
          required
          type="tel"
        />
      </label>
      <label className="access-field">
        <span>Group</span>
        <select defaultValue="" name="groupId" required>
          <option disabled value="">
            Select group
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </label>
      <label className="access-field">
        <span>Password</span>
        <input
          autoComplete="new-password"
          minLength={8}
          name="password"
          placeholder="Create a password"
          required
          type="password"
        />
      </label>
      <button
        className="access-submit access-submit-wide"
        disabled={disabled}
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}

function VerifyPhoneForm({
  requestState,
}: {
  requestState: AccessRequestPreview | null;
}) {
  return (
    <form
      action="/api/session/verify-phone"
      className="access-form access-form-verify"
      method="post"
    >
      <input name="requestId" type="hidden" value={requestState?.id ?? ""} />
      <label className="access-field">
        <span>Verification code</span>
        <input
          autoComplete="one-time-code"
          inputMode="numeric"
          name="code"
          pattern="[0-9]{6}"
          placeholder="6-digit code"
          required
          type="text"
        />
      </label>
      <button className="access-submit access-submit-wide" type="submit">
        Verify phone
      </button>
    </form>
  );
}

function PendingApprovalPanel({
  requestState,
}: {
  requestState: AccessRequestPreview | null;
}) {
  return (
    <div className="access-pending">
      <div>
        <span>Group</span>
        <strong>{requestState?.groupName ?? "Pending group"}</strong>
      </div>
      <div>
        <span>Phone</span>
        <strong>{requestState?.maskedPhone ?? "Pending phone"}</strong>
      </div>
      <Link className="access-link-button" href="/">
        Back to sign in
      </Link>
    </div>
  );
}

export default function AccessGate({
  authStatus,
  errorMessage,
  groups,
  mode,
  requestState,
}: AccessGateProps) {
  const backdrop = selectBackdrop({
    industry: "commercial construction",
    keywords: [
      "referral verified",
      "commercial transition sphere",
      "commercial",
      "construction",
      "contractor",
      "member access",
    ],
    pageKind: "login",
    tone: "brand",
  });
  const backdropStyles = {
    "--gate-sky-start": backdrop.theme.skyStart,
    "--gate-sky-mid": backdrop.theme.skyMid,
    "--gate-sky-end": backdrop.theme.skyEnd,
    "--gate-glow-a": backdrop.theme.glowA,
    "--gate-glow-b": backdrop.theme.glowB,
    "--gate-accent-start": backdrop.theme.accentStart,
    "--gate-accent-mid": backdrop.theme.accentMid,
    "--gate-accent-end": backdrop.theme.accentEnd,
    "--gate-label-color": backdrop.theme.label,
    "--gate-heading-color": backdrop.theme.heading,
    "--gate-button-start": backdrop.theme.buttonStart,
    "--gate-button-end": backdrop.theme.buttonEnd,
  } as CSSProperties;
  const showPreviewCode =
    authStatus.devPreviewSmsFallback &&
    mode === "verify" &&
    requestState?.previewCode;

  return (
    <main
      className="access-gate"
      data-backdrop-family={backdrop.family}
      data-backdrop-variant={backdrop.variant}
      style={backdropStyles}
    >
      <BackdropScene className="access-backdrop" decision={backdrop} />
      <section className="access-shell">
        <div className="access-card" data-mode={mode}>
          <div className="access-card-top">
            <NavSwitch current={mode} />
          </div>
          <div className="access-card-body">
            <div className="access-body-copy">
              {mode === "sign-in" && (
                <>
                  <GateHeader
                    subtitle="Member access."
                    title="Sign in"
                  />
                  <SignInForm disabled={!authStatus.signInReady} />
                </>
              )}

              {mode === "request" && (
                <>
                  <GateHeader
                    subtitle="Verify your phone to continue."
                    title="Request access"
                  />
                  <RequestAccessForm
                    disabled={!authStatus.requestAccessReady}
                    groups={groups}
                  />
                </>
              )}

              {mode === "verify" && (
                <>
                  <GateHeader
                    subtitle={`Enter the code sent to ${requestState?.maskedPhone ?? "your phone"}.`}
                    title="Verify phone"
                  />
                  <VerifyPhoneForm requestState={requestState} />
                </>
              )}

              {mode === "pending" && (
                <>
                  <GateHeader
                    subtitle="Waiting on group approval."
                    title="Request received"
                  />
                  <PendingApprovalPanel requestState={requestState} />
                </>
              )}

              {errorMessage ? (
                <p className="access-alert" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              {showPreviewCode ? (
                <p className="access-dev-note">
                  Local preview code: {requestState.previewCode}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
