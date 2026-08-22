import { redirect } from "next/navigation";
import TransitionSphereApp from "../transition-sphere-app";
import { getSession } from "../../lib/session-auth";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return <TransitionSphereApp session={session} />;
}
