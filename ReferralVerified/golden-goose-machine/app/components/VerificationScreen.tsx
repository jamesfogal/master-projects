"use client";
import { useState } from 'react';
import styles from '../golden-goose.module.css';
import { Field, TextArea, PrimaryButton, ErrorBanner } from './shared';
import type { SiteAnalysis, VerifiedAttributes } from '@/lib/goldenGoose/types';

interface Props {
  siteAnalysis: SiteAnalysis;
  onSubmit: (verified: VerifiedAttributes, specialNote: string) => void;
  submitting: boolean;
  error?: string | null;
}

function toggle(set: Set<string>, item: string): Set<string> {
  const next = new Set(set);
  next.has(item) ? next.delete(item) : next.add(item);
  return next;
}

function CheckItem({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      className={`${styles.checkItem} ${checked ? styles.checkItemActive : ''}`}
    >
      <span className={styles.checkDot}>✓</span>
      <span>{label}</span>
    </button>
  );
}

function CategoryBlock({ title, items, checked, setChecked }: {
  title: string;
  items: string[];
  checked: Set<string>;
  setChecked: (set: Set<string>) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className={styles.categoryBlock}>
      <div className={styles.categoryHeader}>
        <div className={styles.categoryTitle}>{title}</div>
        <div className={styles.categoryCount}>{checked.size} of {items.length} included</div>
      </div>
      <div className={styles.selectionGrid}>
        {items.map(item => (
          <CheckItem key={item} label={item} checked={checked.has(item)} onClick={() => setChecked(toggle(checked, item))} />
        ))}
      </div>
    </section>
  );
}

export default function VerificationScreen({ siteAnalysis, onSubmit, submitting, error }: Props) {
  const [services, setServices] = useState(new Set(siteAnalysis.services));
  const [industries, setIndustries] = useState(new Set(siteAnalysis.industries));
  const [customerTypes, setCustomerTypes] = useState(new Set(siteAnalysis.customerTypes));
  const [specialties, setSpecialties] = useState(new Set(siteAnalysis.specialties));
  const [resCom, setResCom] = useState(siteAnalysis.residentialCommercial);
  const [specialNote, setSpecialNote] = useState('');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({
      companySummary: siteAnalysis.companySummary,
      services: [...services],
      industries: [...industries],
      customerTypes: [...customerTypes],
      specialties: [...specialties],
      residentialCommercial: resCom,
    }, specialNote);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.verificationCard}>
      {error && <ErrorBanner message={error} />}

      <div className={styles.verificationHeader}>
        <div className={styles.summaryIcon}>✦</div>
        <div>
          <h2 className={styles.summaryTitle}>Does this sound like your business?</h2>
          <p className={styles.summaryCopy}>Everything is included to start. Tap any item that should not influence your Golden Goose recommendations.</p>
        </div>
      </div>

      <div className={styles.summaryCallout}>{siteAnalysis.companySummary}</div>

      <div className={styles.segmentBlock}>
        <span className={styles.controlLabel}>Customers served</span>
        <div className={styles.segmentControl}>
          {(['residential', 'commercial', 'both'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setResCom(option)}
              className={`${styles.segmentButton} ${resCom === option ? styles.segmentButtonActive : ''}`}
              aria-pressed={resCom === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <CategoryBlock title="Services" items={siteAnalysis.services} checked={services} setChecked={setServices} />
      <CategoryBlock title="Industries served" items={siteAnalysis.industries} checked={industries} setChecked={setIndustries} />
      <CategoryBlock title="Customer types" items={siteAnalysis.customerTypes} checked={customerTypes} setChecked={setCustomerTypes} />
      <CategoryBlock title="Specialties" items={siteAnalysis.specialties} checked={specialties} setChecked={setSpecialties} />

      <div className={styles.optionalBlock}>
        <Field label="Where are you especially successful?" hint="Optional">
          <TextArea
            value={specialNote}
            onChange={event => setSpecialNote(event.target.value)}
            placeholder="Add a customer type, industry, specialty, or kind of project where you consistently shine."
          />
        </Field>
      </div>

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? 'Building your report…' : 'Build My Golden Goose Report'}
      </PrimaryButton>
    </form>
  );
}
