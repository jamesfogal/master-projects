export const sourceUrls: Record<string, string> = {
  "SRC-001": "https://www.sccmo.org/1565/Permits",
  "SRC-002": "https://www.citizenserve.com/Portal/PortalController?Action=showContactUs&ctzPagePrefix=Portal_&installationID=165",
  "SRC-003": "https://www.sccmo.org/1582/Land-Development-Zoning-Applications",
  "SRC-004": "https://www.sccmo.org/AgendaCenter",
  "SRC-005": "https://maps.sccmo.org/public_web_map/",
  "SRC-006": "https://www.sccmo.org/151/Assessor",
  "SRC-007": "https://www.sccmo.org/517/Land-Records",
  "SRC-008": "https://www.sccmo.org/1046/Licenses-and-Permits",
  "SRC-009": "https://www.sccmo.org/Bids.aspx",
  "SRC-010": "https://esuite.stcharlescitymo.gov/esuite.permits/",
  "SRC-011": "https://www.stcharlescitymo.gov/950/Monthly-Departmental-Report",
  "SRC-012": "https://www.stcharlescitymo.gov/AgendaCenter",
  "SRC-013": "https://www.stcharlescitymo.gov/263/Business-Licenses",
  "SRC-014": "https://www.stcharlescitymo.gov/Bids.aspx",
  "SRC-015": "https://www.ofallonmo.gov/departments/building_and_permits.php",
  "SRC-016": "https://www.ofallonmo.gov/departments/planning_and_development.php",
  "SRC-017": "https://www.ofallonmo.gov/departments/economic_development.php",
  "SRC-018": "https://www.ofallonmo.gov/services/business_services/bid_opportunities.php",
  "SRC-019": "https://www.stpetersmo.net/360/Apply-for-Licenses-Permits",
  "SRC-020": "https://www.stpetersmo.net/AgendaCenter",
  "SRC-021": "https://www.stpetersmo.net/753/Opening-a-Business",
  "SRC-022": "https://www.stpetersmo.net/bids.aspx",
  "SRC-023": "https://ci-wentzville-mo.smartgovcommunity.com/",
  "SRC-024": "https://www.wentzvillemo.gov/departments/community-development/planning-zoning-division/brochures-applications-meetings/",
  "SRC-025": "https://www.wentzvillemo.gov/residents/forms-and-applications/",
  "SRC-026": "https://www.wentzvillemo.gov/departments/procurement/bid-opportunities/",
  "SRC-027": "https://lakesaintlouis.com/sitemap",
  "SRC-028": "https://lakesaintlouis.com/AgendaCenter",
  "SRC-029": "https://www.cityofcottleville.com/forms-permits-and-licenses/",
  "SRC-030": "https://www.cityofcottleville.com/public-notices/",
  "SRC-031": "https://www.dardenneprairie.org/business/index.php",
  "SRC-032": "https://www.dardenneprairie.org/government/public_notices_and_hearings.php",
  "SRC-033": "https://www.dardenneprairie.org/department/finance_hr/bids%2C_rfps_rfqs.php",
  "SRC-034": "https://www.cityofforistell.org/forms-business",
  "SRC-035": "https://www.cityofforistell.org/planning-zoning-commission",
  "SRC-036": "https://www.cityofnewmelle.com/applications",
  "SRC-037": "https://cityofflinthill.com/building-permits-and-citizen-engagement-portals/",
  "SRC-038": "https://cityofstpaulmissouri.com/resources/",
  "SRC-039": "https://www.townofaugustamo.org/augusta-town-board/augusta-board-meeting-minutes/",
  "SRC-040": "https://westaltonmo.com/documents/",
  "SRC-041": "https://www.sccmo.org/2203/Political-Subdivisions",
  "SRC-042": "https://centralcountyfire.org",
  "SRC-043": "https://cottlevillefpd.org",
  "SRC-044": "https://lslfire.com",
  "SRC-045": "https://newmellefire.org",
  "SRC-046": "https://ofallonfire.org",
  "SRC-047": "https://offpd.com",
  "SRC-048": "https://wentzvillefire.org",
  "SRC-049": "https://www.sos.mo.gov/business/corporations",
  "SRC-050": "https://www.edcscc.com/",
  "SRC-051": "https://sam.gov/opportunities",
  "SRC-052": "https://docs.shovels.ai/docs/knowledge-base/getting-started/free-trial-guide",
  "UTIL-001": "https://www.stcharlescitymo.gov/920/Sunshine-Law-Request",
  "UTIL-002": "https://www.ofallonmo.gov/government/requests_for_public_information.php",
  "UTIL-003": "https://www.stpetersmo.net/FormCenter/City-Services-13/Request-a-Public-Record-56",
  "UTIL-004": "https://www.wentzvillemo.gov/wp-content/uploads/2024/01/Records-Request.pdf",
};

export type ConnectorMode =
  | "html-candidates"
  | "document-index"
  | "portal-monitor"
  | "page-monitor"
  | "records-request"
  | "benchmark-disabled";

export type SourceConnector = {
  mode: ConnectorMode;
  cadenceHours: number;
  backfillDays: number;
  maxCandidates: number;
  notes: string;
};

const documentIndexes = new Set([
  "SRC-003", "SRC-004", "SRC-009", "SRC-011", "SRC-012", "SRC-014", "SRC-018",
  "SRC-020", "SRC-022", "SRC-024", "SRC-026", "SRC-028", "SRC-030", "SRC-032",
  "SRC-033", "SRC-035", "SRC-039", "SRC-040", "SRC-042", "SRC-043", "SRC-044",
  "SRC-045", "SRC-046", "SRC-047", "SRC-048", "SRC-051",
]);

const pageMonitors = new Set(["SRC-005", "SRC-006", "SRC-007", "SRC-041", "SRC-052"]);
const portalMonitors = new Set(["SRC-002", "SRC-010", "SRC-019", "SRC-023"]);

export function connectorFor(sourceId: string): SourceConnector {
  if (sourceId.startsWith("UTIL-")) {
    return { mode: "records-request", cadenceHours: 720, backfillDays: 0, maxCandidates: 0, notes: "Tracks lawful commercial start/stop-date records requests; never collects usage, payment, or residential account data." };
  }
  if (sourceId === "SRC-052") {
    return { mode: "benchmark-disabled", cadenceHours: 168, backfillDays: 0, maxCandidates: 0, notes: "Paid-provider benchmark only; no subscription or automated collection is enabled." };
  }
  if (portalMonitors.has(sourceId)) {
    return { mode: "portal-monitor", cadenceHours: 24, backfillDays: 0, maxCandidates: 0, notes: "Monitors portal availability and metadata. Search results require a permitted export, public report, or source-specific connector." };
  }
  if (pageMonitors.has(sourceId)) {
    return { mode: "page-monitor", cadenceHours: 168, backfillDays: 0, maxCandidates: 0, notes: "Monitors source availability and changes; used for identity resolution or benchmarking rather than direct leads." };
  }
  if (documentIndexes.has(sourceId)) {
    return { mode: "document-index", cadenceHours: 24, backfillDays: 210, maxCandidates: 30, notes: "Extracts new agendas, reports, public notices, bids, packets, and other official documents into the evidence queue." };
  }
  return { mode: "html-candidates", cadenceHours: 72, backfillDays: 210, maxCandidates: 20, notes: "Extracts new commercially relevant links and notices into the evidence queue for review." };
}

export function agentTypeFor(sourceId: string) {
  return connectorFor(sourceId).mode;
}

export const sourcePurpose: Record<string, string> = {
  Permits: "Detect new construction, tenant finish, alteration, trade and occupancy activity.",
  "Planning & zoning": "Detect projects before permit issuance through hearings, applications and public notices.",
  "Business & licensing": "Detect new tenants, business openings and operational milestones.",
  "Property & GIS": "Resolve addresses, parcels, ownership and commercial-property identity.",
  Procurement: "Detect public projects, awarded work and infrastructure that can trigger adjacent opportunity.",
  "Fire & life safety": "Detect plan review, inspection, fire alarm and suppression activity.",
  "Economic & state": "Detect newly formed entities, expansions and economic-development announcements.",
  "Utility service": "Track lawful commercial start/stop dates returned through public-record requests.",
  Benchmark: "Compare paid-provider coverage to first-party public sources during validation.",
};
