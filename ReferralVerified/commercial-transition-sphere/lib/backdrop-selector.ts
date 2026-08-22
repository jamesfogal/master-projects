export type BackdropFamily =
  | "brand-grid"
  | "care-flow"
  | "clinical-bright"
  | "commercial-scaffold"
  | "structured-civic";

export type BackdropVariant = "city" | "gate" | "hero" | "minimal";

export type BackdropDensity = "light" | "medium" | "rich";

export type BackdropPageKind =
  | "city"
  | "frontpage"
  | "login"
  | "service"
  | "workspace";

export type BackdropTone = "brand" | "calm" | "civic" | "minimal" | "premium";

export type BackdropContext = {
  city?: string;
  familyHint?: BackdropFamily;
  industry?: string;
  keywords?: string[];
  pageKind: BackdropPageKind;
  tone?: BackdropTone;
};

export type BackdropTheme = {
  accentEnd: string;
  accentMid: string;
  accentStart: string;
  buttonEnd: string;
  buttonStart: string;
  glowA: string;
  glowB: string;
  heading: string;
  label: string;
  skyEnd: string;
  skyMid: string;
  skyStart: string;
};

export type BackdropDecision = {
  density: BackdropDensity;
  family: BackdropFamily;
  label: string;
  reason: string;
  theme: BackdropTheme;
  variant: BackdropVariant;
};

type BackdropFamilyDefinition = {
  description: string;
  label: string;
  theme: BackdropTheme;
};

export const backdropFamilies: Record<
  BackdropFamily,
  BackdropFamilyDefinition
> = {
  "brand-grid": {
    label: "Brand Grid",
    description:
      "Generic brand-safe geometry with rails, planes, and editorial linework.",
    theme: {
      skyStart: "#14385a",
      skyMid: "#255b81",
      skyEnd: "#5f99a8",
      glowA: "rgba(255,255,255,.12)",
      glowB: "rgba(160, 216, 217, .14)",
      accentStart: "#133a58",
      accentMid: "#2d6788",
      accentEnd: "#64a4b2",
      label: "#76aab1",
      heading: "#13344d",
      buttonStart: "#123552",
      buttonEnd: "#2c6d8d",
    },
  },
  "care-flow": {
    label: "Care Flow",
    description:
      "Soft trust curves, measured technical marks, and clinical calm for care-led brands.",
    theme: {
      skyStart: "#0b4160",
      skyMid: "#126b84",
      skyEnd: "#87b7b3",
      glowA: "rgba(255,255,255,.15)",
      glowB: "rgba(165, 238, 222, .18)",
      accentStart: "#124765",
      accentMid: "#207389",
      accentEnd: "#7abfb8",
      label: "#5da4a0",
      heading: "#11354c",
      buttonStart: "#123d57",
      buttonEnd: "#287d89",
    },
  },
  "clinical-bright": {
    label: "Clinical Bright",
    description:
      "Enamel-white curves and glassy structure for dental and precision-service brands.",
    theme: {
      skyStart: "#0c5790",
      skyMid: "#1f86bf",
      skyEnd: "#a7d7f2",
      glowA: "rgba(255,255,255,.18)",
      glowB: "rgba(210, 242, 255, .22)",
      accentStart: "#0f4c78",
      accentMid: "#2284b4",
      accentEnd: "#8ccde7",
      label: "#5f97b7",
      heading: "#143750",
      buttonStart: "#124666",
      buttonEnd: "#2d8ab1",
    },
  },
  "commercial-scaffold": {
    label: "Commercial Scaffold",
    description:
      "Deep sky, scaffold decks, lift tower, and amber rails for commercial construction pages.",
    theme: {
      skyStart: "#024487",
      skyMid: "#0a58aa",
      skyEnd: "#1471d2",
      glowA: "rgba(255,255,255,.14)",
      glowB: "rgba(255,255,255,.18)",
      accentStart: "#17364f",
      accentMid: "#2f617d",
      accentEnd: "#5d96a4",
      label: "#5d8c96",
      heading: "#0f314b",
      buttonStart: "#10283f",
      buttonEnd: "#1a4861",
    },
  },
  "structured-civic": {
    label: "Structured Civic",
    description:
      "Framed columns, ledgers, and measured rhythm for legal, finance, and authority-led brands.",
    theme: {
      skyStart: "#20334e",
      skyMid: "#415a77",
      skyEnd: "#c8d2dc",
      glowA: "rgba(255,255,255,.1)",
      glowB: "rgba(246, 220, 167, .12)",
      accentStart: "#243649",
      accentMid: "#586c7e",
      accentEnd: "#b89a58",
      label: "#8a8f96",
      heading: "#203346",
      buttonStart: "#223445",
      buttonEnd: "#556f83",
    },
  },
};

const familyMatchers: Array<{
  family: BackdropFamily;
  terms: string[];
}> = [
  {
    family: "commercial-scaffold",
    terms: [
      "commercial",
      "construction",
      "contractor",
      "roofing",
      "masonry",
      "scaffold",
      "builder",
      "trade",
      "sphere",
    ],
  },
  {
    family: "clinical-bright",
    terms: [
      "dental",
      "dentist",
      "orthodont",
      "enamel",
      "smile",
      "oral",
      "implant",
    ],
  },
  {
    family: "structured-civic",
    terms: [
      "legal",
      "law",
      "attorney",
      "finance",
      "wealth",
      "advisor",
      "accounting",
      "compliance",
      "court",
    ],
  },
  {
    family: "care-flow",
    terms: [
      "medical",
      "health",
      "clinic",
      "wellness",
      "care",
      "physician",
      "hospital",
      "therapy",
    ],
  },
];

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function collectTokens(context: BackdropContext) {
  const values = [
    context.city,
    context.industry,
    context.tone,
    ...(context.keywords ?? []),
  ].filter(Boolean) as string[];

  return values
    .flatMap((value) => normalizeToken(value).split(/[^a-z0-9]+/))
    .filter(Boolean);
}

function inferFamily(context: BackdropContext): {
  family: BackdropFamily;
  reason: string;
} {
  if (context.familyHint) {
    return {
      family: context.familyHint,
      reason: `Explicit family hint matched ${backdropFamilies[context.familyHint].label}.`,
    };
  }

  const tokens = collectTokens(context);

  for (const matcher of familyMatchers) {
    if (matcher.terms.some((term) => tokens.includes(term))) {
      return {
        family: matcher.family,
        reason: `Context keywords matched ${backdropFamilies[matcher.family].label}.`,
      };
    }
  }

  return {
    family: "brand-grid",
    reason: "No industry-specific match was found, so the selector used the brand-safe fallback family.",
  };
}

function selectVariant(pageKind: BackdropPageKind): BackdropVariant {
  switch (pageKind) {
    case "frontpage":
      return "hero";
    case "city":
      return "city";
    case "workspace":
      return "minimal";
    default:
      return "gate";
  }
}

function selectDensity(
  family: BackdropFamily,
  pageKind: BackdropPageKind,
): BackdropDensity {
  if (pageKind === "workspace") {
    return "light";
  }

  if (pageKind === "frontpage") {
    return "rich";
  }

  if (pageKind === "city") {
    return family === "commercial-scaffold" ? "rich" : "medium";
  }

  if (pageKind === "login") {
    if (family === "commercial-scaffold") {
      return "rich";
    }

    return family === "structured-civic" ? "light" : "medium";
  }

  return "medium";
}

export function selectBackdrop(context: BackdropContext): BackdropDecision {
  const familyDecision = inferFamily(context);
  const family = familyDecision.family;

  return {
    family,
    label: backdropFamilies[family].label,
    reason: familyDecision.reason,
    theme: backdropFamilies[family].theme,
    variant: selectVariant(context.pageKind),
    density: selectDensity(family, context.pageKind),
  };
}
