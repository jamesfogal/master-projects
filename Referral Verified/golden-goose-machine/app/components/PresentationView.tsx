"use client";
import { useState } from 'react';
import styles from '../golden-goose.module.css';
import { Field, TextInput, PrimaryButton, ErrorBanner } from './shared';

interface Props {
  submissionId: string;
  initialText?: string | null;
  initialSeconds?: number | null;
}

type Stage = 'ask' | 'seconds' | 'loading' | 'done';

export default function PresentationView({ submissionId, initialText, initialSeconds }: Props) {
  const [stage, setStage] = useState<Stage>(initialText ? 'done' : 'ask');
  const [seconds, setSeconds] = useState(initialSeconds ? String(initialSeconds) : '45');
  const [text, setText] = useState(initialText ?? '');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    const secondsNum = Number(seconds);
    if (!secondsNum || secondsNum <= 0) return;
    setStage('loading');
    setError(null);
    try {
      const res = await fetch('/api/golden-goose/presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, seconds: secondsNum }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong.');
        setStage('seconds');
        return;
      }
      setText(data.text);
      setStage('done');
    } catch {
      setError('Something went wrong. Please try again.');
      setStage('seconds');
    }
  }

  async function copyPresentation() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (stage === 'ask') {
    return (
      <section className={styles.presentationCard}>
        <div className={styles.presentationKicker}>Put the report into words</div>
        <h2 className={styles.presentationTitle}>Walk into your next networking meeting ready.</h2>
        <p className={styles.presentationCopy}>We can turn your strongest Golden Geese into a natural presentation sized to the exact time you have.</p>
        <PrimaryButton onClick={() => setStage('seconds')}>Create My Presentation</PrimaryButton>
      </section>
    );
  }

  if (stage === 'seconds' || stage === 'loading') {
    return (
      <form onSubmit={generate} className={styles.presentationCard}>
        <div className={styles.presentationKicker}>Tailored to the room</div>
        <h2 className={styles.presentationTitle}>How long is your speaking window?</h2>
        <p className={styles.presentationCopy}>We’ll shape the message to fit without rushing the important part.</p>
        {error && <ErrorBanner message={error} />}
        <Field label="Presentation length" hint="Seconds">
          <TextInput type="number" min={10} value={seconds} onChange={event => setSeconds(event.target.value)} />
        </Field>
        <PrimaryButton type="submit" disabled={stage === 'loading'}>
          {stage === 'loading' ? 'Writing your presentation…' : 'Generate Presentation'}
        </PrimaryButton>
      </form>
    );
  }

  return (
    <section className={styles.presentationCard}>
      <div className={styles.scriptHeader}>
        <div>
          <div className={styles.presentationKicker}>Your networking presentation</div>
          <h2 className={styles.presentationTitle}>Ready when you are.</h2>
        </div>
        <button type="button" className={styles.copyButton} onClick={copyPresentation}>
          {copied ? 'Copied ✓' : 'Copy presentation'}
        </button>
      </div>
      <p className={styles.scriptText}>{text}</p>
    </section>
  );
}
