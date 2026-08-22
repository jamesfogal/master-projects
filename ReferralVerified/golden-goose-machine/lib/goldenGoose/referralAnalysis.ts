import type { GoldenGooseRow, ReferralAnalysisResult } from './types';

// Spec requirement: "These calculations must be performed by application
// code, not AI reasoning." This file is the only place referral counts get
// computed — never ask the model to count or sum anything itself.

export class ReferralAnalysisShapeError extends Error {}

// Guards against a malformed model response silently producing wrong math.
// Full report must be exactly 20 rows x 5 names = 100 total referrals.
export function assertFullReportShape(report: GoldenGooseRow[]): void {
  if (report.length !== 20) {
    throw new ReferralAnalysisShapeError(`Expected 20 Golden Geese, got ${report.length}`);
  }
  report.forEach((row, i) => {
    if (row.topFiveToMeet.length !== 5) {
      throw new ReferralAnalysisShapeError(
        `Row ${i + 1} ("${row.name}") has ${row.topFiveToMeet.length} referrals, expected exactly 5`
      );
    }
  });
}

// Groups referrals case/whitespace-insensitively (so "CPA" and "cpa " count
// as the same profession) while displaying the most common original casing.
export function computeReferralAnalysis(report: GoldenGooseRow[]): ReferralAnalysisResult {
  assertFullReportShape(report);

  const allReferrals = report.flatMap(row => row.topFiveToMeet);
  const totalReferrals = allReferrals.length;
  if (totalReferrals !== 100) {
    throw new ReferralAnalysisShapeError(`Expected 100 total referrals, got ${totalReferrals}`);
  }

  const countsByKey = new Map<string, { display: string; count: number }>();
  for (const raw of allReferrals) {
    const display = raw.trim();
    const key = display.toLowerCase();
    const existing = countsByKey.get(key);
    if (existing) {
      existing.count++;
    } else {
      countsByKey.set(key, { display, count: 1 });
    }
  }

  const frequencies = [...countsByKey.values()]
    .sort((a, b) => b.count - a.count || a.display.localeCompare(b.display))
    .map(({ display, count }) => ({ profession: display, count }));

  return { totalReferrals, frequencies };
}
