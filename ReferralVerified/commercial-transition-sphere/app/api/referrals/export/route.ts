import { getDashboardState } from "../../../../lib/runtime-store";
import { requireSession } from "../../../../lib/session-auth";

export const dynamic = "force-dynamic";

function escapeCsv(value: null | number | string | undefined) {
  const normalized = String(value ?? "");

  if (/[",\n\r]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

function buildCsv() {
  const { projects } = getDashboardState();
  const rows = projects.flatMap((project) =>
    project.matches.map((match) => ({
      projectId: project.id,
      projectName: project.name,
      address: project.address,
      city: project.city,
      suite: project.suite,
      stage: project.stage,
      projectScore: project.score,
      signals: project.signals,
      updated: project.updated,
      firstSource: project.firstSource,
      qualifyingSource: project.qualifyingSource,
      trade: match.trade,
      member: match.member,
      referralStage: match.state,
      referralScore: match.score,
    })),
  );

  const columns = [
    "project_id",
    "project_name",
    "address",
    "city",
    "suite",
    "stage",
    "project_score",
    "signals",
    "updated",
    "first_source",
    "qualifying_source",
    "trade",
    "member",
    "referral_stage",
    "referral_score",
  ] as const;

  const lines = [
    columns.join(","),
    ...rows.map((row) =>
      [
        row.projectId,
        row.projectName,
        row.address,
        row.city,
        row.suite,
        row.stage,
        row.projectScore,
        row.signals,
        row.updated,
        row.firstSource,
        row.qualifyingSource,
        row.trade,
        row.member,
        row.referralStage,
        row.referralScore,
      ]
        .map(escapeCsv)
        .join(","),
    ),
  ];

  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export async function GET() {
  try {
    const auth = await requireSession();

    if (!auth.ok) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const dateStamp = new Date().toISOString().slice(0, 10);
    const filename = `commercial-transition-sphere-referrals-${dateStamp}.csv`;

    return new Response(buildCsv(), {
      headers: {
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="${filename}"`,
        "content-type": "text/csv; charset=utf-8",
      },
      status: 200,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Referral export unavailable",
      },
      { status: 500 },
    );
  }
}
