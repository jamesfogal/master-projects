export type AgentStatus = "healthy" | "attention" | "blocked" | "waiting";

export type SourceAgent = {
  id: string;
  name: string;
  jurisdiction: string;
  category: string;
  status: AgentStatus;
  cadence: string;
  lastRun: string;
  nextRun: string;
  records: number;
  success: number;
  blocker?: string;
};

export type TradeMatch = {
  trade: string;
  member: string;
  score: number;
  state: "new" | "sent" | "accepted" | "working";
};

export type ProjectEvent = {
  date: string;
  source: string;
  title: string;
  detail: string;
  impact: string;
};

export type Project = {
  id: string;
  name: string;
  address: string;
  city: string;
  suite: string;
  stage: string;
  score: number;
  momentum: number;
  updated: string;
  firstSource: string;
  qualifyingSource: string;
  signals: number;
  matches: TradeMatch[];
  events: ProjectEvent[];
};

export type Member = {
  id: string;
  company: string;
  contact: string;
  trade: string;
  territory: string;
  active: boolean;
  matches: number;
  accepted: number;
  won: number;
};

const agentSeeds: Array<[string, string, string, string, AgentStatus]> = [
  ["SRC-001", "County permit hub", "St. Charles County", "Permits", "healthy"],
  ["SRC-002", "County CitizenServe", "St. Charles County", "Permits", "healthy"],
  ["SRC-003", "Land development applications", "St. Charles County", "Planning & zoning", "healthy"],
  ["SRC-004", "County agenda center", "St. Charles County", "Planning & zoning", "attention"],
  ["SRC-005", "County GIS", "St. Charles County", "Property & GIS", "healthy"],
  ["SRC-006", "County assessor", "St. Charles County", "Property & GIS", "healthy"],
  ["SRC-007", "County land records", "St. Charles County", "Property & GIS", "attention"],
  ["SRC-008", "County licenses", "St. Charles County", "Business & licensing", "healthy"],
  ["SRC-009", "County bid opportunities", "St. Charles County", "Procurement", "healthy"],
  ["SRC-010", "St. Charles eSuite permits", "St. Charles", "Permits", "healthy"],
  ["SRC-011", "St. Charles monthly report", "St. Charles", "Permits", "attention"],
  ["SRC-012", "St. Charles agenda center", "St. Charles", "Planning & zoning", "healthy"],
  ["SRC-013", "St. Charles business licenses", "St. Charles", "Business & licensing", "healthy"],
  ["SRC-014", "St. Charles bids", "St. Charles", "Procurement", "healthy"],
  ["SRC-015", "O’Fallon building & permits", "O’Fallon", "Permits", "healthy"],
  ["SRC-016", "O’Fallon planning", "O’Fallon", "Planning & zoning", "healthy"],
  ["SRC-017", "O’Fallon economic development", "O’Fallon", "Economic & state", "healthy"],
  ["SRC-018", "O’Fallon bid opportunities", "O’Fallon", "Procurement", "attention"],
  ["SRC-019", "St. Peters permits & licenses", "St. Peters", "Permits", "healthy"],
  ["SRC-020", "St. Peters agenda center", "St. Peters", "Planning & zoning", "healthy"],
  ["SRC-021", "St. Peters opening a business", "St. Peters", "Business & licensing", "healthy"],
  ["SRC-022", "St. Peters bids", "St. Peters", "Procurement", "healthy"],
  ["SRC-023", "Wentzville SmartGov", "Wentzville", "Permits", "blocked"],
  ["SRC-024", "Wentzville planning applications", "Wentzville", "Planning & zoning", "healthy"],
  ["SRC-025", "Wentzville forms", "Wentzville", "Business & licensing", "attention"],
  ["SRC-026", "Wentzville bid opportunities", "Wentzville", "Procurement", "healthy"],
  ["SRC-027", "Lake Saint Louis development hub", "Lake Saint Louis", "Permits", "attention"],
  ["SRC-028", "Lake Saint Louis agendas", "Lake Saint Louis", "Planning & zoning", "healthy"],
  ["SRC-029", "Cottleville permits & licenses", "Cottleville", "Permits", "healthy"],
  ["SRC-030", "Cottleville public notices", "Cottleville", "Planning & zoning", "healthy"],
  ["SRC-031", "Dardenne Prairie business permits", "Dardenne Prairie", "Permits", "healthy"],
  ["SRC-032", "Dardenne Prairie notices", "Dardenne Prairie", "Planning & zoning", "attention"],
  ["SRC-033", "Dardenne Prairie bids", "Dardenne Prairie", "Procurement", "healthy"],
  ["SRC-034", "Foristell forms & business", "Foristell", "Business & licensing", "healthy"],
  ["SRC-035", "Foristell planning commission", "Foristell", "Planning & zoning", "healthy"],
  ["SRC-036", "New Melle applications", "New Melle", "Permits", "attention"],
  ["SRC-037", "Flint Hill permit portal", "Flint Hill", "Permits", "healthy"],
  ["SRC-038", "St. Paul manual permit source", "St. Paul", "Permits", "waiting"],
  ["SRC-039", "Augusta minutes & licenses", "Augusta", "Business & licensing", "waiting"],
  ["SRC-040", "West Alton documents", "West Alton", "Permits", "waiting"],
  ["SRC-041", "Small municipality directory", "Countywide", "Planning & zoning", "healthy"],
  ["SRC-042", "Central County Fire & Rescue", "Countywide", "Fire & life safety", "attention"],
  ["SRC-043", "Cottleville Fire District", "Cottleville", "Fire & life safety", "attention"],
  ["SRC-044", "Lake Saint Louis Fire District", "Lake Saint Louis", "Fire & life safety", "attention"],
  ["SRC-045", "New Melle Fire District", "New Melle", "Fire & life safety", "waiting"],
  ["SRC-046", "O’Fallon Fire District", "O’Fallon", "Fire & life safety", "healthy"],
  ["SRC-047", "Orchard Farm Fire District", "Countywide", "Fire & life safety", "waiting"],
  ["SRC-048", "Wentzville Fire District", "Wentzville", "Fire & life safety", "healthy"],
  ["SRC-049", "Missouri business entities", "Missouri", "Economic & state", "healthy"],
  ["SRC-050", "EDC St. Charles County", "Countywide", "Economic & state", "healthy"],
  ["SRC-051", "SAM.gov opportunities", "Federal", "Procurement", "healthy"],
  ["SRC-052", "Shovels benchmark agent", "Countywide", "Benchmark", "attention"],
  ["UTIL-001", "St. Charles utility starts request", "St. Charles", "Utility service", "waiting"],
  ["UTIL-002", "O’Fallon utility starts request", "O’Fallon", "Utility service", "waiting"],
  ["UTIL-003", "St. Peters utility starts request", "St. Peters", "Utility service", "waiting"],
  ["UTIL-004", "Wentzville utility starts request", "Wentzville", "Utility service", "waiting"],
];

export const demoAgents: SourceAgent[] = agentSeeds.map((seed, index) => {
  const [, , , , status] = seed;
  return {
    id: seed[0],
    name: seed[1],
    jurisdiction: seed[2],
    category: seed[3],
    status,
    cadence: status === "waiting" ? "Monthly request" : index % 3 === 0 ? "Daily" : "Weekly",
    lastRun: status === "waiting" ? "Awaiting response" : index % 4 === 0 ? "18 min ago" : "Today, 6:00 AM",
    nextRun: status === "waiting" ? "Sep 1" : index % 3 === 0 ? "Tomorrow, 6:00 AM" : "Mon, 6:00 AM",
    records: status === "waiting" ? 0 : (index * 7) % 31,
    success: status === "blocked" ? 42 : status === "attention" ? 78 : status === "waiting" ? 100 : 96,
    blocker:
      status === "blocked"
        ? "Portal blocks automated access; manual export connector required"
        : status === "attention"
          ? "Reachable, but document-specific parser needs review"
          : status === "waiting"
            ? "Public-record response or manual monthly file pending"
            : undefined,
  };
});

export const demoProjects: Project[] = [
  {
    id: "PRJ-1001",
    name: "Demo · Riverwalk Dental tenant finish",
    address: "1850 Zumbehl Road",
    city: "St. Charles",
    suite: "Suite 210",
    stage: "Buildout",
    score: 92,
    momentum: 14,
    updated: "18 minutes ago",
    firstSource: "St. Charles planning agenda",
    qualifyingSource: "St. Charles eSuite permits",
    signals: 5,
    matches: [
      { trade: "Alarm / security", member: "Jim · Security", score: 96, state: "new" },
      { trade: "Telecom", member: "AT&T", score: 91, state: "sent" },
      { trade: "Plumbing", member: "Open seat", score: 87, state: "new" },
      { trade: "Signage", member: "Open seat", score: 82, state: "new" },
    ],
    events: [
      { date: "Aug 14", source: "SRC-010", title: "Commercial alteration permit", detail: "$310,000 dental office buildout; general contractor listed.", impact: "+26 all trades" },
      { date: "Aug 08", source: "SRC-013", title: "Business license application", detail: "Riverwalk Dental registered to Suite 210.", impact: "+18 telecom · signage" },
      { date: "Jul 29", source: "SRC-012", title: "Conditional-use hearing", detail: "Medical office use approved at this address.", impact: "+12 early signal" },
    ],
  },
  {
    id: "PRJ-1002",
    name: "Demo · Winghaven Commerce Center",
    address: "7401 Highway N",
    city: "Dardenne Prairie",
    suite: "Building B",
    stage: "Shell construction",
    score: 86,
    momentum: 8,
    updated: "2 hours ago",
    firstSource: "County land development",
    qualifyingSource: "Dardenne Prairie permits",
    signals: 4,
    matches: [
      { trade: "Electrical", member: "Open seat", score: 93, state: "new" },
      { trade: "Fire alarm", member: "Jim · Security", score: 88, state: "accepted" },
      { trade: "Telecom", member: "Spectrum", score: 79, state: "new" },
    ],
    events: [
      { date: "Aug 14", source: "SRC-031", title: "Shell permit issued", detail: "28,000 sq. ft. commercial shell, Building B.", impact: "+24 MEP" },
      { date: "Jul 31", source: "SRC-033", title: "Public infrastructure bid", detail: "Road and utility work adjacent to site.", impact: "+9 utilities" },
    ],
  },
  {
    id: "PRJ-1003",
    name: "Demo · Wentzville fitness conversion",
    address: "1960 Wentzville Parkway",
    city: "Wentzville",
    suite: "Suite 140",
    stage: "Planning",
    score: 78,
    momentum: 19,
    updated: "Yesterday",
    firstSource: "Wentzville planning applications",
    qualifyingSource: "Wentzville SmartGov",
    signals: 3,
    matches: [
      { trade: "Locks / access", member: "Open seat", score: 84, state: "new" },
      { trade: "Telecom", member: "Spectrum", score: 82, state: "new" },
      { trade: "Plumbing", member: "Open seat", score: 71, state: "new" },
    ],
    events: [
      { date: "Aug 13", source: "SRC-024", title: "Site-plan revision", detail: "Interior conversion to 24-hour fitness use.", impact: "+19 momentum" },
      { date: "Aug 04", source: "SRC-049", title: "New Missouri entity", detail: "Tenant entity registered with local organizer.", impact: "+8 confidence" },
    ],
  },
  {
    id: "PRJ-1004",
    name: "Demo · Mid Rivers restaurant refresh",
    address: "580 Mid Rivers Mall Drive",
    city: "St. Peters",
    suite: "Pad 4",
    stage: "License pending",
    score: 71,
    momentum: -5,
    updated: "3 days ago",
    firstSource: "St. Peters opening a business",
    qualifyingSource: "St. Peters permits & licenses",
    signals: 4,
    matches: [
      { trade: "Plumbing", member: "Open seat", score: 76, state: "working" },
      { trade: "Signage", member: "Open seat", score: 68, state: "sent" },
      { trade: "Fire suppression", member: "Open seat", score: 63, state: "new" },
    ],
    events: [
      { date: "Aug 11", source: "SRC-019", title: "Kitchen alteration permit", detail: "Hood and plumbing modifications under review.", impact: "+18 kitchen trades" },
      { date: "Jul 22", source: "SRC-021", title: "Business opening checklist", detail: "Tenant inquiry logged for restaurant use.", impact: "+10 early signal" },
    ],
  },
];

const memberSeeds: Array<[string, string, string, string]> = [
  ["Jim", "Jim’s company", "Alarm / security", "Countywide"],
  ["AT&T team", "AT&T", "Telecom / fiber", "Countywide"],
  ["Spectrum team", "Spectrum", "Telecom / broadband", "Countywide"],
  ["Open member", "Electrical seat", "Electrical", "Countywide"],
  ["Open member", "Plumbing seat", "Plumbing", "Countywide"],
  ["Open member", "Locksmith seat", "Locks / access control", "Countywide"],
  ["Open member", "Signage seat", "Signage", "Countywide"],
  ["Open member", "Fire protection seat", "Fire suppression", "Countywide"],
  ["Open member", "HVAC seat", "HVAC", "Countywide"],
  ["Open member", "General contractor seat", "General contractor", "Countywide"],
  ["Open member", "Flooring seat", "Flooring", "Countywide"],
  ["Open member", "Painting seat", "Painting", "Countywide"],
  ["Open member", "Glass seat", "Glass / glazing", "Countywide"],
  ["Open member", "Roofing seat", "Roofing", "Countywide"],
  ["Open member", "Low-voltage seat", "Low voltage", "Countywide"],
  ["Open member", "Commercial cleaning seat", "Cleaning", "Countywide"],
  ["Open member", "Furniture seat", "Furniture", "Countywide"],
  ["Open member", "Architect seat", "Architecture", "Countywide"],
  ["Open member", "Insurance seat", "Commercial insurance", "Countywide"],
  ["Open member", "Moving seat", "Commercial moving", "Countywide"],
];

export const demoMembers: Member[] = memberSeeds.map((seed, index) => ({
  id: `MBR-${String(index + 1).padStart(3, "0")}`,
  contact: seed[0],
  company: seed[1],
  trade: seed[2],
  territory: seed[3],
  active: index < 3,
  matches: index === 0 ? 14 : index === 1 ? 11 : index === 2 ? 9 : 0,
  accepted: index === 0 ? 11 : index === 1 ? 8 : index === 2 ? 7 : 0,
  won: index === 0 ? 3 : index === 1 ? 2 : index === 2 ? 1 : 0,
}));

export const navItems = [
  ["command", "⌂", "Command center"],
  ["agents", "◎", "Source agents"],
  ["evidence", "▤", "Evidence review"],
  ["projects", "◇", "Project timelines"],
  ["members", "♙", "Members & routing"],
  ["approvals", "✓", "Access approvals"],
  ["referrals", "↗", "Referrals & attribution"],
  ["rules", "∑", "Scoring & rules"],
] as const;
