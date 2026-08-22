"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '../../golden-goose.module.css';
import { PageHeader, LoadingState, ErrorBanner, MotionStyles } from '../../components/shared';
import GoldenGeeseTable from '../../components/GoldenGeeseTable';
import ReferralAnalysisView from '../../components/ReferralAnalysis';
import PresentationView from '../../components/PresentationView';
import type { GoldenGooseRow, ReferralAnalysisResult } from '@/lib/goldenGoose/types';

interface ReportData {
  id: string;
  name: string;
  company_name: string;
  role_description: string;
  top5_report: GoldenGooseRow[] | null;
  full_report: GoldenGooseRow[] | null;
  referral_analysis: ReferralAnalysisResult | null;
  presentation_seconds: number | null;
  presentation_text: string | null;
  status: string;
}

export default function GoldenGooseReportPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingTop5, setGeneratingTop5] = useState(false);
  const [generatingFull, setGeneratingFull] = useState(false);
  const [runAll, setRunAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateReport(mode: 'top5' | 'full20') {
    mode === 'top5' ? setGeneratingTop5(true) : setGeneratingFull(true);
    setError(null);
    try {
      const res = await fetch('/api/golden-goose/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, mode }),
      });
      const result = await res.json();
      if (!res.ok || result.error) { setError(result.error || 'Something went wrong.'); return; }
      setData(previous => previous ? {
        ...previous,
        ...(mode === 'top5'
          ? { top5_report: result.rows }
          : { full_report: result.rows, referral_analysis: result.referralAnalysis }),
      } : previous);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      mode === 'top5' ? setGeneratingTop5(false) : setGeneratingFull(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/golden-goose/report?id=${id}`);
        const json = await res.json();
        if (!res.ok || json.error) {
          setError(json.error || 'Report not found.');
          setLoading(false);
          return;
        }
        setData(json);
        setLoading(false);
        if (!json.top5_report) await generateReport('top5');
      } catch {
        setError('Something went wrong loading your report.');
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <main className={styles.page}>
      <MotionStyles />
      <div className={styles.container}>
        <PageHeader step={3} />
        <LoadingState text="Opening your report…" detail="Your ranked referral strategy is almost ready." />
      </div>
    </main>
  );

  return (
    <main className={styles.page}>
      <MotionStyles />
      <div className={styles.container}>
        <PageHeader step={3} />
        {error && <ErrorBanner message={error} />}

        {data && (
          <>
            <section className={styles.reportHeader}>
              <div>
                <div className={styles.reportKicker}>Prepared for {data.name}</div>
                <h2 className={styles.reportName}>{data.company_name}</h2>
                <div className={styles.reportRole}>{data.role_description}</div>
              </div>
              <div className={styles.reportStamp}>GG</div>
            </section>

            {generatingTop5 && (
              <LoadingState
                text="Ranking your strongest matches…"
                detail="We’re balancing immediate opportunities with a few high-upside sleeper relationships."
              />
            )}
            {data.top5_report && <GoldenGeeseTable rows={data.top5_report} title="Your Top 5 Golden Geese" />}

            {data.top5_report && (
              <label className={styles.runAllCard}>
                <span>
                  <span className={styles.runAllTitle}>Reveal the complete opportunity map</span>
                  <span className={styles.runAllCopy}>Expand from your top five to all 20 Golden Geese and see where referral demand repeats.</span>
                </span>
                <input
                  className={styles.hiddenCheckbox}
                  type="checkbox"
                  checked={runAll}
                  disabled={generatingFull}
                  onChange={event => {
                    setRunAll(event.target.checked);
                    if (event.target.checked && !data.full_report) generateReport('full20');
                  }}
                />
                <span className={`${styles.toggle} ${runAll ? styles.toggleActive : ''}`} aria-hidden="true" />
              </label>
            )}

            {runAll && generatingFull && (
              <LoadingState
                text="Building the complete referral map…"
                detail="This deeper pass looks for both obvious partners and overlooked high-value connections."
              />
            )}
            {runAll && data.full_report && <GoldenGeeseTable rows={data.full_report} title="Your Complete Golden Goose Report" />}
            {runAll && data.referral_analysis && <ReferralAnalysisView analysis={data.referral_analysis} />}

            {data.top5_report && (
              <PresentationView
                submissionId={id}
                initialText={data.presentation_text}
                initialSeconds={data.presentation_seconds}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
