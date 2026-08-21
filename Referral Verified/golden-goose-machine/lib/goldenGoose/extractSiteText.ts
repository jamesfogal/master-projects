// Strips a raw HTML page down to visible text for feeding to Claude. Unlike
// contentQualityAgent's extractBody, this keeps the whole page (nav, footer,
// about/services copy included) — Golden Goose analysis wants the full
// picture of what a company says about itself, not just one article body.
export function extractSiteText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
