import styles from '../golden-goose.module.css';

export function GooseMark() {
  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path d="M46.5 13.5c-6.8 1.3-10.6 6.2-10.6 13.3v5.5c0 3.3-1.8 5.4-5.5 6.5-7.3 2.1-13.1 7-16.4 14.2 8.9 3.9 19.5 4 28.5.2 6.8-2.8 10.9-8.6 10.9-15.4 0-4.8-1.7-8.9-5.1-12.3 3.8.4 7-.7 9.7-3.4-4.3-1.5-7.2-4.4-8.8-8.7-.9-.1-1.8-.1-2.7.1Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M36.1 32.5c4.8 2 8.2 5.6 10.1 10.8M14 53c9.7-1.4 17.7-5.8 23.8-13.2M48 19.5h.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="m58 22.1 6 2.5-6.5 1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Kept as a compatibility component because both pages already render it.
// Motion and reduced-motion behavior now live in the scoped CSS module.
export function MotionStyles() {
  return null;
}

export function Field({ label, hint, children, className = '' }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.fieldLabel}>
        <span>{label}</span>
        {hint && <span className={styles.fieldHint}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${styles.input} ${props.className ?? ''}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${styles.textarea} ${props.className ?? ''}`} />;
}

export function PrimaryButton({ children, disabled, onClick, type = 'button' }: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles.primaryButton}>
      {children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return <div role="alert" className={styles.errorBanner}>{message}</div>;
}

export function LoadingState({ text, detail = 'We are matching your business with the people most likely to open the right doors.' }: {
  text: string;
  detail?: string;
}) {
  return (
    <div className={styles.loadingCard} aria-live="polite" aria-busy="true">
      <div className={styles.loadingInner}>
        <div className={styles.loaderMark}><GooseMark /></div>
        <h2 className={styles.loadingTitle}>{text}</h2>
        <p className={styles.loadingCopy}>{detail}</p>
      </div>
    </div>
  );
}

const stepLabels = ['Tell us', 'Verify', 'Discover'];

export function PageHeader({ step = 1 }: { step?: 1 | 2 | 3 }) {
  const descriptions = {
    1: 'Tell us what makes your business valuable. We’ll turn that into a practical map of the people who can send your best opportunities.',
    2: 'We read your website. You bring the real-world judgment. Together, we’ll sharpen the picture before building your report.',
    3: 'Your clearest path to stronger referrals—ranked, explained, and ready to use in your next conversation.',
  } as const;

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <a href="https://referralverified.com" className={styles.wordmark}>
          <span className={styles.wordmarkDot} />
          <span>Referral Verified</span>
        </a>
        <span className={styles.productBadge}>Golden Goose Machine</span>
      </div>

      <div className={styles.headerMain}>
        <div>
          <div className={styles.eyebrow}>Referral intelligence</div>
          <h1 className={styles.title}>The Golden Goose Machine</h1>
          <p className={styles.subtitle}>{descriptions[step]}</p>
        </div>
        <div className={styles.gooseSeal}><GooseMark /></div>
      </div>

      <div className={styles.stepper} aria-label={`Step ${step} of 3`}>
        {stepLabels.map((label, index) => {
          const number = index + 1;
          const stateClass = number < step ? styles.stepDone : number === step ? styles.stepActive : '';
          return (
            <div key={label} className={`${styles.step} ${stateClass}`}>
              <span className={styles.stepNumber}>{number < step ? '✓' : number}</span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </header>
  );
}

