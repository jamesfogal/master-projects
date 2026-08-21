import AccessGate from "./access-gate";
import TransitionSphereApp from "./transition-sphere-app";
import { getAuthConfigurationStatus, getSession } from "../lib/session-auth";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "invalid_code") {
    return "That code was not recognized.";
  }

  if (error === "config_missing") {
    return "The login route is not fully configured yet.";
  }

  return undefined;
}

export default async function Home({ searchParams }: HomeProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (!session) {
    return (
      <AccessGate
        authStatus={getAuthConfigurationStatus()}
        errorMessage={getErrorMessage(params.error)}
      />
    );
  }

  return <TransitionSphereApp role={session.role} />;
}
