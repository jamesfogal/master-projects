import { getChatGPTUser } from "../../chatgpt-auth";
import { approveEvidence, getEvidenceQueue, rejectEvidence } from "../../../lib/runtime-store";

export async function GET() {
  try {
    return Response.json({ evidence: getEvidenceQueue() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidence queue unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await getChatGPTUser();
    const payload = (await request.json()) as {
      action?: "approve" | "reject";
      rawEventId?: string;
      address?: string;
      city?: string;
      suite?: string;
      name?: string;
      commercialConfirmed?: boolean;
      reason?: string;
    };
    if (!payload.rawEventId || !payload.action) return Response.json({ error: "Evidence record and action are required" }, { status: 400 });
    if (payload.action === "reject") return Response.json(rejectEvidence(payload.rawEventId));
    if (!payload.commercialConfirmed) return Response.json({ error: "Commercial-use confirmation is required before creating a project" }, { status: 400 });
    if (!payload.address?.trim() || !payload.city?.trim()) return Response.json({ error: "Verified address and city are required" }, { status: 400 });
    const result = approveEvidence({
      rawEventId: payload.rawEventId,
      address: payload.address,
      city: payload.city,
      suite: payload.suite,
      name: payload.name,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidence review failed" }, { status: 500 });
  }
}
