import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callClaudeJSON } from '@/lib/goldenGoose/claudeClient';
import { buildPresentationPrompt } from '@/lib/goldenGoose/prompts';
import { checkGoldenGooseRateLimit } from '@/lib/rateLimiter';
import type { GoldenGooseSubmission, PresentationResult } from '@/lib/goldenGoose/types';

// Only takes `seconds` from the client — everything else (name, company,
// role, Golden Geese) is pulled server-side from the saved submission, per
// the spec's "do not ask for information twice" rule.
export async function POST(req: NextRequest) {
  try {
    const { id, seconds } = await req.json() as { id?: string; seconds?: number };

    if (!id || !seconds || seconds <= 0) {
      return NextResponse.json({ error: 'Submission id and a presentation length in seconds are required.' }, { status: 400 });
    }

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

    const geese = submission.full_report ?? submission.top5_report;
    if (!geese || geese.length === 0) {
      return NextResponse.json({ error: 'Please generate your Golden Goose report first.' }, { status: 400 });
    }

    const prompt = buildPresentationPrompt({
      name: submission.name,
      companyName: submission.company_name,
      roleDescription: submission.role_description,
      seconds,
      geese,
    });

    let text: string;
    try {
      const result = await callClaudeJSON<PresentationResult>({ ...prompt, maxTokens: 1024 });
      text = result.text;
    } catch (err) {
      console.error('GOLDEN_GOOSE_PRESENTATION_CLAUDE_FAIL:', err instanceof Error ? err.message : err);
      return NextResponse.json({ error: 'Something went wrong writing your presentation. Please try again.' }, { status: 502 });
    }

    const { error: updateError } = await supabase
      .from('golden_goose_submissions')
      .update({ presentation_seconds: seconds, presentation_text: text, status: 'presentation_done' })
      .eq('id', id);

    if (updateError) {
      console.error('GOLDEN_GOOSE_PRESENTATION_SAVE_FAIL:', JSON.stringify(updateError));
      return NextResponse.json({ error: 'Something went wrong saving your presentation. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ seconds, text });
  } catch (err) {
    console.error('GOLDEN_GOOSE_PRESENTATION_FAIL:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong on our end. Please try again.' }, { status: 500 });
  }
}
