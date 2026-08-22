"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './golden-goose.module.css';
import { PageHeader, LoadingState, ErrorBanner, MotionStyles } from './components/shared';
import IntakeForm, { type IntakeFields } from './components/IntakeForm';
import VerificationScreen from './components/VerificationScreen';
import type { SiteAnalysis, VerifiedAttributes, RoleClarificationTurn } from '@/lib/goldenGoose/types';

type Step = 'intake' | 'analyzing' | 'verify' | 'saving';

export default function GoldenGoosePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intake');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleIntakeSubmit(fields: IntakeFields, roleDescription: string, roleClarification: RoleClarificationTurn[]) {
    setStep('analyzing');
    setError(null);
    try {
      const res = await fetch('/api/golden-goose/analyze-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, roleDescription, roleClarification }),
      });
      const data = await res.json();
      if (data.limit) { setError(data.message); setStep('intake'); return; }
      if (!res.ok || data.error) { setError(data.error || 'Something went wrong.'); setStep('intake'); return; }
      setSubmissionId(data.id);
      setSiteAnalysis(data.siteAnalysis);
      setStep('verify');
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('intake');
    }
  }

  async function handleVerifySubmit(verified: VerifiedAttributes, specialNote: string) {
    if (!submissionId) return;
    setStep('saving');
    setError(null);
    try {
      const res = await fetch('/api/golden-goose/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, verifiedAttributes: verified, specialNote }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || 'Something went wrong.'); setStep('verify'); return; }
      router.push(`/report/${submissionId}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('verify');
    }
  }

  return (
    <main className={styles.page}>
      <MotionStyles />
      <div className={styles.container}>
        <PageHeader step={step === 'intake' ? 1 : 2} />

        {step === 'intake' && (
          <div className={styles.workspace}>
            <aside className={styles.introPanel}>
              <span className={styles.introLabel}>What you’ll receive</span>
              <h2 className={styles.introTitle}>A referral strategy you can actually use.</h2>
              <p className={styles.introCopy}>Not a generic list. Your recommendations are built around your services, customers, specialties, and real role in the business.</p>
              <ul className={styles.benefitList}>
                <li className={styles.benefit}><span className={styles.benefitIcon}>01</span><span>A ranked shortlist of your strongest referral partners</span></li>
                <li className={styles.benefit}><span className={styles.benefitIcon}>02</span><span>The five people each partner would most like to meet</span></li>
                <li className={styles.benefit}><span className={styles.benefitIcon}>03</span><span>An optional networking pitch tailored to your time limit</span></li>
              </ul>
            </aside>

            <section className={styles.formCard}>
              {error && <ErrorBanner message={error} />}
              <IntakeForm onSubmit={handleIntakeSubmit} submitting={false} />
            </section>
          </div>
        )}

        {step === 'analyzing' && (
          <LoadingState
            text="Reading between the lines…"
            detail="We’re studying your website and translating what you do into a useful referral profile."
          />
        )}

        {(step === 'verify' || step === 'saving') && siteAnalysis && (
          <VerificationScreen siteAnalysis={siteAnalysis} onSubmit={handleVerifySubmit} submitting={step === 'saving'} error={error} />
        )}
      </div>
    </main>
  );
}

