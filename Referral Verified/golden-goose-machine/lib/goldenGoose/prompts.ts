import type { RoleClarificationTurn, VerifiedAttributes, GoldenGooseReportMode, GoldenGooseRow } from './types';

// Prompt + schema builders for every Golden Goose Claude call. Kept separate
// from claudeClient.ts so that file stays a pure transport layer.

const GOLDEN_GOOSE_ROW_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'The Golden Goose (or Super Sleeper Golden Goose) — a profession, role, or company type.' },
    whatTheyCanDo: { type: 'string', description: 'What this Golden Goose can do for the user — 1-2 sentences.' },
    topFiveToMeet: {
      type: 'array', items: { type: 'string' }, minItems: 5, maxItems: 5,
      description: 'Exactly 5 people/professions this Golden Goose would like to meet.',
    },
  },
  required: ['name', 'whatTheyCanDo', 'topFiveToMeet'],
};

export function buildSiteAnalysisPrompt(input: { companyName: string; websiteText: string }) {
  return {
    system: 'You analyze a company website and extract structured facts. Only report what the site actually supports — do not invent services, industries, or specialties that aren\'t evidenced by the text provided.',
    user: `Company name: ${input.companyName}\n\nWebsite text (extracted):\n${input.websiteText.slice(0, 12000)}\n\nExtract: what the company does (short summary), the services it provides, the industries it serves, whether its customers are residential, commercial, or both, primary customer types, and any specialties that stand out.`,
    toolName: 'record_site_analysis',
    toolDescription: 'Record the structured analysis of the company website.',
    inputSchema: {
      type: 'object',
      properties: {
        companySummary: { type: 'string' },
        services: { type: 'array', items: { type: 'string' } },
        industries: { type: 'array', items: { type: 'string' } },
        residentialCommercial: { type: 'string', enum: ['residential', 'commercial', 'both'] },
        customerTypes: { type: 'array', items: { type: 'string' } },
        specialties: { type: 'array', items: { type: 'string' } },
      },
      required: ['companySummary', 'services', 'industries', 'residentialCommercial', 'customerTypes', 'specialties'],
    },
  };
}

export function buildRoleClarificationPrompt(input: { companyName: string; roleDescription: string; priorTurns: RoleClarificationTurn[] }) {
  const history = input.priorTurns.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n');
  return {
    system: 'You judge whether a description of someone\'s day-to-day work is specific enough to identify good referral partners for them. Bare job titles (Owner, President, Vice President, Manager, Director, Associate, Consultant, Advisor, Specialist, Representative, Officer) are NEVER sufficient on their own — you need to know what they actually DO (e.g. Commercial Sales, Residential Sales, Service Manager, Operations, Estimator, Installer, Project Manager, Business Development, Networking, Purchasing). If sufficient, say so. If not, ask exactly one polite, specific follow-up question — never more than one at a time.',
    user: `Company: ${input.companyName}\n${history ? `Prior Q&A:\n${history}\n\n` : ''}Current answer to "What do you actually do for this company?":\n${input.roleDescription}`,
    toolName: 'judge_role_description',
    toolDescription: 'Decide whether the role description is specific enough, or ask one follow-up question.',
    inputSchema: {
      type: 'object',
      properties: {
        sufficient: { type: 'boolean' },
        followUpQuestion: { type: 'string', description: 'Only set when sufficient is false — exactly one polite, specific question.' },
      },
      required: ['sufficient'],
    },
  };
}

export function buildReportPrompt(input: {
  name: string; companyName: string; roleDescription: string;
  verifiedAttributes: VerifiedAttributes; specialNote?: string | null; mode: GoldenGooseReportMode;
}) {
  const count = input.mode === 'top5' ? 5 : 20;
  const { verifiedAttributes: v } = input;
  return {
    system: `You identify "Golden Geese" — the strongest referral partners for a business professional. A Golden Goose touches the exact end customer the user wants but does not compete with them. Mix traditional Golden Geese and "Super Sleeper" (non-obvious but powerful) Golden Geese naturally in one ranked list — do not separate them into groups, and rank a strong sleeper above a weaker traditional one. Every entry needs exactly 5 people in its "who they'd like to meet" list. Base this on the verified company facts below — do not restate the company's own services as Golden Geese, and do not suggest competitors.`,
    user: `Name: ${input.name}\nCompany: ${input.companyName}\nWhat they actually do: ${input.roleDescription}\n\nVerified company facts:\nSummary: ${v.companySummary}\nServices: ${v.services.join(', ')}\nIndustries served: ${v.industries.join(', ')}\nResidential/Commercial: ${v.residentialCommercial}\nCustomer types: ${v.customerTypes.join(', ')}\nSpecialties: ${v.specialties.join(', ')}\n${input.specialNote ? `Especially successful with: ${input.specialNote}\n` : ''}\nGenerate exactly ${count} Golden Geese, ranked strongest first.`,
    toolName: 'record_golden_geese_report',
    toolDescription: `Record exactly ${count} ranked Golden Geese rows.`,
    inputSchema: {
      type: 'object',
      properties: {
        rows: { type: 'array', items: GOLDEN_GOOSE_ROW_SCHEMA, minItems: count, maxItems: count },
      },
      required: ['rows'],
    },
  };
}

export function buildPresentationPrompt(input: {
  name: string; companyName: string; roleDescription: string; seconds: number; geese: GoldenGooseRow[];
}) {
  const top = input.geese.slice(0, 3).map(g => `${g.name} — ${g.whatTheyCanDo} (they'd like to meet: ${g.topFiveToMeet.join(', ')})`).join('\n');
  return {
    system: 'You write short, natural spoken networking presentations ("elevator pitches") for referral-group meetings. Introduce the person and company, explain what they actually do, name an ideal end-user customer and the Golden Goose connected to that customer, offer a reciprocal introduction, and close with their name and company — in a tone a real person could say out loud, timed to the requested length.',
    user: `Name: ${input.name}\nCompany: ${input.companyName}\nWhat they do: ${input.roleDescription}\nTarget length: ${input.seconds} seconds\n\nTop Golden Geese:\n${top}\n\nWrite the presentation script.`,
    toolName: 'record_presentation',
    toolDescription: 'Record the finished presentation script.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  };
}
