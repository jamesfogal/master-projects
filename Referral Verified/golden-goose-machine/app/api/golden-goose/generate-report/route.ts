import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callClaudeJSON } from '@/lib/goldenGoose/claudeClient';
import { buildReportPrompt } from '@/lib/goldenGoose/prompts';
import { computeReferralAnalysis } from '@/lib/goldenGoose/referralAnalysis';
import { checkGoldenGooseRateLimit } from '@/lib/rateLimiter';
import type { GoldenGooseReportMode, GoldenGooseRow, GoldenGooseSubmission } from '@/lib/goldenGoose/types';

interface ReportToolResult { rows: GoldenGooseRow[]; }

function isValidShape(rows: GoldenGooseRow[], expectedCount: number): boolean {
  return rows.length === expectedCount && rows.every(r => r.topFiveToMeet.length === 5 && r.name && r.whatTheyCanDo);
}

// Handles both the 5-row preview and the 20-row full report (one prompt
// template, parametrized by mode) so the shape-validation and Claude-call
// logic isn't duplicated across two files.
export async function POST(req: NextRequest) {
  try {
    const { id, mode } = await req.json() as { id?: string; mode?: GoldenGooseReportMode };

    if (!id || (mode !== 'top5' && mode !== 'full20')) {
      return NextResponse.json({ error: 'Submission id and a valid mode (top5 or full20) are required.' }, { status: 400 });
    }

    // Guards against calling this endpoint directly and repeatedly for the
    // same (or many) submission ids — analyze-site's rate limit alone
    // doesn't cover repeat report generation on an id that already exists.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '0.0.0.0';
    const { limited } = await checkGoldenGooseRateLimit(ip);
    if (limited) {
      return NextResponse.json({ error: "You've reached today's free Golden Goose usage limit. Come back tomorrow." }, { status: 429 });
    }

    const { data: submission, error: fetchError } = await supabase
      .from('golden_goose_submissions')
      .select('*')
      .eq('id', id)
      .single<GoldenGooseSubmission>();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'We couldn\'t find that submission.' }, { status: 404 });
    }
    if (!submission.verified_attributes) {
      return NextResponse.json({ error: 'Please complete the verification step first.' }, { status: 400 });
    }

    const expectedCount = mode === 'top5' ? 5 : 20;
    const prompt = buildReportPrompt({
      name: submission.name,
      companyName: submission.company_name,
      roleDescription: submission.role_description,
      verifiedAttributes: submission.verified_attributes,
      specialNote: submission.special_note,
      mode,
    });

    // A schema-constrained Claude call usually returns the right shape, but
    // not always — retry once on a shape miss before giving up, same spirit
    // as callClaudeJSON's own one-retry-on-failure policy. Without this, a
    // single off-shape response (e.g. 4 names instead of 5) fails the whole
    // report generation for no good reason.
    let rows: GoldenGooseRow[] | null = null;
    for (let attempt = 1; attempt <= 2 && !rows; attempt++) {
      try {
        const result = await callClaudeJSON<ReportToolResult>({ ...prompt, maxTokens: mode === 'full20' ? 8192 : 2048 });
        if (isValidShape(result.rows, expectedCount)) {
          rows = result.rows;
        } else {
          console.error(`GOLDEN_GOOSE_REPORT_SHAPE_FAIL (attempt ${attempt}):`, JSON.stringify(result.rows).slice(0, 500));
        }
      } catch (err) {
        console.error(`GOLDEN_GOOSE_REPORT_CLAUDE_FAIL (attempt ${attempt}):`, err instanceof Error ? err.message : err);
      }
    }

    if (!rows) {
      return NextResponse.json({ error: 'Something went wrong generating your report. Please try again.' }, { status: 502 });
    }

    const updates: Record<string, unknown> = mode === 'top5'
      ? { top5_report: rows, status: 'top5_done' }
      : { full_report: rows, status: 'full_done' };

    if (mode === 'full20') {
      try {
        updates.referral_analysis = computeReferralAnalysis(rows);
      } catch (err) {
        console.error('GOLDEN_GOOSE_REFERRAL_ANALYSIS_FAIL:', err instanceof Error ? err.message : err);
        return NextResponse.json({ error: 'The report came back in an unexpected shape. Please try again.' }, { status: 502 });
      }
    }

    const { error: updateError } = await supabase.from('golden_goose_submissions').update(updates).eq('id', id);
    if (updateError) {
      console.error('GOLDEN_GOOSE_REPORT_SAVE_FAIL:', JSON.stringify(updateError));
      return NextResponse.json({ error: 'Something went wrong saving your report. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ rows, referralAnalysis: updates.referral_analysis ?? null });
  } catch (err) {
    console.error('GOLDEN_GOOSE_GENERATE_REPORT_FAIL:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong on our end. Please try again.' }, { status: 500 });
  }
}
