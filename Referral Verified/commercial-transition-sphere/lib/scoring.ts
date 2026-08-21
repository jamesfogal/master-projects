import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  members,
  projectMemberMatches,
  projects,
  scoreHistory,
  tradeOpportunities,
} from "../db/schema";
import { makeId } from "./server-data";

type SignalRule = { base: number; trades: Record<string, number> };

const rules: Record<string, SignalRule> = {
  "Member field signal": { base: 16, trades: { "General contractor": 1, "Telecom": 0.9, "Alarm / security": 0.9, "Locks / access": 0.8, "Signage": 0.7 } },
  "Permit or inspection": { base: 26, trades: { "Electrical": 1, "Plumbing": 1, "HVAC": 0.95, "Alarm / security": 0.9, "Fire suppression": 0.9, "Locks / access": 0.75, "Signage": 0.7, "Telecom": 0.75 } },
  "Tenant / license activity": { base: 18, trades: { "Telecom": 1, "Signage": 1, "Locks / access": 0.9, "Alarm / security": 0.9, "Commercial insurance": 0.85, "Commercial moving": 0.8, "Electrical": 0.65 } },
  "Property / leasing activity": { base: 14, trades: { "General contractor": 0.85, "Commercial moving": 1, "Telecom": 0.8, "Signage": 0.8, "Locks / access": 0.75, "Alarm / security": 0.75 } },
  "Utility activity": { base: 20, trades: { "Telecom": 1, "Electrical": 0.95, "Commercial moving": 0.9, "Alarm / security": 0.9, "Locks / access": 0.75 } },
  Other: { base: 10, trades: { "General contractor": 0.7, "Telecom": 0.6, "Alarm / security": 0.6 } },
};

function memberFitsTrade(memberTrade: string, trade: string) {
  const a = memberTrade.toLowerCase();
  const b = trade.toLowerCase();
  if (b === "telecom") return a.includes("telecom");
  if (b === "alarm / security") return a.includes("alarm") || a.includes("security");
  if (b === "locks / access") return a.includes("lock") || a.includes("access");
  return a.includes(b.split(" /")[0]) || b.includes(a.split(" /")[0]);
}

export async function scoreSignal(projectId: string, signalType: string, rawEventId: string) {
  const db = await getDb();
  const rule = rules[signalType] ?? rules.Other;
  const activeMembers = await db.select().from(members).where(eq(members.active, true));
  let highScore = 0;
  let qualifying = false;
  const changes: Array<{ trade: string; previous: number; score: number }> = [];

  for (const [trade, relevance] of Object.entries(rule.trades)) {
    const [existing] = await db
      .select()
      .from(tradeOpportunities)
      .where(and(eq(tradeOpportunities.projectId, projectId), eq(tradeOpportunities.trade, trade)))
      .limit(1);
    const previous = existing?.score ?? 0;
    const corroborationBonus = existing ? 7 : 0;
    const score = Math.min(100, Math.round(previous * 0.72 + rule.base * relevance * 0.78 + corroborationBonus + 5));
    const opportunityId = existing?.id ?? makeId("OPP");
    const reasons = [
      `${signalType}: ${rule.base} base points`,
      `${Math.round(relevance * 100)}% relevance to ${trade}`,
      "78% intake confidence",
      existing ? "Corroboration bonus applied" : "New trade opportunity",
    ];
    if (existing) {
      await db.update(tradeOpportunities).set({ score, explanationJson: JSON.stringify(reasons), lastCalculatedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).where(eq(tradeOpportunities.id, opportunityId));
    } else {
      await db.insert(tradeOpportunities).values({ id: opportunityId, projectId, trade, score, explanationJson: JSON.stringify(reasons), status: "open" });
      const member = activeMembers.find((candidate) => memberFitsTrade(candidate.primaryTrade, trade));
      await db.insert(projectMemberMatches).values({ id: makeId("MAT"), projectId, tradeOpportunityId: opportunityId, memberId: member?.id ?? null, score, status: "new" });
    }
    await db.insert(scoreHistory).values({
      id: makeId("SCH"), projectId, tradeOpportunityId: opportunityId, trade,
      previousScore: previous, newScore: score,
      reason: reasons.join(" · "), sourceEventId: rawEventId,
    });
    highScore = Math.max(highScore, score);
    qualifying ||= score >= 60;
    changes.push({ trade, previous: Math.round(previous), score });
  }

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  await db.update(projects).set({
    overallScore: Math.max(project?.overallScore ?? 0, highScore),
    momentum: Math.min(30, (project?.momentum ?? 0) + 5),
    qualifyingSourceId: qualifying ? "SYS-MEMBER" : project?.qualifyingSourceId,
    updatedAt: new Date().toISOString(),
  }).where(eq(projects.id, projectId));
  return changes;
}
