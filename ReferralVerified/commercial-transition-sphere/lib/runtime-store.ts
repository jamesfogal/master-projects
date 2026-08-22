import { demoAgents, demoProjects, Project } from "./demo-data";

type AgentStatus = (typeof demoAgents)[number]["status"];

export type DashboardAgent = {
  id: string;
  name: string;
  jurisdiction: string;
  category: string;
  status: AgentStatus;
  cadence: string;
  blocker?: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  totalEvents: number;
  successRate: number;
};

export type EvidenceItem = {
  id: string;
  sourceId: string;
  sourceName: string;
  jurisdiction: string;
  category: string;
  title: string;
  excerpt: string;
  eventType: string;
  sourceUrl: string;
  sourcePage: string | null;
  occurredAt: string | null;
  discoveredAt: string;
  addressRaw: string | null;
  organizationRaw: string | null;
  confidence: number;
  reviewState: "needs_review" | "rejected";
};

type QueueRunResult = {
  sourceId: string;
  status: AgentStatus;
  eventsCreated: number;
  message: string;
};

type SignalInput = {
  address: string;
  city: string;
  suite?: string;
  name?: string;
  signalType?: string;
  detail: string;
  evidenceUrl?: string;
};

type RuntimeStore = {
  agents: DashboardAgent[];
  projects: Project[];
  evidence: EvidenceItem[];
  runQueue: string[];
  projectCounter: number;
  eventCounter: number;
  evidenceCounter: number;
  queueCounter: number;
};

const evidenceTemplates = [
  {
    title: "Commercial tenant-finish permit posted",
    excerpt:
      "Interior buildout filing references a commercial suite and listed contractor scope.",
    eventType: "permit_notice",
    addressRaw: "2201 First Capitol Drive",
    city: "St. Charles",
    organizationRaw: "Capitol Commons tenant finish",
  },
  {
    title: "Business-license filing tied to a new suite",
    excerpt:
      "New commercial license activity suggests a move-in and telecom/security setup window.",
    eventType: "business_license",
    addressRaw: "4100 Mexico Road",
    city: "St. Peters",
    organizationRaw: "Mid County retail conversion",
  },
  {
    title: "Planning agenda references commercial conversion",
    excerpt:
      "A planning document references a change in use with likely contractor follow-on work.",
    eventType: "planning_event",
    addressRaw: "705 Highway K",
    city: "O’Fallon",
    organizationRaw: "Highway K mixed-use suite",
  },
  {
    title: "Fire review indicates tenant improvement activity",
    excerpt:
      "Fire and life-safety review is active for a commercial address inside the county scope.",
    eventType: "fire_life_safety",
    addressRaw: "1820 Wentzville Parkway",
    city: "Wentzville",
    organizationRaw: "Wentzville service-office refresh",
  },
];

function isoMinutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function isoHoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60_000).toISOString();
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function normalizeAddress(address: string, city: string, suite?: string) {
  const parts = [
    address.trim().toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim(),
    city.trim().toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim(),
    suite?.trim().toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim() || "WHOLE BUILDING",
  ];
  return parts.join("|");
}

function stageForSignal(signalType?: string) {
  const lowered = signalType?.toLowerCase() ?? "";
  if (lowered.includes("permit")) return "Buildout";
  if (lowered.includes("license")) return "License pending";
  if (lowered.includes("leasing") || lowered.includes("property")) return "Planning";
  return "Discovery";
}

function demoMatchSet(score: number) {
  return [
    { trade: "Alarm / security", member: "Jim · Security", score: Math.min(99, score + 6), state: "new" as const },
    { trade: "Telecom", member: "AT&T", score: Math.min(96, score + 2), state: "new" as const },
    { trade: "Plumbing", member: "Open seat", score: Math.max(58, score - 4), state: "new" as const },
  ];
}

function createInitialStore(): RuntimeStore {
  const agents: DashboardAgent[] = demoAgents.map((agent, index) => ({
    id: agent.id,
    name: agent.name,
    jurisdiction: agent.jurisdiction,
    category: agent.category,
    status: agent.status,
    cadence: agent.cadence,
    blocker: agent.blocker,
    lastRunAt: agent.status === "waiting" ? null : isoMinutesAgo(18 + index * 11),
    nextRunAt: agent.status === "waiting" ? isoHoursFromNow(24 * 14) : isoHoursFromNow(12 + (index % 5) * 6),
    totalEvents: agent.records,
    successRate: agent.success,
  }));

  return {
    agents,
    projects: clone(demoProjects),
    evidence: [],
    runQueue: [],
    projectCounter: 2000,
    eventCounter: 3000,
    evidenceCounter: 4000,
    queueCounter: 0,
  };
}

declare global {
  var __transitionSphereRuntimeStore: RuntimeStore | undefined;
}

function getStore() {
  globalThis.__transitionSphereRuntimeStore ??= createInitialStore();
  return globalThis.__transitionSphereRuntimeStore;
}

function makeEvidence(agent: DashboardAgent): EvidenceItem {
  const store = getStore();
  const template = evidenceTemplates[store.evidenceCounter % evidenceTemplates.length];
  store.evidenceCounter += 1;
  return {
    id: `RAW-${store.evidenceCounter}`,
    sourceId: agent.id,
    sourceName: agent.name,
    jurisdiction: agent.jurisdiction,
    category: agent.category,
    title: template.title,
    excerpt: template.excerpt,
    eventType: template.eventType,
    sourceUrl: `https://example.com/sources/${agent.id.toLowerCase()}`,
    sourcePage: null,
    occurredAt: new Date().toISOString(),
    discoveredAt: new Date().toISOString(),
    addressRaw: template.addressRaw,
    organizationRaw: template.organizationRaw,
    confidence: 0.73 + ((store.evidenceCounter % 6) * 0.03),
    reviewState: "needs_review",
  };
}

function attachEvent(project: Project, input: { source: string; title: string; detail: string; impact: string }) {
  project.events = [
    {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      source: input.source,
      title: input.title,
      detail: input.detail,
      impact: input.impact,
    },
    ...project.events,
  ].slice(0, 8);
}

function addOrUpdateProject(input: SignalInput & { sourceLabel: string; scoreBonus: number }) {
  const store = getStore();
  const key = normalizeAddress(input.address, input.city, input.suite);
  const attached = store.projects.find(
    (project) => normalizeAddress(project.address, project.city, project.suite) === key,
  );

  if (attached) {
    const oldScore = attached.score;
    attached.signals += 1;
    attached.score = Math.min(99, attached.score + input.scoreBonus);
    attached.momentum = Math.min(24, attached.momentum + 3);
    attached.updated = "Just now";
    attachEvent(attached, {
      source: input.sourceLabel,
      title: input.signalType?.trim() || "Commercial signal",
      detail: input.detail.trim(),
      impact: `+${Math.max(4, input.scoreBonus)} refreshed signal confidence`,
    });
    if (attached.matches.length) {
      attached.matches = attached.matches.map((match, index) => ({
        ...match,
        score: Math.min(99, match.score + (index === 0 ? 3 : 1)),
      }));
    }
    return {
      projectId: attached.id,
      attachedToExisting: true,
      scoreChanges: [
        {
          trade: "Portfolio refresh",
          previousScore: oldScore,
          newScore: attached.score,
          reason: input.signalType?.trim() || "Commercial signal",
        },
      ],
    };
  }

  store.projectCounter += 1;
  const score = Math.min(96, 62 + input.scoreBonus);
  const project: Project = {
    id: `PRJ-${store.projectCounter}`,
    name: input.name?.trim() || `Commercial transition · ${input.address.trim()}`,
    address: input.address.trim(),
    city: input.city.trim(),
    suite: input.suite?.trim() || "Whole building",
    stage: stageForSignal(input.signalType),
    score,
    momentum: 7,
    updated: "Just now",
    firstSource: input.sourceLabel,
    qualifyingSource: input.sourceLabel,
    signals: 1,
    matches: demoMatchSet(score),
    events: [
      {
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        source: input.sourceLabel,
        title: input.signalType?.trim() || "Commercial signal",
        detail: input.detail.trim(),
        impact: `+${input.scoreBonus} initial opportunity signal`,
      },
    ],
  };
  store.projects = [project, ...store.projects];
  return {
    projectId: project.id,
    attachedToExisting: false,
    scoreChanges: [
      {
        trade: "New opportunity",
        previousScore: 0,
        newScore: project.score,
        reason: input.signalType?.trim() || "Commercial signal",
      },
    ],
  };
}

function runSingleAgentInternal(sourceId: string, emitEvidence: boolean) {
  const store = getStore();
  const agent = store.agents.find((current) => current.id === sourceId);
  if (!agent) throw new Error(`Unknown source agent: ${sourceId}`);

  agent.lastRunAt = new Date().toISOString();
  agent.nextRunAt = isoHoursFromNow(agent.cadence.includes("Daily") ? 24 : 24 * 7);

  if (agent.status === "waiting") {
    return {
      sourceId,
      status: agent.status,
      records: agent.totalEvents,
      successRate: agent.successRate,
      eventsCreated: 0,
      message: "Record request is still pending; no new public file was available.",
    };
  }

  if (agent.status === "blocked") {
    return {
      sourceId,
      status: agent.status,
      records: agent.totalEvents,
      successRate: agent.successRate,
      eventsCreated: 0,
      message: "Source is still blocked and needs a manual connector or parser update.",
    };
  }

  let eventsCreated = 0;
  if (emitEvidence) {
    store.evidence = [makeEvidence(agent), ...store.evidence].slice(0, 150);
    eventsCreated = 1;
  }
  agent.totalEvents += eventsCreated;
  if (agent.status === "attention" && eventsCreated > 0) {
    agent.status = "healthy";
    agent.successRate = Math.min(99, agent.successRate + 6);
  }

  return {
    sourceId,
    status: agent.status,
    records: agent.totalEvents,
    successRate: agent.successRate,
    eventsCreated,
    message:
      eventsCreated > 0
        ? "Captured a fresh official-source item for review."
        : "Checked the source successfully; no new qualifying item was found.",
  };
}

export function getDashboardState() {
  const store = getStore();
  return {
    projects: clone(store.projects),
    agents: clone(store.agents),
  };
}

export function getSourceAgents() {
  return clone(getStore().agents);
}

export function getEvidenceQueue() {
  return clone(getStore().evidence);
}

export function queueDueAgents(forceAll: boolean) {
  const store = getStore();
  const queued = new Set(store.runQueue);
  const dueAgents = store.agents
    .filter((agent) => forceAll || agent.status !== "waiting")
    .filter((agent) => !queued.has(agent.id))
    .map((agent) => agent.id);
  store.runQueue.push(...dueAgents);
  return dueAgents.length;
}

export function processQueuedAgents(limit: number) {
  const store = getStore();
  const batch = store.runQueue.splice(0, Math.max(1, limit));
  const results: QueueRunResult[] = batch.map((sourceId, index) => {
    store.queueCounter += 1;
    const emitEvidence = store.queueCounter % 3 === 0 || index === 0;
    const result = runSingleAgentInternal(sourceId, emitEvidence);
    return {
      sourceId,
      status: result.status,
      eventsCreated: result.eventsCreated,
      message: result.message,
    };
  });
  return {
    processed: results.length,
    remaining: store.runQueue.length,
    results,
  };
}

export function runSourceAgent(sourceId: string) {
  return runSingleAgentInternal(sourceId, true);
}

export function createMemberSignal(input: SignalInput) {
  const store = getStore();
  store.eventCounter += 1;
  const result = addOrUpdateProject({
    ...input,
    sourceLabel: "Member field signal",
    scoreBonus: 10,
  });
  return {
    projectId: result.projectId,
    rawEventId: `RAW-${store.eventCounter}`,
    attachedToExisting: result.attachedToExisting,
    scoreChanges: result.scoreChanges,
  };
}

export function approveEvidence(input: {
  rawEventId: string;
  address: string;
  city: string;
  suite?: string;
  name?: string;
}) {
  const store = getStore();
  const evidence = store.evidence.find((item) => item.id === input.rawEventId);
  if (!evidence) throw new Error("Evidence record not found");
  store.evidence = store.evidence.filter((item) => item.id !== input.rawEventId);
  const result = addOrUpdateProject({
    address: input.address,
    city: input.city,
    suite: input.suite,
    name: input.name || evidence.organizationRaw || evidence.title,
    signalType: evidence.title,
    detail: evidence.excerpt,
    evidenceUrl: evidence.sourceUrl,
    sourceLabel: evidence.sourceName,
    scoreBonus: 12,
  });
  return {
    projectId: result.projectId,
    rawEventId: input.rawEventId,
    attachedToExisting: result.attachedToExisting,
    scoreChanges: result.scoreChanges,
  };
}

export function rejectEvidence(rawEventId: string) {
  const store = getStore();
  const existing = store.evidence.some((item) => item.id === rawEventId);
  if (!existing) throw new Error("Evidence record not found");
  store.evidence = store.evidence.filter((item) => item.id !== rawEventId);
  return { rawEventId, status: "rejected" as const };
}
