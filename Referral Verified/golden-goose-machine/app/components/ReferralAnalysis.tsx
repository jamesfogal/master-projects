import type { CSSProperties } from 'react';
import styles from '../golden-goose.module.css';
import type { ReferralAnalysisResult } from '@/lib/goldenGoose/types';

export default function ReferralAnalysis({ analysis }: { analysis: ReferralAnalysisResult }) {
  const max = analysis.frequencies[0]?.count ?? 1;

  return (
    <section className={styles.analysisSection}>
      <div className={styles.resultsHeadingRow}>
        <div>
          <div className={styles.eyebrow}>Where opportunity concentrates</div>
          <h2 className={styles.resultsTitle}>Referral Analysis</h2>
          <p className={styles.resultsCopy}>Repeated professions reveal the introductions with the greatest leverage across your network.</p>
        </div>
      </div>

      <div className={styles.analysisCard}>
        <div className={styles.analysisSummary}>
          <div className={styles.analysisEquation}>20 Golden Geese × 5 desired introductions</div>
          <div className={styles.analysisTotal}>{analysis.totalReferrals} referrals</div>
        </div>

        <div className={styles.analysisRows}>
          {analysis.frequencies.map(({ profession, count }, index) => (
            <div
              key={profession}
              className={styles.analysisRow}
              style={{ '--gg-delay': `${Math.min(index * 25, 350)}ms` } as CSSProperties}
            >
              <div className={styles.analysisProfession} title={profession}>{profession}</div>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <div className={styles.analysisCount}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
