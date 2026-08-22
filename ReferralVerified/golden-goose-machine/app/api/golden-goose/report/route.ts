import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This link is unauthenticated — the id itself is the only gate. Explicit
// allow-list, same reasoning as app/api/report/route.ts: email, phone, and
// ip_address must never be exposed to whoever holds the link.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });

  const { data, error } = await supabase
    .from('golden_goose_submissions')
    .select(`
      id, created_at, name, company_name, company_website, role_description,
      site_analysis, verified_attributes, special_note,
      top5_report, full_report, referral_analysis,
      presentation_seconds, presentation_text, status
    `)
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

  return NextResponse.json(data);
}
