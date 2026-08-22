import AccessGate from "./access-gate";
import {
  getAccessRequestPreview,
  listAccessGroups,
} from "../lib/access-store";
import { getAuthConfigurationStatus, getSession } from "../lib/session-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    requestId?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid_credentials":
      return "Email or password not recognized.";
    case "invalid_code":
      return "That code did not match.";
    case "expired_code":
      return "That code expired. Request a new one.";
    case "pending_approval":
      return "Your request is still waiting for approval.";
    case "existing_member":
      return "That email already has access.";
    case "request_access_unavailable":
      return "Request access is not configured yet.";
    case "invalid_request":
      return "That request could not be found.";
    case "access_rejected":
      return "This request needs an administrator review.";
    case "invalid_input":
      return "Please complete every required field.";
    default:
      return undefined;
  }
}

function getGateMode(mode?: string) {
  if (mode === "request" || mode === "verify" || mode === "pending") {
    return mode;
  }

  return "sign-in";
}

export default async function Home({ searchParams }: HomeProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/workspace");
  }

  const requestState = params.requestId
    ? getAccessRequestPreview(params.requestId)
    : null;

  return (
    <AccessGate
      authStatus={getAuthConfigurationStatus()}
      errorMessage={getErrorMessage(params.error)}
      groups={listAccessGroups()}
      mode={getGateMode(params.mode)}
      requestState={requestState}
    />
  );
}
