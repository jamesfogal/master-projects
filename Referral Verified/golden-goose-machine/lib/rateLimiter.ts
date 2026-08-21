import { supabase } from '@/lib/supabase';

const GOLDEN_GOOSE_IP_MAX_PER_DAY = 5;

export async function checkGoldenGooseRateLimit(ip: string): Promise<{ limited: boolean; reason?: 'limit' | 'error' }> {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('golden_goose_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', yesterday);

    if (error) {
      console.error('GOLDEN_GOOSE_RATE_LIMIT_SUPABASE_ERROR:', JSON.stringify(error));
      return { limited: true, reason: 'error' };
    }

    return { limited: !!count && count >= GOLDEN_GOOSE_IP_MAX_PER_DAY, reason: 'limit' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('GOLDEN_GOOSE_RATE_LIMIT_FAIL:', msg);
    return { limited: true, reason: 'error' };
  }
}
