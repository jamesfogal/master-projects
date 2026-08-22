import type { SourceConnector } from "./source-catalog";

export type ExtractableSource = {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  url: string;
};

export type EvidenceCandidate = {
  recordKey: string;
  title: string;
  sourceUrl: string;
  sourcePage: string | null;
  excerpt: string;
  eventType: string;
  occurredAt: string | null;
  addressRaw: string | null;
  organizationRaw: string | null;
  confidence: number;
  payload: Record<string, unknown>;
};

const relevantTerms = /\b(permit|planning|zoning|site plan|conditional use|rezon|development|occupancy|business licen[sc]|agenda|packet|public notice|hearing|bid|rfp|rfq|award|construction|commercial|tenant|remodel|renovation|alteration|fire protection|inspection|departmental report|economic development|expansion|opening|request for proposal)\b/i;
const navigationTerms = /^(home|contact|staff|calendar|facebook|instagram|linkedin|youtube|privacy|accessibility|sitemap|site map|copyright|login|sign in|search|read more|learn more)$/i;
const residentialTerms = /\b(single[- ]family|residential|homeowner|new home|deck permit|pool permit|garage permit|fence permit|room addition)\b/i;
const commercialTerms = /\b(commercial|business|tenant|office|retail|restaurant|industrial|warehouse|medical|dental|multifamily|multi-family|apartment|school|church|hotel|store|salon|fitness|daycare|clinic)\b/i;
const streetSuffix = "(?:Street|St\\.?|Road|Rd\\.?|Avenue|Ave\\.?|Boulevard|Blvd\\.?|Drive|Dr\\.?|Lane|Ln\\.?|Highway|Hwy\\.?|Parkway|Pkwy\\.?|Court|Ct\\.?|Circle|Cir\\.?|Way|Trail|Trl\\.?)";
const addressPattern = new RegExp(`\\b\\d{1,6}\\s+(?:[NSEW]\\.?\\s+)?[A-Z0-9][A-Za-z0-9.'-]*(?:\\s+[A-Za-z0-9.'-]+){0,4}\\s+${streetSuffix}\\b`, "i");

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function cleanText(value: string) {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function safeUrl(href: string, base: string) {
  if (!href || /^(#|javascript:|mailto:|tel:)/i.test(href)) return null;
  try {
    const url = new URL(decodeHtml(href), base);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function parseDate(text: string) {
  const monthDate = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:(\d{1,2})(?:st|nd|rd|th)?[,]?\s+)?(20\d{2})\b/i);
  if (monthDate) {
    const parsed = new Date(`${monthDate[1]} ${monthDate[2] ?? "1"}, ${monthDate[3]} 12:00:00 UTC`);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  const numeric = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/);
  if (numeric) {
    const parsed = new Date(Date.UTC(Number(numeric[3]), Number(numeric[1]) - 1, Number(numeric[2]), 12));
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return null;
}

function eventTypeFor(category: string, text: string) {
  if (/bid|rfp|rfq|award|procurement/i.test(text) || category === "Procurement") return "procurement_notice";
  if (/agenda|hearing|zoning|rezon|site plan|conditional use|planning/i.test(text) || category === "Planning & zoning") return "planning_event";
  if (/fire|life safety|suppression/i.test(text) || category === "Fire & life safety") return "fire_life_safety";
  if (/license|opening|new business/i.test(text) || category === "Business & licensing") return "business_license";
  if (/report/i.test(text)) return "report_published";
  if (/permit|occupancy|construction|remodel|renovation|alteration/i.test(text) || category === "Permits") return "permit_notice";
  if (category === "Economic & state") return "economic_development";
  return "public_source_notice";
}

function likelyResidential(text: string) {
  return residentialTerms.test(text) && !commercialTerms.test(text);
}

function candidateScore(text: string, url: string, address: string | null, category: string) {
  let score = 0.42;
  if (relevantTerms.test(text)) score += 0.14;
  if (/\.pdf(?:\?|$)|DocumentCenter|AgendaCenter|bid|rfp|rfq/i.test(url)) score += 0.08;
  if (address) score += 0.18;
  if (commercialTerms.test(text)) score += 0.12;
  if (category === "Permits" || category === "Planning & zoning") score += 0.04;
  return Math.min(0.94, Math.round(score * 100) / 100);
}

function withinBackfill(occurredAt: string | null, backfillDays: number) {
  if (!occurredAt || backfillDays <= 0) return true;
  return new Date(occurredAt).getTime() >= Date.now() - backfillDays * 86_400_000;
}

function buildCandidate(source: ExtractableSource, connector: SourceConnector, rawTitle: string, rawContext: string, url: string, kind: "link" | "row", index: number): EvidenceCandidate | null {
  const title = cleanText(rawTitle).slice(0, 220);
  const context = cleanText(rawContext).slice(0, 900);
  const combined = `${title} ${context}`.trim();
  if (!title || navigationTerms.test(title) || !relevantTerms.test(combined) || likelyResidential(combined)) return null;
  const occurredAt = parseDate(combined);
  if (!withinBackfill(occurredAt, connector.backfillDays)) return null;
  const address = combined.match(addressPattern)?.[0] ?? null;
  const eventType = eventTypeFor(source.category, combined);
  return {
    recordKey: `${kind}|${url}|${title}|${occurredAt ?? index}`,
    title,
    sourceUrl: url,
    sourcePage: source.url,
    excerpt: context || title,
    eventType,
    occurredAt,
    addressRaw: address,
    organizationRaw: null,
    confidence: candidateScore(combined, url, address, source.category),
    payload: { extractor: "official-html-v2", jurisdiction: source.jurisdiction, category: source.category, kind },
  };
}

export function extractEvidenceCandidates(source: ExtractableSource, connector: SourceConnector, html: string, finalUrl: string) {
  if (connector.mode !== "document-index" && connector.mode !== "html-candidates") return [];
  const candidates: EvidenceCandidate[] = [];
  const seen = new Set<string>();
  const anchorPattern = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let anchor: RegExpExecArray | null;
  let index = 0;
  while ((anchor = anchorPattern.exec(html)) && candidates.length < connector.maxCandidates * 2) {
    const url = safeUrl(anchor[1], finalUrl);
    if (!url || seen.has(url)) continue;
    const surrounding = html.slice(Math.max(0, anchor.index - 180), Math.min(html.length, anchorPattern.lastIndex + 220));
    const candidate = buildCandidate(source, connector, anchor[2], surrounding, url, "link", index++);
    if (candidate) {
      seen.add(url);
      candidates.push(candidate);
    }
  }

  if (connector.mode === "html-candidates") {
    const rowPattern = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    let row: RegExpExecArray | null;
    while ((row = rowPattern.exec(html)) && candidates.length < connector.maxCandidates * 2) {
      const rowText = cleanText(row[1]);
      if (rowText.length < 18 || rowText.length > 1500) continue;
      const candidate = buildCandidate(source, connector, rowText.slice(0, 180), rowText, finalUrl, "row", index++);
      if (candidate) candidates.push(candidate);
    }
  }

  return candidates
    .sort((a, b) => (b.occurredAt ?? "").localeCompare(a.occurredAt ?? "") || b.confidence - a.confidence)
    .slice(0, connector.maxCandidates);
}
