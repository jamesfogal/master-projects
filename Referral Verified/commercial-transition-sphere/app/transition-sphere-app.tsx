"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AgentStatus,
  demoAgents,
  demoMembers,
  demoProjects,
  navItems,
  Project,
  SourceAgent,
} from "../lib/demo-data";

type ViewId = (typeof navItems)[number][0];

type EvidenceItem = {
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
  reviewState: string;
};

const statusLabels: Record<AgentStatus, string> = {
  healthy: "Healthy",
  attention: "Needs parser",
  blocked: "Blocked",
  waiting: "Waiting on records",
};

function ScoreRing({ value, size = "normal" }: { value: number; size?: "normal" | "small" }) {
  return (
    <span
      className={`score-ring ${size === "small" ? "score-ring-small" : ""}`}
      style={{ "--score": `${value * 3.6}deg` } as React.CSSProperties}
      aria-label={`Score ${value}`}
    >
      <span>{value}</span>
    </span>
  );
}

function StatusPill({ status }: { status: AgentStatus }) {
  return <span className={`status-pill status-${status}`}><i />{statusLabels[status]}</span>;
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: string }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone ?? "blue"}`}>{label.slice(0, 1)}</div>
      <div><strong>{value}</strong><span>{label}</span></div>
      <small>{detail}</small>
    </article>
  );
}

function OpportunityTable({ projects, onOpen }: { projects: Project[]; onOpen: (project: Project) => void }) {
  return (
    <div className="table-shell">
      <div className="table-titlebar">
        <div><h2>Opportunity board</h2><p>One project. Every corroborating signal. The right members.</p></div>
        <div className="legend"><span><i className="hot-dot" /> 80+ hot</span><span><i className="warm-dot" /> 60–79 warm</span></div>
      </div>
      <div className="opportunity-list">
        {projects.map((project) => (
          <button className="opportunity-row" key={project.id} onClick={() => onOpen(project)}>
            <div className="project-score"><ScoreRing value={project.score} /></div>
            <div className="project-main">
              <div className="project-title-line"><strong>{project.name}</strong><span className="stage-pill">{project.stage}</span></div>
              <span>{project.address} · {project.suite} · {project.city}</span>
              <small>{project.signals} verified signals · Updated {project.updated}</small>
            </div>
            <div className="momentum">
              <span className={project.momentum >= 0 ? "up" : "down"}>{project.momentum >= 0 ? "↑" : "↓"} {Math.abs(project.momentum)}</span>
              <small>7-day momentum</small>
            </div>
            <div className="match-stack">
              {project.matches.slice(0, 3).map((match) => (
                <span key={match.trade} className="match-chip"><b>{match.score}</b><span>{match.trade}<small>{match.member}</small></span></span>
              ))}
              {project.matches.length > 3 && <em>+{project.matches.length - 3} more</em>}
            </div>
            <span className="row-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CommandCenter({ projects, agents, evidenceCount, onOpen }: { projects: Project[]; agents: SourceAgent[]; evidenceCount: number; onOpen: (p: Project) => void }) {
  const healthy = agents.filter((agent) => agent.status === "healthy").length;
  const attention = agents.filter((agent) => agent.status === "attention" || agent.status === "blocked").length;
  const hotMatches = projects.flatMap((project) => project.matches).filter((match) => match.score >= 80).length;
  const sourceFamilyTotals = ["Permits", "Planning & zoning", "Business & licensing", "Fire & life safety", "Utility service"].map((category) => {
    const total = agents.filter((agent) => agent.category === category).reduce((sum, agent) => sum + agent.records, 0);
    return [category, Math.min(100, 12 + total * 3), total] as const;
  });
  return (
    <>
      <section className="hero-panel">
        <div>
          <span className="eyebrow">ST. CHARLES COUNTY · COMMERCIAL ONLY</span>
          <h1>Projects are moving.<br />Members should be too.</h1>
          <p>Every permit, hearing, license, fire-district record, utility request and member tip becomes one traceable project timeline.</p>
        </div>
        <div className="hero-pulse">
          <span className="pulse-orbit"><i /><i /><i /></span>
          <strong>56</strong><span>source agents</span><small>{healthy} healthy · {attention} need attention</small>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard label="Tracked projects" value={String(projects.length)} detail="Live and demonstration records are labeled" tone="navy" />
        <MetricCard label="Hot trade matches" value={String(hotMatches)} detail="Trade-specific scores of 80 or higher" tone="coral" />
        <MetricCard label="Agent coverage" value={`${healthy}/56`} detail="Across 10 signal families" tone="teal" />
        <MetricCard label="Active member seats" value="3/20" detail="Designed to expand to 40+ seats" tone="gold" />
        <MetricCard label="Evidence to review" value={String(evidenceCount)} detail="Nothing becomes a referral without verification" tone="green" />
      </section>

      <OpportunityTable projects={projects} onOpen={onOpen} />

      <section className="split-grid">
        <article className="panel signal-flow-panel">
          <div className="panel-heading"><div><h2>Signal flow</h2><p>Last 7 days by source family</p></div><button className="text-button">View evidence queue →</button></div>
          {sourceFamilyTotals.map(([label, width, count]) => (
            <div className="signal-bar" key={String(label)}><span>{label}</span><div><i style={{ width: `${width}%` }} /></div><b>{count}</b></div>
          ))}
        </article>
        <article className="panel activity-panel">
          <div className="panel-heading"><div><h2>Recent movement</h2><p>What changed, not just what exists</p></div></div>
          <ul className="activity-list">
            <li><i className="activity-high" /><div><strong>{evidenceCount} official-source items await review</strong><span>Approve only verified commercial activity</span></div><time>now</time></li>
            <li><i className="activity-mid" /><div><strong>{healthy} source agents are extracting or monitoring</strong><span>Each run retains its own status and evidence trail</span></div><time>live</time></li>
            <li><i className="activity-low" /><div><strong>{agents.filter(agent => agent.status === 'waiting').length} request agents are waiting on records</strong><span>Utility dates remain separated from private usage data</span></div><time>tracked</time></li>
            <li><i className="activity-high" /><div><strong>{projects.length} project timelines are available</strong><span>New signals attach by building and suite</span></div><time>current</time></li>
          </ul>
        </article>
      </section>
    </>
  );
}

function AgentsView({ agents, setAgents, showToast, onRunComplete }: { agents: SourceAgent[]; setAgents: (agents: SourceAgent[]) => void; showToast: (message: string) => void; onRunComplete: () => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = agents.filter((agent) => {
    const haystack = `${agent.id} ${agent.name} ${agent.jurisdiction} ${agent.category}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "all" || agent.status === status);
  });
  async function runAgent(id: string) {
    showToast(`${id} is checking its public source now…`);
    try {
      const response = await fetch("/api/agents/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sourceId: id }) });
      const payload = await response.json() as { result?: { status: AgentStatus; records: number; successRate: number; message: string }; error?: string };
      if (!response.ok || !payload.result) throw new Error(payload.error || "Run failed");
      setAgents(agents.map((agent) => agent.id === id ? { ...agent, lastRun: "Just now", status: payload.result!.status, records: payload.result!.records, success: Math.round(payload.result!.successRate ?? agent.success) } : agent));
      await onRunComplete();
      showToast(`${id}: ${payload.result.message}`);
    } catch (error) {
      showToast(`${id} could not complete: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }
  return (
    <section className="content-section">
      <div className="section-heading"><div><span className="eyebrow">OBSERVABILITY</span><h1>Source agents</h1><p>Every source stands on its own. See output, success rate and exactly what is blocking it.</p></div><div className="summary-pills"><span className="good">● {agents.filter(a => a.status === 'healthy').length} healthy</span><span className="warn">● {agents.filter(a => a.status === 'attention').length} parser work</span><span className="bad">● {agents.filter(a => a.status === 'blocked').length} blocked</span><span>● {agents.filter(a => a.status === 'waiting').length} waiting</span></div></div>
      <div className="filterbar"><label className="search-field">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agent, city or source family" /></label><select value={status} onChange={e => setStatus(e.target.value)}><option value="all">All statuses</option><option value="healthy">Healthy</option><option value="attention">Needs parser</option><option value="blocked">Blocked</option><option value="waiting">Waiting</option></select><span className="filter-count">{filtered.length} of 56 agents</span></div>
      <div className="agent-table-shell">
        <table className="agent-table">
          <thead><tr><th>Agent / source</th><th>Signal family</th><th>Status</th><th>Last / next run</th><th>Output</th><th>Success</th><th>Action</th></tr></thead>
          <tbody>{filtered.map(agent => <tr key={agent.id}>
            <td><b>{agent.name}</b><span>{agent.id} · {agent.jurisdiction}</span>{agent.blocker && <small>{agent.blocker}</small>}</td>
            <td>{agent.category}<span>{agent.cadence}</span></td>
            <td><StatusPill status={agent.status} /></td>
            <td><b>{agent.lastRun}</b><span>Next: {agent.nextRun}</span></td>
            <td><b>{agent.records}</b><span>records last run</span></td>
            <td><b>{agent.success}%</b><span>30-day</span></td>
            <td><button className="mini-button" onClick={() => runAgent(agent.id)}>Run now</button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function EvidenceReviewModal({ item, onClose, onComplete, showToast }: { item: EvidenceItem; onClose: () => void; onComplete: () => Promise<void>; showToast: (message: string) => void }) {
  const cities = ["St. Charles", "O’Fallon", "St. Peters", "Wentzville", "Lake Saint Louis", "Cottleville", "Dardenne Prairie", "Foristell", "New Melle", "Flint Hill", "St. Paul", "Augusta", "West Alton"];
  const suggestedCity = cities.includes(item.jurisdiction) ? item.jurisdiction : "";
  const [saving, setSaving] = useState(false);
  async function approve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "approve", rawEventId: item.id, commercialConfirmed: form.get("commercialConfirmed") === "on", address: form.get("address"), city: form.get("city"), suite: form.get("suite"), name: form.get("name") }) });
      const payload = await response.json() as { attachedToExisting?: boolean; scoreChanges?: unknown[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Evidence could not be approved");
      await onComplete();
      showToast(`Verified evidence ${payload.attachedToExisting ? "attached to an existing project" : "created a new project"}; ${payload.scoreChanges?.length ?? 0} trade scores refreshed.`);
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Evidence could not be approved");
    } finally {
      setSaving(false);
    }
  }
  async function reject() {
    setSaving(true);
    try {
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "reject", rawEventId: item.id, reason: "Reviewer determined this is not an actionable commercial transition." }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Evidence could not be rejected");
      await onComplete();
      showToast("Evidence rejected and retained in the audit history.");
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Evidence could not be rejected");
    } finally {
      setSaving(false);
    }
  }
  return <div className="drawer-backdrop modal-backdrop" onMouseDown={onClose}><form className="signal-modal evidence-modal" onSubmit={approve} onMouseDown={event => event.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">OFFICIAL EVIDENCE · HUMAN GATE</span><h2>Verify commercial opportunity</h2><p>{item.sourceId} · {item.sourceName}</p></div><button type="button" className="close-button" onClick={onClose}>×</button></div>
    <div className="evidence-source-card"><div><span className="confidence-badge">{Math.round(item.confidence * 100)}% extraction confidence</span><span className="stage-pill">{item.eventType.replaceAll("_", " ")}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer">Open official source evidence ↗</a></div>
    <div className="form-grid"><label>Verified street address<input name="address" required defaultValue={item.addressRaw ?? ""} placeholder="Commercial property address" /></label><label>City<select name="city" required defaultValue={suggestedCity}><option value="" disabled>Select city</option>{cities.map(city => <option key={city}>{city}</option>)}</select></label><label>Suite / space<input name="suite" placeholder="Suite 200 or whole building" /></label><label>Tenant / project name<input name="name" defaultValue={item.organizationRaw ?? ""} placeholder="Business or development name" /></label><label className="commercial-check full-label"><input name="commercialConfirmed" type="checkbox" required /><span><b>I verified this is commercial activity</b><small>No residential address, utility usage, payment, or private account data will be stored.</small></span></label></div>
    <div className="modal-actions evidence-actions"><button type="button" className="reject-button" disabled={saving} onClick={reject}>Reject as non-opportunity</button><span /><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving review…" : "Approve, match & score"}</button></div>
  </form></div>;
}

function EvidenceView({ evidence, onRefresh, showToast }: { evidence: EvidenceItem[]; onRefresh: () => Promise<void>; showToast: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<EvidenceItem | null>(null);
  const categories = Array.from(new Set(evidence.map(item => item.category))).sort();
  const filtered = evidence.filter(item => `${item.title} ${item.excerpt} ${item.sourceName} ${item.jurisdiction}`.toLowerCase().includes(query.toLowerCase()) && (category === "all" || item.category === category));
  return <section className="content-section">
    <div className="section-heading"><div><span className="eyebrow">OFFICIAL SOURCE → VERIFIED PROJECT</span><h1>Evidence review</h1><p>Agents gather candidates. A person verifies commercial use, the address and the tenant before any referral can be created.</p></div><div className="evidence-total"><strong>{evidence.length}</strong><span>awaiting review</span></div></div>
    <div className="filterbar"><label className="search-field">⌕<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search evidence, source or jurisdiction" /></label><select value={category} onChange={event => setCategory(event.target.value)}><option value="all">All signal families</option>{categories.map(value => <option key={value}>{value}</option>)}</select><span className="filter-count">{filtered.length} official-source candidates</span></div>
    <div className="evidence-list">{filtered.length ? filtered.map(item => <article className="evidence-row" key={item.id}>
      <div className="evidence-confidence"><strong>{Math.round(item.confidence * 100)}</strong><span>confidence</span></div>
      <div className="evidence-main"><div><span className="stage-pill">{item.eventType.replaceAll("_", " ")}</span><span className="source-id-pill">{item.sourceId}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><small>{item.sourceName} · {item.jurisdiction} · Discovered {new Date(item.discoveredAt).toLocaleDateString()}</small></div>
      <div className="evidence-location"><b>{item.addressRaw || "Address needs document review"}</b><span>{item.category}</span></div>
      <button className="primary-button" onClick={() => setSelected(item)}>Review</button>
    </article>) : <div className="empty-evidence"><span>✓</span><h3>Evidence queue is clear</h3><p>Run due agents to gather fresh official-source records.</p></div>}</div>
    {selected && <EvidenceReviewModal item={selected} onClose={() => setSelected(null)} onComplete={onRefresh} showToast={showToast} />}
  </section>;
}

function ProjectsView({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  const [query, setQuery] = useState("");
  const filtered = projects.filter(p => `${p.name} ${p.address} ${p.city}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="content-section">
    <div className="section-heading"><div><span className="eyebrow">BUILDING → SPACE → TRANSITION</span><h1>Project timelines</h1><p>New evidence attaches to the same address, suite and tenant transition—never a duplicate lead.</p></div></div>
    <div className="filterbar"><label className="search-field">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search address, tenant or city" /></label><select><option>All stages</option><option>Planning</option><option>Buildout</option><option>License pending</option></select><span className="filter-count">Demo records are clearly labeled</span></div>
    <OpportunityTable projects={filtered} onOpen={onOpen} />
  </section>;
}

function MembersView() {
  return <section className="content-section">
    <div className="section-heading"><div><span className="eyebrow">20 NOW · READY FOR 40</span><h1>Members & routing</h1><p>Contractors are rows, not permanent columns. Add seats without rebuilding the lead engine.</p></div><button className="primary-button">＋ Add member</button></div>
    <div className="member-summary"><div><strong>3</strong><span>Active members</span></div><div><strong>17</strong><span>Open charter seats</span></div><div><strong>34</strong><span>Matches routed</span></div><div><strong>76%</strong><span>Accepted</span></div></div>
    <div className="member-grid">{demoMembers.map(member => <article className={`member-card ${member.active ? '' : 'open-seat'}`} key={member.id}>
      <div className="member-card-head"><span className="member-avatar">{member.active ? member.company.slice(0, 2).toUpperCase() : '+'}</span><span className={`member-state ${member.active ? 'active' : ''}`}>{member.active ? 'Active' : 'Open seat'}</span></div>
      <h3>{member.company}</h3><p>{member.trade}</p><small>{member.contact} · {member.territory}</small>
      <div className="member-stats"><span><b>{member.matches}</b>Matched</span><span><b>{member.accepted}</b>Accepted</span><span><b>{member.won}</b>Won</span></div>
    </article>)}</div>
  </section>;
}

function ReferralsView({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  const rows = projects.flatMap(project => project.matches.slice(0, 2).map(match => ({ project, match })));
  return <section className="content-section">
    <div className="section-heading"><div><span className="eyebrow">PROVABLE ORIGIN</span><h1>Referrals & attribution</h1><p>Know the first signal, the qualifying signal, who introduced it and what ultimately became revenue.</p></div><button className="outline-button">Export referral report</button></div>
    <div className="attribution-flow"><div><b>1</b><span>First source<small>Discovered the address</small></span></div><i>→</i><div><b>2</b><span>Qualifying source<small>Made it actionable</small></span></div><i>→</i><div><b>3</b><span>Member referral<small>Who received it</small></span></div><i>→</i><div><b>4</b><span>Outcome<small>Appointment to won</small></span></div></div>
    <div className="table-shell referral-shell"><table className="agent-table referral-table"><thead><tr><th>Project</th><th>Trade / member</th><th>Attribution</th><th>Stage</th><th>Score</th><th>Value</th></tr></thead><tbody>{rows.map(({project, match}, index) => <tr key={`${project.id}-${match.trade}`} onClick={() => onOpen(project)}>
      <td><b>{project.name}</b><span>{project.address}</span></td><td><b>{match.trade}</b><span>{match.member}</span></td><td><b>{project.firstSource}</b><span>Qualified: {project.qualifyingSource}</span></td><td><span className={`referral-stage stage-${match.state}`}>{match.state}</span></td><td><ScoreRing value={match.score} size="small" /></td><td><b>{index < 3 ? ['$18,500', '$7,200', '$26,000'][index] : '—'}</b><span>{index < 3 ? 'Member estimate' : 'Not reported'}</span></td>
    </tr>)}</tbody></table></div>
  </section>;
}

function RulesView() {
  const rules = [
    ["Commercial alteration permit", "26", "Electrical, plumbing, HVAC, alarm, locks, signage", "120 days"],
    ["Planning / zoning application", "12", "GC, architecture, utilities, telecom", "180 days"],
    ["New business license", "18", "Telecom, signage, locks, alarm, insurance", "90 days"],
    ["Fire / life-safety review", "22", "Fire alarm, suppression, low voltage", "75 days"],
    ["Commercial utility start", "20", "Telecom, electrical, moving, security", "45 days"],
    ["Member field signal", "16", "Selected by reporting member", "60 days"],
  ];
  return <section className="content-section">
    <div className="section-heading"><div><span className="eyebrow">TRADE-SPECIFIC · TIME-AWARE</span><h1>Scoring & rules</h1><p>A building is not simply “hot.” It can be hot for electrical today and already too late for plumbing.</p></div><button className="primary-button">Save rule set</button></div>
    <div className="formula-card"><span>Opportunity score</span><strong>Σ (signal × trade relevance × confidence × time decay × availability) + momentum</strong><div><i>Signal strength</i><i>Right trade</i><i>Corroborated?</i><i>Still timely?</i><i>Trade unassigned?</i></div></div>
    <div className="rules-layout"><div className="table-shell"><div className="table-titlebar"><div><h2>Signal rules</h2><p>Starting values; every change is audit logged.</p></div></div><table className="agent-table rule-table"><thead><tr><th>Signal</th><th>Base</th><th>Highest relevance</th><th>Decay window</th></tr></thead><tbody>{rules.map(rule => <tr key={rule[0]}><td><b>{rule[0]}</b></td><td><span className="base-score">+{rule[1]}</span></td><td>{rule[2]}</td><td>{rule[3]}</td></tr>)}</tbody></table></div>
      <aside className="privacy-card"><span className="shield-icon">✓</span><h2>Commercial privacy gates</h2><p>Useful intelligence without exposing private customer data.</p><ul><li><b>Commercial only</b><span>Residential addresses are rejected.</span></li><li><b>No usage or payment data</b><span>Utility requests ask only for start/stop dates when legally releasable.</span></li><li><b>No private alarm accounts</b><span>Only permits, inspections and public records.</span></li><li><b>Every claim traceable</b><span>URL, record ID, page and excerpt remain attached.</span></li><li><b>Human review before referral</b><span>AI confidence never replaces verification.</span></li></ul></aside>
    </div>
  </section>;
}

function ProjectDrawer({ project, onClose, showToast }: { project: Project; onClose: () => void; showToast: (message: string) => void }) {
  const [tab, setTab] = useState<"timeline" | "matches" | "attribution">("timeline");
  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="project-drawer" onMouseDown={e => e.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">{project.id} · DEMONSTRATION DATA</span><h2>{project.name}</h2><p>{project.address} · {project.suite} · {project.city}</p></div><button className="close-button" onClick={onClose}>×</button></div>
    <div className="drawer-scorebar"><ScoreRing value={project.score} /><div><strong>{project.stage}</strong><span>{project.signals} signals · Updated {project.updated}</span></div><div className={`momentum-big ${project.momentum >= 0 ? 'up' : 'down'}`}>{project.momentum >= 0 ? '↑' : '↓'} {Math.abs(project.momentum)}<small>momentum</small></div></div>
    <div className="drawer-tabs"><button className={tab === 'timeline' ? 'active' : ''} onClick={() => setTab('timeline')}>Evidence timeline</button><button className={tab === 'matches' ? 'active' : ''} onClick={() => setTab('matches')}>Trade matches</button><button className={tab === 'attribution' ? 'active' : ''} onClick={() => setTab('attribution')}>Attribution</button></div>
    <div className="drawer-body">{tab === 'timeline' && <div className="timeline">{project.events.map((event, index) => <article key={`${event.source}-${event.date}`}><div className="timeline-rail"><span>{index + 1}</span><i /></div><div><time>{event.date} · {event.source}</time><h3>{event.title}</h3><p>{event.detail}</p><span className="impact-chip">{event.impact}</span><button className="source-link">View source evidence ↗</button></div></article>)}</div>}
      {tab === 'matches' && <div className="drawer-matches">{project.matches.map(match => <article key={match.trade}><ScoreRing value={match.score} /><div><h3>{match.trade}</h3><p>{match.member}</p><span className={`referral-stage stage-${match.state}`}>{match.state}</span></div><button className="primary-button" onClick={() => showToast(`${match.trade} opportunity prepared for ${match.member}.`)}>Prepare referral</button></article>)}</div>}
      {tab === 'attribution' && <div className="attribution-detail"><span>FIRST DISCOVERED BY</span><h3>{project.firstSource}</h3><p>Created the building/project record and owns first-source credit.</p><i /><span>BECAME ACTIONABLE THROUGH</span><h3>{project.qualifyingSource}</h3><p>Raised a relevant trade above the referral threshold.</p><i /><span>CONTRIBUTING SIGNALS</span><h3>{project.signals} source events preserved</h3><p>Every event retains its URL, source record ID, excerpt and timestamp.</p></div>}
    </div>
  </aside></div>;
}

function AddSignalModal({ onClose, showToast, onSaved }: { onClose: () => void; showToast: (message: string) => void; onSaved: () => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/signals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const payload = await response.json() as { projectId?: string; attachedToExisting?: boolean; scoreChanges?: unknown[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Signal could not be saved");
      await onSaved();
      showToast(`Signal ${payload.attachedToExisting ? "attached to the existing project" : "created a new project"}; ${payload.scoreChanges?.length ?? 0} trade scores recalculated.`);
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Signal could not be saved");
    } finally {
      setSaving(false);
    }
  }
  return <div className="drawer-backdrop modal-backdrop" onMouseDown={onClose}><form className="signal-modal" onSubmit={submit} onMouseDown={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">MEMBER OR MANUAL INTELLIGENCE</span><h2>Add a commercial signal</h2><p>It will attach to an existing building/project when the address and suite match.</p></div><button type="button" className="close-button" onClick={onClose}>×</button></div><div className="form-grid"><label>Street address<input name="address" required placeholder="123 Main Street" /></label><label>City<select name="city" required defaultValue=""><option value="" disabled>Select city</option><option>St. Charles</option><option>O’Fallon</option><option>St. Peters</option><option>Wentzville</option><option>Dardenne Prairie</option><option>Other county municipality</option></select></label><label>Suite / space<input name="suite" placeholder="Suite 200" /></label><label>Signal type<select name="signalType"><option>Member field signal</option><option>Permit or inspection</option><option>Tenant / license activity</option><option>Property / leasing activity</option><option>Utility activity</option><option>Other</option></select></label><label className="full-label">Business or project name<input name="name" placeholder="Known tenant, owner or development name" /></label><label className="full-label">What happened?<textarea name="detail" required placeholder="Describe the commercial activity and why it may create contractor work." /></label><label className="full-label">Evidence URL<input name="evidenceUrl" type="url" placeholder="https://…" /></label></div><div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Matching & scoring…" : "Save & score signal"}</button></div></form></div>;
}

export default function TransitionSphereApp() {
  const [view, setView] = useState<ViewId>("command");
  const [agents, setAgents] = useState(demoAgents);
  const [projects, setProjects] = useState(demoProjects);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [signalOpen, setSignalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [agentsRunning, setAgentsRunning] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("Loading…");
  const matchingProjects = useMemo(() => projects.filter(project => `${project.name} ${project.address} ${project.city} ${project.matches.map(match => match.trade).join(' ')}`.toLowerCase().includes(globalQuery.toLowerCase())), [globalQuery, projects]);
  const loadDashboard = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      const payload = await response.json() as { projects?: Project[]; agents?: Array<Record<string, unknown>> };
      if (!response.ok || !payload.projects || !payload.agents) return;
      setProjects(payload.projects);
      setAgents(payload.agents.map((agent) => ({
        id: String(agent.id), name: String(agent.name), jurisdiction: String(agent.jurisdiction), category: String(agent.category),
        status: String(agent.status) as AgentStatus, cadence: String(agent.cadence),
        lastRun: agent.lastRunAt ? new Date(String(agent.lastRunAt)).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Never",
        nextRun: agent.nextRunAt ? new Date(String(agent.nextRunAt)).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Not scheduled",
        records: Number(agent.totalEvents ?? 0), success: Math.round(Number(agent.successRate ?? 0)), blocker: agent.blocker ? String(agent.blocker) : undefined,
      })));
      setLastRefresh(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    } catch {
      // The fully rendered demonstration data remains available if the local preview has no D1 binding.
    }
  }, []);
  const loadEvidence = useCallback(async () => {
    try {
      const response = await fetch("/api/evidence", { cache: "no-store" });
      const payload = await response.json() as { evidence?: EvidenceItem[] };
      if (response.ok && payload.evidence) setEvidence(payload.evidence);
    } catch {
      // A collector outage is shown on the agent screen; the rest of the app remains usable.
    }
  }, []);
  const refreshAll = useCallback(async () => {
    await Promise.all([loadDashboard(), loadEvidence()]);
  }, [loadDashboard, loadEvidence]);
  useEffect(() => {
    const timer = window.setTimeout(() => void refreshAll(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshAll]);
  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 4200);
  }
  async function runDueAgents() {
    if (agentsRunning) return;
    setAgentsRunning(true);
    showToast("Running each source independently and preserving every result…");
    try {
      const response = await fetch("/api/agents/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "run_due", forceAll: true, limit: 4 }) });
      let payload = await response.json() as { queued?: number; remaining?: number; results?: Array<{ eventsCreated?: number }>; error?: string };
      if (!response.ok) throw new Error(payload.error || "Agents could not be queued");
      let processed = payload.results?.length ?? 0;
      let captured = payload.results?.reduce((sum, result) => sum + (result.eventsCreated ?? 0), 0) ?? 0;
      while ((payload.remaining ?? 0) > 0) {
        showToast(`${processed} agents checked · ${payload.remaining} remaining · ${captured} new evidence items`);
        const next = await fetch("/api/agents/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "process_queue", limit: 4 }) });
        payload = await next.json() as typeof payload;
        if (!next.ok) throw new Error(payload.error || "Queue processing stopped");
        processed += payload.results?.length ?? 0;
        captured += payload.results?.reduce((sum, result) => sum + (result.eventsCreated ?? 0), 0) ?? 0;
      }
      await refreshAll();
      showToast(`${processed} agents completed. ${captured} new official-source evidence item${captured === 1 ? "" : "s"} captured.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Agents could not be queued");
    } finally {
      setAgentsRunning(false);
    }
  }
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><i /><i /><i /></span><div><strong>Commercial Transition Sphere</strong><small>Referral Verified</small></div><button className="mobile-close" onClick={() => setMobileNav(false)}>×</button></div>
      <div className="county-chip"><i />St. Charles County<span>LIVE SCOPE</span></div>
      <nav>{navItems.map(item => <button key={item[0]} className={view === item[0] ? 'active' : ''} onClick={() => { setView(item[0]); setMobileNav(false); }}><span>{item[1]}</span>{item[2]}{item[0] === 'agents' && <em>56</em>}{item[0] === 'evidence' && <em>{evidence.length}</em>}</button>)}</nav>
      <div className="sidebar-footer"><div className="system-state"><span><i />System ready</span><small>Commercial-only privacy rules active</small></div><button className="profile-button"><span>CTS</span><div><b>Commercial Transition Sphere</b><small>Administrator</small></div><i>⋮</i></button></div>
    </aside>
    <main className="main-shell">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}>☰</button><label className="global-search">⌕<input value={globalQuery} onChange={e => setGlobalQuery(e.target.value)} placeholder="Search address, tenant, trade or source…" />{globalQuery && <span>{matchingProjects.length} projects</span>}</label><div className="top-actions"><span className="last-refresh">Last refresh<br /><b>{lastRefresh}</b></span><button className="outline-button" onClick={() => setSignalOpen(true)}>＋ Add signal</button><button className="primary-button" disabled={agentsRunning} onClick={runDueAgents}><i className="run-dot" /> {agentsRunning ? "Agents working…" : "Run all agents"}</button></div></header>
      <div className="page-content">
        {view === 'command' && <CommandCenter projects={globalQuery ? matchingProjects : projects} agents={agents} evidenceCount={evidence.length} onOpen={setSelectedProject} />}
        {view === 'agents' && <AgentsView agents={agents} setAgents={setAgents} showToast={showToast} onRunComplete={refreshAll} />}
        {view === 'evidence' && <EvidenceView evidence={evidence} onRefresh={refreshAll} showToast={showToast} />}
        {view === 'projects' && <ProjectsView projects={projects} onOpen={setSelectedProject} />}
        {view === 'members' && <MembersView />}
        {view === 'referrals' && <ReferralsView projects={projects} onOpen={setSelectedProject} />}
        {view === 'rules' && <RulesView />}
      </div>
    </main>
    {selectedProject && <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} showToast={showToast} />}
    {signalOpen && <AddSignalModal onClose={() => setSignalOpen(false)} showToast={showToast} onSaved={refreshAll} />}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}
