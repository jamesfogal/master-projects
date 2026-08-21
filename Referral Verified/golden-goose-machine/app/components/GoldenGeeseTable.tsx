import type { CSSProperties } from 'react';
import styles from '../golden-goose.module.css';
import type { GoldenGooseRow } from '@/lib/goldenGoose/types';

export default function GoldenGeeseTable({ rows, title }: { rows: GoldenGooseRow[]; title: string }) {
  const isShortlist = rows.length <= 5;

  return (
    <section className={styles.resultsSection}>
      <div className={styles.resultsHeadingRow}>
        <div>
          <div className={styles.eyebrow}>{isShortlist ? 'Your strongest opportunities' : 'The complete referral map'}</div>
          <h2 className={styles.resultsTitle}>{title}</h2>
          <p className={styles.resultsCopy}>
            Each recommendation includes why the relationship matters and the introductions that make that partner valuable.
          </p>
        </div>
        <div className={styles.resultCount}>{rows.length} ranked matches</div>
      </div>

      <div className={styles.gooseList}>
        {rows.map((row, index) => (
          <article
            key={`${row.name}-${index}`}
            className={styles.gooseCard}
            style={{ '--gg-delay': `${Math.min(index * 35, 420)}ms` } as CSSProperties}
          >
            <div className={styles.gooseCardLead}>
              <span className={styles.rankBadge}>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <div className={styles.gooseKicker}>Golden Goose</div>
                <div className={styles.gooseName}>{row.name}</div>
              </div>
            </div>

            <div className={styles.gooseBody}>
              <div>
                <span className={styles.gooseSectionLabel}>Why this relationship matters</span>
                <p className={styles.gooseDescription}>{row.whatTheyCanDo}</p>
              </div>
              <div>
                <span className={styles.gooseSectionLabel}>Their ideal introductions</span>
                <div className={styles.partnerTags}>
                  {row.topFiveToMeet.map(partner => <span key={partner} className={styles.partnerTag}>{partner}</span>)}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
