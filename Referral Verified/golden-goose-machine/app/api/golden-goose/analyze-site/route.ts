import { NextRequest, NextResponse } from 'next/server';
import { assertPublicHostname } from '@/lib/ssrfGuard';
import { fetchPage } from '@/lib/agents/htmlAgent/fetchPage';
import { supabase } from '@/lib/supabase';
import { checkGoldenGooseRateLimit } from '@/lib/rateLimiter';
import { callClaudeJSON } from '@/lib/goldenGoose/claudeClient';
import { buildSiteAnalysisPrompt } from '@/lib/goldenGoose/prompts';
import { extractSiteText } from '@/lib/goldenGoose/extractSiteText';
import type { SiteAnalysis, RoleClarificationTurn } from '@/lib/goldenGoose/types';

// Entry point to the whole Golden Goose flow: takes the intake form, reads
// the company website, and has Claude extract structured facts about the
// business. Creates the Supabase row that every later step updates.
export async function POST(req: NextRequest) {
  try {
    const { name, companyName, companyWebsite, email, phone, roleDescription, roleClarification } = await req.json() as {
      name?: string; companyName?: string; companyWebsite?: string; email?: string; phone?: string;
      roleDescription?: string; roleClarification?: RoleClarificationTurn[];
    };

    if (!name || !companyName || !companyWebsite || !email || !phone || !roleDescription) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '0.0.0.0';

    const { limited } = await checkGoldenGooseRateLimit(ip);
    if (limited) {
      return NextResponse.json({ limit: true, message: "You've reached today's free Golden Goose report limit. Come back tomorrow." });
    }

    const normalizedUrl = companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`;
    let hostname: string;
    try {
      hostname = new URL(normalizedUrl).hostname;
    } catch {
      return NextResponse.json({ error: 'That website address doesn\'t look right. Please check it and try again.' }, { status: 422 });
    }

    try {
      await assertPublicHostname(hostname);
    } catch {
      return NextResponse.json({ error: 'We couldn\'t reach that website. Please check the spelling and try again.' }, { status: 422 });
    }

    const page = await fetchPage(normalizedUrl);
    if (!page) {
      return NextResponse.json({ error: 'We couldn\'t load that website. Please check the address and try again.' }, { status: 422 });
    }

    const websiteText = extractSiteText(page.html);
    if (websiteText.length < 50) {
      return NextResponse.json({ error: 'That website didn\'t have enough content for us to analyze it.' }, { status: 422 });
    }

    let siteAnalysis: SiteAnalysis;
    try {
      const prompt = buildSiteAnalysisPrompt({ companyName, websiteText });
      siteAnalysis = await callClaudeJSON<SiteAnalysis>(prompt);
    } catch (err) {
      console.error('GOLDEN_GOOSE_SITE_ANALYSIS_FAIL:', err instanceof Error ? err.message : err);
      return NextResponse.json({ error: 'Something went wrong analyzing your website. Please try again.' }, { status: 502 });
    }

    const { data, error } = await supabase
      .from('golden_goose_submissions')
      .insert({
        ip_address: ip,
        name,
        company_name: companyName,
        company_website: normalizedUrl,
        email,
        phone,
        role_description: roleDescription,
        role_clarification: roleClarification ?? null,
        site_analysis: siteAnalysis,
        status: 'site_analyzed',
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('GOLDEN_GOOSE_INSERT_FAIL:', JSON.stringify(error));
      return NextResponse.json({ error: 'Something went wrong saving your submission. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, siteAnalysis });
  } catch (err) {
    console.error('GOLDEN_GOOSE_ANALYZE_SITE_FAIL:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong on our end. Please try again.' }, { status: 500 });
  }
}
