import type { AuthConfigurationStatus } from "../lib/session-auth";

type AccessGateProps = {
  authStatus: AuthConfigurationStatus;
  errorMessage?: string;
};

function StatusBadge({
  ready,
  label,
}: {
  ready: boolean;
  label: string;
}) {
  return (
    <span className={`access-status ${ready ? "is-ready" : "is-missing"}`}>
      <i />
      {label}
    </span>
  );
}

export default function AccessGate({
  authStatus,
  errorMessage,
}: AccessGateProps) {
  const configMessage = !authStatus.loginReady
    ? "Set the Commercial Transition Sphere access codes and session secret before using this route."
    : authStatus.devDefaultsActive
      ? "Local preview defaults are active until production env vars are set."
      : "Private session access is configured.";

  return (
    <main className="access-gate">
      <section className="access-hero">
        <div className="access-copy">
          <span className="access-eyebrow">
            PRIVATE WORKSPACE · REFERRAL VERIFIED
          </span>
          <h1>Commercial Transition Sphere</h1>
          <p>
            No member, project, or source data is rendered until an approved
            code creates a private session.
          </p>
          <div className="access-points">
            <span>Fast CSS and SVG shell only</span>
            <span>Commercial-only privacy gates stay active</span>
            <span>Super admin unlocks agents, evidence, and controls</span>
          </div>
        </div>

        <div className="access-visual" aria-hidden="true">
          <svg
            className="access-orbit"
            viewBox="0 0 320 320"
            role="presentation"
          >
            <defs>
              <linearGradient id="ctsGlow" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#57d1c4" />
                <stop offset="100%" stopColor="#ed6d57" />
              </linearGradient>
            </defs>
            <circle cx="160" cy="160" r="118" />
            <circle cx="160" cy="160" r="82" />
            <circle cx="160" cy="160" r="46" />
            <path d="M93 116c24-26 58-39 93-39 38 0 74 15 99 44" />
            <path d="M79 207c21 25 50 41 81 45 46 6 93-14 124-52" />
            <g className="orbit-nodes">
              <circle cx="92" cy="116" r="7" />
              <circle cx="242" cy="96" r="7" />
              <circle cx="226" cy="228" r="7" />
              <circle cx="109" cy="230" r="7" />
            </g>
            <circle className="orbit-core" cx="160" cy="160" r="20" />
          </svg>
          <div className="access-card">
            <strong>Locked until verified</strong>
            <span>Zero project data above the gate</span>
          </div>
        </div>
      </section>

      <section className="access-panel">
        <div className="access-panel-copy">
          <h2>Enter with an approved code</h2>
          <p>
            Shared access opens the private workspace. The super admin code
            reveals every screen and operational control.
          </p>
        </div>

        <div className="access-status-grid" aria-label="configuration status">
          <StatusBadge
            ready={authStatus.memberCodeReady}
            label="Shared access code"
          />
          <StatusBadge
            ready={authStatus.superAdminCodeReady}
            label="Super admin code"
          />
          <StatusBadge
            ready={authStatus.sessionSecretReady}
            label="Signed session secret"
          />
        </div>

        {errorMessage ? (
          <p className="access-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <p
          className={`access-config-note ${authStatus.loginReady ? "" : "is-warning"}`}
        >
          {configMessage}
        </p>

        <form
          action="/api/session/login"
          className="access-form"
          method="post"
        >
          <label className="access-field">
            <span>Access code</span>
            <input
              autoComplete="off"
              name="code"
              placeholder="Enter shared or super admin code"
              required
              spellCheck={false}
              type="password"
            />
          </label>
          <button
            className="access-submit"
            disabled={!authStatus.loginReady}
            type="submit"
          >
            Enter sphere
          </button>
        </form>
      </section>
    </main>
  );
}
