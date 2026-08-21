import { getChatGPTUser } from "../../chatgpt-auth";
import { createMemberSignal } from "../../../lib/runtime-store";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { address?: string; city?: string; suite?: string; name?: string; signalType?: string; detail?: string; evidenceUrl?: string };
    const address = payload.address?.trim() ?? "";
    const city = payload.city?.trim() ?? "";
    const detail = payload.detail?.trim() ?? "";
    if (!address || !city || !detail) return Response.json({ error: "Address, city and signal detail are required." }, { status: 400 });
    await getChatGPTUser();
    const result = createMemberSignal({
      address,
      city,
      suite: payload.suite,
      name: payload.name,
      signalType: payload.signalType?.trim() || "Member field signal",
      detail,
      evidenceUrl: payload.evidenceUrl,
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Signal could not be saved" }, { status: 500 });
  }
}
