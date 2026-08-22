import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { SiteAnalysis, VerifiedAttributes } from '@/lib/goldenGoose/types';

const RES_COM_VALUES = new Set(['residential', 'commercial', 'both']);
const SPECIAL_NOTE_MAX_LENGTH = 500;

// The verification screen only ever lets a user *uncheck* items the website
// analysis actually found, never add new ones — so this route only trusts
// the client for which items stayed checked, and cross-checks every item
// against the submission's own stored site_analysis before saving. Without
// this, a request built directly against the API (bypassing the UI) could
// inject arbitrary company facts into someone else's submission.
function intersect(clientList: string[] | undefined, sourceList: string[]): string[] {
  if (!Array.isArray(clientList)) return [];
  const allowed = new Set(sourceList);
  return clientList.filter(item => allowed.has(item));
}

export async function POST(req: NextRequest) {
  try {
    const { id, verifiedAttributes, specialNote } = await req.json() as {
      id?: string; verifiedAttributes?: VerifiedAttributes; specialNote?: string | null;
    };

    if (!id || !verifiedAttributes) {
      return NextResponse.json({ error: 'Submission id and verified attributes are required.' }, { status: 400 });
    }

    const { data: submission, error: fetchError } = await supabase
      .from('golden_goose_submissions')
      .select('site_analysis')
      .eq('id', id)
      .single<{ site_analysis: SiteAnalysis | null }>();

    if (fetchError || !submission?.site_analysis) {
      return NextResponse.json({ error: 'We couldn\'t find that submission\'s website analysis.' }, { status: 404 });
    }

    const source = submission.site_analysis;
    const safeVerifiedAttributes: VerifiedAttributes = {
      companySummary: source.companySummary,
      services: intersect(verifiedAttributes.services, source.services),
      industries: intersect(verifiedAttributes.industries, source.industries),
      customerTypes: intersect(verifiedAttributes.customerTypes, source.customerTypes),
      specialties: intersect(verifiedAttributes.specialties, source.specialties),
      residentialCommercial: RES_COM_VALUES.has(verifiedAttributes.residentialCommercial)
        ? verifiedAttributes.residentialCommercial
        : source.residentialCommercial,
    };

    const { error } = await supabase
      .from('golden_goose_submissions')
      .update({
        verified_attributes: safeVerifiedAttributes,
        special_note: specialNote?.trim().slice(0, SPECIAL_NOTE_MAX_LENGTH) || null,
        status: 'verified',
      })
      .eq('id', id);

    if (error) {
      console.error('GOLDEN_GOOSE_VERIFY_FAIL:', JSON.stringify(error));
      return NextResponse.json({ error: 'Something went wrong saving that. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('GOLDEN_GOOSE_VERIFY_FAIL:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Something went wrong on our end. Please try again.' }, { status: 500 });
  }
}
