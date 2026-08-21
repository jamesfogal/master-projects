import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  agentRuns,
  auditLogs,
  buildings,
  members,
  organizations,
  projectEvents,
  projectMemberMatches,
  projects,
  rawEvents,
  referrals,
  scoreHistory,
  sources,
  spaces,
  systemSettings,
  tradeOpportunities,
} from "../db/schema";
import { demoAgents, demoMembers, demoProjects, Project } from "./demo-data";
import { agentTypeFor, connectorFor, sourcePurpose, sourceUrls } from "./source-catalog";

export function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

const projectSources: Record<string, { first: string; qualifying: string }> = {
  "PRJ-1001": { first: "SRC-012", qualifying: "SRC-010" },
  "PRJ-1002": { first: "SRC-003", qualifying: "SRC-031" },
  "PRJ-1003": { first: "SRC-024", qualifying: "SRC-023" },
  "PRJ-1004": { first: "SRC-021", qualifying: "SRC-019" },
};

function normalizeAddress(address: string, city: string) {
  return `${address.trim().toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim()}|${city.trim().toUpperCase()}`;
}

function memberForMatch(memberName: string, trade: string) {
  if (memberName.startsWith("Jim")) return "MBR-001";
  if (memberName === "AT&T") return "MBR-002";
  if (memberName === "Spectrum") return "MBR-003";
  const tradeLower = trade.toLowerCase();
  const found = demoMembers.find((member) =>
    member.trade.toLowerCase().includes(tradeLower.split(" /")[0]) ||
    tradeLower.includes(member.trade.toLowerCase().split(" /")[0]),
  );
  return found?.id ?? null;
}

export async function ensureSeedData() {
  const db = await getDb();
  const existing = await db.select({ id: sources.id }).from(sources).limit(1);
  if (existing.length) {
    const currentSources = await db.select().from(sources);
    const currentById = new Map(currentSources.map((source) => [source.id, source]));
    for (const agent of demoAgents) {
      const current = currentById.get(agent.id);
      const connector = connectorFor(agent.id);
      if (!current || (current.parserVersion === "v2" && current.url === sourceUrls[agent.id] && current.agentType === connector.mode)) continue;
      await db.update(sources).set({
        url: sourceUrls[agent.id],
        agentType: agentTypeFor(agent.id),
        connectorConfigJson: JSON.stringify(connector),
        cadence: `${connector.cadenceHours}h`,
        parserVersion: "v2",
        updatedAt: new Date().toISOString(),
      }).where(eq(sources.id, agent.id));
    }
    return;
  }

  const now = new Date().toISOString();
  await db.insert(sources).values([
    ...demoAgents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      jurisdiction: agent.jurisdiction,
      category: agent.category,
      url: sourceUrls[agent.id],
      agentType: agentTypeFor(agent.id),
      connectorConfigJson: JSON.stringify(connectorFor(agent.id)),
      parserVersion: "v2",
      cadence: `${connectorFor(agent.id).cadenceHours}h`,
      status: agent.status,
      active: true,
      parserState: agent.status === "healthy" ? "ready" : agent.status === "waiting" ? "waiting_records" : "discovery",
      blocker: agent.blocker,
      lastRunAt: agent.status === "waiting" ? null : now,
      nextRunAt: new Date(Date.now() + (agent.cadence === "Daily" ? 86_400_000 : 604_800_000)).toISOString(),
      successRate: agent.success,
      totalRuns: agent.status === "waiting" ? 0 : 1,
      totalEvents: agent.records,
    })),
    {
      id: "SYS-MEMBER",
      name: "Member field-signal intake",
      jurisdiction: "St. Charles County",
      category: "Member signals",
      url: "internal://member-signal-intake",
      agentType: "member-intake",
      cadence: "continuous",
      status: "healthy",
      active: false,
      parserState: "ready",
      successRate: 100,
      totalRuns: 0,
      totalEvents: 0,
    },
  ]);

  await db.insert(members).values(demoMembers.map((member, index) => ({
    id: member.id,
    company: member.company,
    contactName: member.contact,
    primaryTrade: member.trade,
    territoryJson: JSON.stringify([member.territory]),
    active: member.active,
    seatNumber: index + 1,
  })));

  for (const [index, project] of demoProjects.entries()) {
    const buildingId = `BLD-${1001 + index}`;
    const spaceId = `SPC-${1001 + index}`;
    const organizationId = `ORG-${1001 + index}`;
    const sourcesForProject = projectSources[project.id];
    await db.insert(buildings).values({
      id: buildingId,
      normalizedAddress: normalizeAddress(project.address, project.city),
      address1: project.address,
      city: project.city,
      commercialVerified: true,
    });
    await db.insert(spaces).values({ id: spaceId, buildingId, label: project.suite });
    await db.insert(organizations).values({
      id: organizationId,
      name: project.name.replace("Demo · ", ""),
      organizationType: "tenant",
    });
    await db.insert(projects).values({
      id: project.id,
      buildingId,
      spaceId,
      organizationId,
      name: project.name,
      stage: project.stage,
      firstSourceId: sourcesForProject.first,
      qualifyingSourceId: sourcesForProject.qualifying,
      overallScore: project.score,
      momentum: project.momentum,
      signalCount: project.signals,
      demo: true,
      status: "active",
      lastSignalAt: now,
    });

    for (const [eventIndex, event] of project.events.entries()) {
      const rawEventId = `RAW-${project.id}-${eventIndex + 1}`;
      await db.insert(rawEvents).values({
        id: rawEventId,
        sourceId: event.source,
        sourceRecordId: `${project.id}-${eventIndex + 1}`,
        sourceUrl: sourceUrls[event.source],
        title: event.title,
        excerpt: event.detail,
        eventType: "demo_signal",
        occurredAt: now,
        addressRaw: `${project.address}, ${project.city}`,
        organizationRaw: project.name,
        payloadJson: JSON.stringify({ demonstration: true, impact: event.impact }),
        confidence: 0.9,
        reviewState: "demo",
      });
      await db.insert(projectEvents).values({
        id: `EVT-${project.id}-${eventIndex + 1}`,
        projectId: project.id,
        rawEventId,
        sourceId: event.source,
        eventType: "demo_signal",
        title: event.title,
        detail: event.detail,
        impactJson: JSON.stringify({ summary: event.impact }),
        occurredAt: now,
      });
    }

    for (const [matchIndex, match] of project.matches.entries()) {
      const opportunityId = `OPP-${project.id}-${matchIndex + 1}`;
      const matchId = `MAT-${project.id}-${matchIndex + 1}`;
      const memberId = memberForMatch(match.member, match.trade);
      await db.insert(tradeOpportunities).values({
        id: opportunityId,
        projectId: project.id,
        trade: match.trade,
        score: match.score,
        status: match.state === "working" ? "claimed" : "open",
        explanationJson: JSON.stringify(["Demonstration score", `${project.signals} corroborating signals`]),
      });
      await db.insert(projectMemberMatches).values({
        id: matchId,
        projectId: project.id,
        tradeOpportunityId: opportunityId,
        memberId,
        score: match.score,
        status: match.state,
      });
      await db.insert(scoreHistory).values({
        id: `SCH-${project.id}-${matchIndex + 1}`,
        projectId: project.id,
        tradeOpportunityId: opportunityId,
        trade: match.trade,
        previousScore: 0,
        newScore: match.score,
        reason: "Demonstration seed showing trade-specific score history",
      });
      if (match.state !== "new") {
        await db.insert(referrals).values({
          id: `REF-${project.id}-${matchIndex + 1}`,
          projectMemberMatchId: matchId,
          projectId: project.id,
          memberId,
          firstSourceId: sourcesForProject.first,
          qualifyingSourceId: sourcesForProject.qualifying,
          contributingSourceIdsJson: JSON.stringify(project.events.map((event) => event.source)),
          status: match.state,
          sentAt: now,
          acceptedAt: match.state === "accepted" || match.state === "working" ? now : null,
          estimateAmount: matchIndex === 0 ? 18_500 : null,
        });
      }
    }
  }

  await db.insert(systemSettings).values([
    { key: "scope", valueJson: JSON.stringify({ county: "St. Charles", state: "MO", commercialOnly: true }), description: "Geographic and privacy scope" },
    { key: "agent_policy", valueJson: JSON.stringify({ humanReviewBeforeReferral: true, preserveEvidence: true, utilityUsageProhibited: true }), description: "Non-negotiable agent guardrails" },
    { key: "source_purpose", valueJson: JSON.stringify(sourcePurpose), description: "Why each signal family exists" },
  ]);
}

export async function getSourceAgents() {
  await ensureSeedData();
  return (await getDb()).select().from(sources).where(eq(sources.active, true)).orderBy(asc(sources.id));
}

export async function getDashboardProjects(): Promise<Project[]> {
  await ensureSeedData();
  const db = await getDb();
  const projectRows = await db
    .select({ project: projects, building: buildings, space: spaces })
    .from(projects)
    .innerJoin(buildings, eq(projects.buildingId, buildings.id))
    .leftJoin(spaces, eq(projects.spaceId, spaces.id))
    .where(eq(projects.status, "active"))
    .orderBy(desc(projects.overallScore));
  const sourceRows = await db.select().from(sources);
  const memberRows = await db.select().from(members);
  const sourceById = new Map(sourceRows.map((source) => [source.id, source]));
  const memberById = new Map(memberRows.map((member) => [member.id, member]));
  const result: Project[] = [];

  for (const row of projectRows) {
    const opportunities = await db
      .select({ opportunity: tradeOpportunities, match: projectMemberMatches })
      .from(tradeOpportunities)
      .leftJoin(projectMemberMatches, eq(projectMemberMatches.tradeOpportunityId, tradeOpportunities.id))
      .where(eq(tradeOpportunities.projectId, row.project.id))
      .orderBy(desc(tradeOpportunities.score));
    const events = await db
      .select()
      .from(projectEvents)
      .where(eq(projectEvents.projectId, row.project.id))
      .orderBy(desc(projectEvents.occurredAt));
    result.push({
      id: row.project.id,
      name: row.project.name,
      address: row.building.address1,
      city: row.building.city,
      suite: row.space?.label ?? "Whole building",
      stage: row.project.stage,
      score: Math.round(row.project.overallScore),
      momentum: Math.round(row.project.momentum),
      updated: row.project.lastSignalAt ? new Date(row.project.lastSignalAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No signals",
      firstSource: sourceById.get(row.project.firstSourceId ?? "")?.name ?? "Member field signal",
      qualifyingSource: sourceById.get(row.project.qualifyingSourceId ?? "")?.name ?? "Awaiting qualifying signal",
      signals: row.project.signalCount,
      matches: opportunities.map(({ opportunity, match }) => ({
        trade: opportunity.trade,
        member: match?.memberId ? memberById.get(match.memberId)?.company ?? "Open seat" : "Open seat",
        score: Math.round(opportunity.score),
        state: (match?.status ?? "new") as "new" | "sent" | "accepted" | "working",
      })),
      events: events.map((event) => ({
        date: new Date(event.occurredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        source: event.sourceId,
        title: event.title,
        detail: event.detail,
        impact: (JSON.parse(event.impactJson) as { summary?: string }).summary ?? "Score recalculated",
      })),
    });
  }
  return result;
}

export async function audit(actorEmail: string | null, action: string, entityType: string, entityId: string, after: unknown) {
  await (await getDb()).insert(auditLogs).values({
    id: makeId("AUD"),
    actorEmail,
    action,
    entityType,
    entityId,
    afterJson: JSON.stringify(after),
  });
}

export async function findOrCreateSignalProject(input: {
  address: string;
  city: string;
  suite?: string;
  name?: string;
  signalType: string;
  detail: string;
  evidenceUrl?: string;
  actorEmail: string | null;
}) {
  await ensureSeedData();
  const db = await getDb();
  const normalized = normalizeAddress(input.address, input.city);
  let [building] = await db.select().from(buildings).where(eq(buildings.normalizedAddress, normalized)).limit(1);
  if (!building) {
    building = {
      id: makeId("BLD"), normalizedAddress: normalized, address1: input.address.trim(), city: input.city.trim(), state: "MO", postalCode: null, parcelId: null, latitude: null, longitude: null, commercialVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await db.insert(buildings).values({ id: building.id, normalizedAddress: building.normalizedAddress, address1: building.address1, city: building.city, commercialVerified: true });
  }
  let [space] = await db.select().from(spaces).where(and(eq(spaces.buildingId, building.id), eq(spaces.label, input.suite?.trim() || "Whole building"))).limit(1);
  if (!space) {
    const spaceId = makeId("SPC");
    await db.insert(spaces).values({ id: spaceId, buildingId: building.id, label: input.suite?.trim() || "Whole building" });
    [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId)).limit(1);
  }
  let [project] = await db.select().from(projects).where(and(eq(projects.buildingId, building.id), eq(projects.spaceId, space.id), eq(projects.status, "active"))).limit(1);
  if (!project) {
    const projectId = makeId("PRJ");
    const organizationId = input.name?.trim() ? makeId("ORG") : null;
    if (organizationId) await db.insert(organizations).values({ id: organizationId, name: input.name!.trim(), organizationType: "tenant" });
    await db.insert(projects).values({
      id: projectId,
      buildingId: building.id,
      spaceId: space.id,
      organizationId,
      name: input.name?.trim() || `${input.address} commercial transition`,
      stage: "discovery",
      firstSourceId: "SYS-MEMBER",
      overallScore: 0,
      momentum: 0,
      signalCount: 0,
      demo: false,
      status: "active",
    });
    [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  }
  const rawEventId = makeId("RAW");
  const eventId = makeId("EVT");
  const now = new Date().toISOString();
  await db.insert(rawEvents).values({
    id: rawEventId,
    sourceId: "SYS-MEMBER",
    sourceRecordId: rawEventId,
    sourceUrl: input.evidenceUrl?.trim() || "internal://member-signal-intake",
    title: input.signalType,
    excerpt: input.detail.trim(),
    eventType: input.signalType,
    occurredAt: now,
    addressRaw: `${input.address}, ${input.city}`,
    organizationRaw: input.name?.trim(),
    payloadJson: JSON.stringify({ suite: input.suite?.trim() || null, commercialOnly: true }),
    confidence: 0.78,
    reviewState: "needs_review",
  });
  await db.insert(projectEvents).values({
    id: eventId,
    projectId: project.id,
    rawEventId,
    sourceId: "SYS-MEMBER",
    eventType: input.signalType,
    title: input.signalType,
    detail: input.detail.trim(),
    impactJson: JSON.stringify({ summary: "New member signal · scoring refreshed" }),
    occurredAt: now,
  });
  await db.update(projects).set({ signalCount: project.signalCount + 1, lastSignalAt: now, updatedAt: now }).where(eq(projects.id, project.id));
  await db.update(sources).set({ totalEvents: 1, lastRunAt: now, updatedAt: now }).where(eq(sources.id, "SYS-MEMBER"));
  await audit(input.actorEmail, "signal.created", "project", project.id, { rawEventId, eventId, input });
  return { projectId: project.id, rawEventId, attachedToExisting: project.signalCount > 0 };
}

export async function promoteEvidenceToProject(input: {
  rawEventId: string;
  address: string;
  city: string;
  suite?: string;
  name?: string;
  actorEmail: string | null;
}) {
  await ensureSeedData();
  const db = await getDb();
  const [rawEvent] = await db.select().from(rawEvents).where(eq(rawEvents.id, input.rawEventId)).limit(1);
  if (!rawEvent) throw new Error("Evidence record not found");
  if (rawEvent.reviewState !== "needs_review") throw new Error("Evidence record has already been reviewed");
  const normalized = normalizeAddress(input.address, input.city);
  let [building] = await db.select().from(buildings).where(eq(buildings.normalizedAddress, normalized)).limit(1);
  if (!building) {
    const buildingId = makeId("BLD");
    await db.insert(buildings).values({ id: buildingId, normalizedAddress: normalized, address1: input.address.trim(), city: input.city.trim(), commercialVerified: true });
    [building] = await db.select().from(buildings).where(eq(buildings.id, buildingId)).limit(1);
  }
  const spaceLabel = input.suite?.trim() || "Whole building";
  let [space] = await db.select().from(spaces).where(and(eq(spaces.buildingId, building.id), eq(spaces.label, spaceLabel))).limit(1);
  if (!space) {
    const spaceId = makeId("SPC");
    await db.insert(spaces).values({ id: spaceId, buildingId: building.id, label: spaceLabel });
    [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId)).limit(1);
  }
  let [project] = await db.select().from(projects).where(and(eq(projects.buildingId, building.id), eq(projects.spaceId, space.id), eq(projects.status, "active"))).limit(1);
  const attachedToExisting = Boolean(project);
  if (!project) {
    const projectId = makeId("PRJ");
    const organizationId = input.name?.trim() ? makeId("ORG") : null;
    if (organizationId) await db.insert(organizations).values({ id: organizationId, name: input.name!.trim(), organizationType: "tenant" });
    await db.insert(projects).values({
      id: projectId, buildingId: building.id, spaceId: space.id, organizationId,
      name: input.name?.trim() || rawEvent.organizationRaw || rawEvent.title,
      projectType: "tenant_transition", stage: rawEvent.eventType === "planning_event" ? "planning" : "discovery",
      firstSourceId: rawEvent.sourceId, overallScore: 0, momentum: 0, signalCount: 0,
      demo: false, status: "active",
    });
    [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  }
  const occurredAt = rawEvent.occurredAt ?? rawEvent.createdAt;
  const projectEventId = makeId("EVT");
  await db.insert(projectEvents).values({
    id: projectEventId, projectId: project.id, rawEventId: rawEvent.id, sourceId: rawEvent.sourceId,
    eventType: rawEvent.eventType, title: rawEvent.title, detail: rawEvent.excerpt,
    impactJson: JSON.stringify({ summary: "Verified official-source evidence · trade scores refreshed" }), occurredAt,
  });
  const now = new Date().toISOString();
  await db.update(rawEvents).set({ reviewState: "approved", addressRaw: `${input.address.trim()}, ${input.city.trim()}`, organizationRaw: input.name?.trim() || rawEvent.organizationRaw }).where(eq(rawEvents.id, rawEvent.id));
  await db.update(projects).set({ signalCount: project.signalCount + 1, lastSignalAt: occurredAt, updatedAt: now }).where(eq(projects.id, project.id));
  await audit(input.actorEmail, "evidence.approved", "project", project.id, { rawEventId: rawEvent.id, projectEventId, attachedToExisting, address: input.address, city: input.city });
  return { projectId: project.id, rawEventId: rawEvent.id, attachedToExisting };
}

export async function rejectEvidence(rawEventId: string, actorEmail: string | null, reason?: string) {
  const db = await getDb();
  const [rawEvent] = await db.select().from(rawEvents).where(eq(rawEvents.id, rawEventId)).limit(1);
  if (!rawEvent) throw new Error("Evidence record not found");
  await db.update(rawEvents).set({ reviewState: "rejected" }).where(eq(rawEvents.id, rawEventId));
  await audit(actorEmail, "evidence.rejected", "raw_event", rawEventId, { reason: reason?.trim() || "Not a verified commercial opportunity" });
  return { rawEventId, status: "rejected" };
}

export { agentRuns, sources, projects, tradeOpportunities, projectMemberMatches, scoreHistory };
