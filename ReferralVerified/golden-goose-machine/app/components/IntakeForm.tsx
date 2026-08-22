"use client";
import { useState } from 'react';
import styles from '../golden-goose.module.css';
import { Field, TextInput, TextArea, PrimaryButton, ErrorBanner } from './shared';
import type { RoleClarificationTurn } from '@/lib/goldenGoose/types';

export interface IntakeFields {
  name: string;
  companyName: string;
  companyWebsite: string;
  email: string;
  phone: string;
}

interface Props {
  onSubmit: (fields: IntakeFields, roleDescription: string, roleClarification: RoleClarificationTurn[]) => void;
  submitting: boolean;
}

const MAX_CLARIFICATION_ROUNDS = 3;

export default function IntakeForm({ onSubmit, submitting }: Props) {
  const [fields, setFields] = useState<IntakeFields>({ name: '', companyName: '', companyWebsite: '', email: '', phone: '' });
  const [roleDescription, setRoleDescription] = useState('');
  const [turns, setTurns] = useState<RoleClarificationTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldsComplete = Object.values(fields).every(value => value.trim().length > 0) && roleDescription.trim().length > 0;

  function finalize(allTurns: RoleClarificationTurn[]) {
    const finalDescription = [roleDescription, ...allTurns.map(turn => turn.answer)].join(' ').trim();
    onSubmit(fields, finalDescription, allTurns);
  }

  async function checkRole(priorTurns: RoleClarificationTurn[]) {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/golden-goose/clarify-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: fields.companyName, roleDescription, priorTurns }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
        setChecking(false);
        return;
      }
      if (data.sufficient || priorTurns.length >= MAX_CLARIFICATION_ROUNDS) {
        finalize(priorTurns);
        return;
      }
      setCurrentQuestion(data.followUpQuestion);
      setChecking(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setChecking(false);
    }
  }

  function handleInitialSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!fieldsComplete || checking || submitting) return;
    checkRole([]);
  }

  function handleClarificationSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentAnswer.trim() || checking || submitting) return;
    const nextTurns = [...turns, { question: currentQuestion!, answer: currentAnswer.trim() }];
    setTurns(nextTurns);
    setCurrentAnswer('');
    setCurrentQuestion(null);
    checkRole(nextTurns);
  }

  if (currentQuestion) {
    return (
      <form onSubmit={handleClarificationSubmit} className={styles.clarification}>
        <h2 className={styles.cardHeading}>One quick detail</h2>
        <p className={styles.cardCopy}>Specific answers create much stronger referral matches.</p>
        {error && <ErrorBanner message={error} />}
        <div className={styles.questionCard}>
          <div className={styles.questionLabel}>Help us sharpen your profile</div>
          <div className={styles.questionText}>{currentQuestion}</div>
        </div>
        <Field label="Your answer">
          <TextArea autoFocus value={currentAnswer} onChange={event => setCurrentAnswer(event.target.value)} />
        </Field>
        <PrimaryButton type="submit" disabled={checking || submitting || !currentAnswer.trim()}>
          {checking ? 'Checking your answer…' : 'Continue'}
        </PrimaryButton>
      </form>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit}>
      <h2 className={styles.cardHeading}>Let’s find your best referral partners</h2>
      <p className={styles.cardCopy}>A few thoughtful details are all we need to build your first Golden Goose shortlist.</p>
      {error && <ErrorBanner message={error} />}

      <section className={styles.formSection}>
        <div className={styles.sectionLabel}><span>1</span>About your business</div>
        <div className={styles.fieldGrid}>
          <Field label="Your name">
            <TextInput autoComplete="name" value={fields.name} onChange={event => setFields({ ...fields, name: event.target.value })} required />
          </Field>
          <Field label="Company name">
            <TextInput autoComplete="organization" value={fields.companyName} onChange={event => setFields({ ...fields, companyName: event.target.value })} required />
          </Field>
          <Field label="Company website" className={styles.fieldFull}>
            <TextInput inputMode="url" autoComplete="url" value={fields.companyWebsite} onChange={event => setFields({ ...fields, companyWebsite: event.target.value })} placeholder="yourcompany.com" required />
          </Field>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionLabel}><span>2</span>How to reach you</div>
        <div className={styles.fieldGrid}>
          <Field label="Email">
            <TextInput type="email" autoComplete="email" value={fields.email} onChange={event => setFields({ ...fields, email: event.target.value })} required />
          </Field>
          <Field label="Cell phone" hint="Text capable">
            <TextInput type="tel" autoComplete="tel" value={fields.phone} onChange={event => setFields({ ...fields, phone: event.target.value })} required />
          </Field>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionLabel}><span>3</span>What you actually do</div>
        <Field label="Describe your day-to-day responsibilities" hint="Not just your title">
          <TextArea value={roleDescription} onChange={event => setRoleDescription(event.target.value)} placeholder="For example: I build relationships with commercial property managers and help them design security systems…" required />
        </Field>
      </section>

      <PrimaryButton type="submit" disabled={!fieldsComplete || checking || submitting}>
        {checking ? 'Understanding your role…' : 'Find My Golden Geese'}
      </PrimaryButton>
    </form>
  );
}
