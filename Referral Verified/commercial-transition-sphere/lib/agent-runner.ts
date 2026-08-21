import { and, asc, eq, isNull, lte, or } from "drizzle-orm";
import { getDb } from "../db";
import { agentRuns, rawEvents, sources } from "../db/schema";
import { connectorFor } from "./source-catalog";
import { extractEvidenceCandidates } from "./source-extraction";
import { audit, ensureSeedData, makeId } from "./server-data";

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function nextRun(cadenceHours: number) {
  return new Date(Date.now() + cadenceHours * 3_600_000).toISOString();
}

function successRate(previousRate: number, previousRuns: number, successful: boolean) {
  const priorSuccesses = Math.round((previousRate / 100) * previousRuns);
  return Math.round(((priorSuccesses + (successful ? 1 : 0)) / (previousRuns + 1)) * 1000) / 10;
}

export async function runSourceAgent(sourceId: string, actorEmail: string | null, existingRunId?: string) {
  await ensureSeedData();
  const db = await getDb();
  const [source] = await db.select().from(sources).where(eq(sources.id, sourceId)).limit(1);
  if (!source || !source.active) throw new Error("Active source agent not found");
  const connector = connectorFor(source.id);
  const runId = existingRunId ?? makeId("RUN");
  const startedAt = new Date().toISOString();
  if (existingRunId) {
    await db.update(agentRuns).set({ startedAt, status: "running", triggeredBy: actorEmail ?? "scheduler", error: null }).where(eq(agentRuns.id, existingRunId));
  } else {
    await db.insert(agentRuns).values({ id: runId, sourceId, startedAt, status: "running", triggeredBy: actorEmail ?? "system" });
  }

  if (connector.mode === "records-request" || connector.mode === "benchmark-disabled") {
    const finishedAt = new Date().toISOString();
    const waitingReason = connector.mode === "records-request" ? connector.notes : "Benchmark remains disabled until a paid-data comparison is authorized.";
    await db.update(agentRuns).set({ status: "waiting", finishedAt, parserState: connector.mode, notes: waitingReason }).where(eq(agentRuns.id, runId));
    await db.update(sources).set({ status: "waiting", parserState: connector.mode, blocker: waitingReason, lastRunAt: finishedAt, nextRunAt: nextRun(connector.cadenceHours), totalRuns: source.totalRuns + 1, successRate: 100, updatedAt: finishedAt }).where(eq(sources.id, sourceId));
    await audit(actorEmail, "agent.run", "source", sourceId, { runId, status: "waiting", connector: connector.mode });
    return { id: sourceId, runId, status: "waiting" as const, records: 0, successRate: 100, eventsCreated: 0, message: waitingReason };
  }

  const began = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "TransitionSphereCommercialIntelligence/2.0 (+public-record-monitor; St-Charles-County-MO)",
        Accept: "text/html,application/xhtml+xml,application/json,application/pdf;q=0.8,*/*;q=0.5",
      },
      redirect: "follow",
      signal: controller.signal,
    });
    const contentType = response.headers.get("content-type") ?? "unknown";
    const body = (await response.text()).slice(0, 600_000);
    const bodyChecksum = await sha256(body);
    const reachable = response.ok;
    const changed = Boolean(source.lastChecksum && source.lastChecksum !== bodyChecksum);
    const candidates = reachable && contentType.includes("html")
      ? extractEvidenceCandidates(source, connector, body, response.url || source.url)
      : [];
    let eventsCreated = 0;

    for (const candidate of candidates) {
      const sourceRecordId = (await sha256(candidate.recordKey)).slice(0, 40);
      const [existing] = await db.select({ id: rawEvents.id }).from(rawEvents)
        .where(and(eq(rawEvents.sourceId, source.id), eq(rawEvents.sourceRecordId, sourceRecordId))).limit(1);
      if (existing) continue;
      await db.insert(rawEvents).values({
        id: makeId("RAW"), sourceId: source.id, agentRunId: runId, sourceRecordId,
        sourceUrl: candidate.sourceUrl, sourcePage: candidate.sourcePage,
        title: candidate.title, excerpt: candidate.excerpt, eventType: candidate.eventType,
        occurredAt: candidate.occurredAt, addressRaw: candidate.addressRaw,
        organizationRaw: candidate.organizationRaw, payloadJson: JSON.stringify(candidate.payload),
        confidence: candidate.confidence, reviewState: "needs_review",
      });
      eventsCreated += 1;
    }

    const finishedAt = new Date().toISOString();
    const parserState = !reachable
      ? "blocked"
      : connector.mode === "portal-monitor"
        ? "portal_manual_export"
        : connector.mode === "page-monitor"
          ? "monitoring"
          : "extracting";
    const status = !reachable ? "blocked" : connector.mode === "portal-monitor" ? "attention" : "healthy";
    const blocker = !reachable
      ? `HTTP ${response.status} from the public source`
      : connector.mode === "portal-monitor"
        ? connector.notes
        : null;
    const totalRuns = source.totalRuns + 1;
    const rate = successRate(source.successRate, source.totalRuns, reachable);
    const notes = eventsCreated
      ? `${eventsCreated} new evidence item${eventsCreated === 1 ? "" : "s"} captured for review.`
      : changed
        ? "Source changed; no new commercially relevant records passed the extraction rules."
        : "Source checked; no new evidence records.";
    await db.update(agentRuns).set({
      finishedAt, status: reachable ? "completed" : "failed", httpStatus: response.status,
      contentType, latencyMs: Date.now() - began, checksum: bodyChecksum,
      recordsSeen: candidates.length, eventsCreated, parserState,
      error: reachable ? null : `HTTP ${response.status}`, notes,
    }).where(eq(agentRuns.id, runId));
    await db.update(sources).set({
      status, parserState, blocker, lastRunAt: finishedAt, nextRunAt: nextRun(connector.cadenceHours),
      lastHttpStatus: response.status, lastContentType: contentType, lastChecksum: bodyChecksum,
      successRate: rate, totalRuns, totalEvents: source.totalEvents + eventsCreated,
      parserVersion: "v2", updatedAt: finishedAt,
    }).where(eq(sources.id, sourceId));
    await audit(actorEmail, "agent.run", "source", sourceId, { runId, status, connector: connector.mode, candidates: candidates.length, eventsCreated, changed });
    return { id: sourceId, runId, status, records: candidates.length, successRate: rate, eventsCreated, message: notes };
  } catch (error) {
    const finishedAt = new Date().toISOString();
    const message = error instanceof Error ? error.message : "Source fetch failed";
    const rate = successRate(source.successRate, source.totalRuns, false);
    await db.update(agentRuns).set({ finishedAt, status: "failed", latencyMs: Date.now() - began, error: message, parserState: "blocked" }).where(eq(agentRuns.id, runId));
    await db.update(sources).set({ status: "blocked", blocker: message, parserState: "blocked", lastRunAt: finishedAt, nextRunAt: nextRun(24), totalRuns: source.totalRuns + 1, successRate: rate, updatedAt: finishedAt }).where(eq(sources.id, sourceId));
    await audit(actorEmail, "agent.run", "source", sourceId, { runId, status: "failed", error: message });
    return { id: sourceId, runId, status: "blocked" as const, records: 0, successRate: rate, eventsCreated: 0, message };
  } finally {
    clearTimeout(timer);
  }
}

export async function queueDueAgents(actorEmail: string | null, forceAll = false) {
  await ensureSeedData();
  const db = await getDb();
  const sourceRows = await db.select().from(sources)
    .where(forceAll
      ? eq(sources.active, true)
      : and(eq(sources.active, true), or(isNull(sources.nextRunAt), lte(sources.nextRunAt, new Date().toISOString()))))
    .orderBy(asc(sources.id));
  let queued = 0;
  for (const source of sourceRows) {
    const [existing] = await db.select({ id: agentRuns.id }).from(agentRuns)
      .where(and(eq(agentRuns.sourceId, source.id), eq(agentRuns.status, "queued"))).limit(1);
    if (existing) continue;
    await db.insert(agentRuns).values({ id: makeId("RUN"), sourceId: source.id, status: "queued", triggeredBy: actorEmail ?? "scheduler", notes: "Queued for independent extraction and evidence logging." });
    queued += 1;
  }
  await audit(actorEmail, "agents.queued", "source_batch", forceAll ? "all" : "due", { queued });
  return queued;
}

export async function processQueuedAgents(actorEmail: string | null, limit = 4) {
  const db = await getDb();
  const queued = await db.select().from(agentRuns).where(eq(agentRuns.status, "queued")).orderBy(asc(agentRuns.startedAt)).limit(Math.max(1, Math.min(limit, 6)));
  const settled = await Promise.allSettled(queued.map((run) => runSourceAgent(run.sourceId, actorEmail, run.id)));
  const results = await Promise.all(settled.map(async (item, index) => {
    if (item.status === "fulfilled") return item.value;
    const message = item.reason instanceof Error ? item.reason.message : "Run failed";
    await db.update(agentRuns).set({
      status: "failed",
      finishedAt: new Date().toISOString(),
      error: message,
      parserState: "blocked",
    }).where(eq(agentRuns.id, queued[index].id));
    return { id: queued[index].sourceId, runId: queued[index].id, status: "blocked" as const, records: 0, successRate: 0, eventsCreated: 0, message };
  }));
  const remainingRows = await db.select({ id: agentRuns.id }).from(agentRuns).where(eq(agentRuns.status, "queued"));
  return { results, remaining: remainingRows.length };
}
