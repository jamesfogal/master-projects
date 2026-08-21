const applications = [
  {
    id: "golden-goose-machine",
    number: "01",
    name: "Golden Goose Machine",
    status: "Preserved app",
    path: "goldengoose.referralverified.com",
    description:
      "Find and verify warm referral paths without turning the front door into a heavy marketing page.",
    points: [
      "Referral path discovery",
      "Verification workflow",
      "Independent deployment",
    ],
  },
  {
    id: "commercial-transition-sphere",
    number: "02",
    name: "Commercial Transition Sphere",
    status: "Preserved app",
    path: "transition.referralverified.com",
    description:
      "Track early commercial signals, score project timelines, and route the right opportunities to the right members.",
    points: [
      "Commercial signal intake",
      "Address-level evidence",
      "Contractor routing",
    ],
  },
] as const;

const rules = [
  {
    title: "No images above the fold",
    detail:
      "The first screen stays CSS-first so the page opens fast and never waits on a hero asset.",
  },
  {
    title: "WebP only if images are needed",
    detail:
      "Raster images belong below the fold only, and only after they have been reduced to the lightest justified format.",
  },
  {
    title: "Noindex until launch",
    detail:
      "Unlaunched work stays out of search until the front door and app wiring are genuinely ready.",
  },
  {
    title: "Apps stay independent",
    detail:
      "Referral Verified is the lean shell. Golden Goose Machine and Commercial Transition Sphere remain separate projects.",
  },
] as const;

const roadmap = [
  {
    step: "Now",
    title: "Finish the front door",
    detail:
      "Keep Referral Verified lean, intentional, and fast enough to clear the PingClose standard.",
  },
  {
    step: "Next",
    title: "Wire the subdomains",
    detail:
      "Connect Golden Goose Machine and Commercial Transition Sphere to their own production routes under Referral Verified.",
  },
  {
    step: "Then",
    title: "Return to the superAgent",
    detail:
      "Upgrade the above-fold caching pipeline so it can choose the right path for standard sites and WordPress sites.",
  },
] as const;

export default function Home() {
  return (
    <main className="shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Referral Verified home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core" />
            <span className="brand-mark-beam brand-mark-beam-a" />
            <span className="brand-mark-beam brand-mark-beam-b" />
            <span className="brand-mark-node brand-mark-node-a" />
            <span className="brand-mark-node brand-mark-node-b" />
            <span className="brand-mark-node brand-mark-node-c" />
          </span>
          <span className="brand-copy">
            <strong>Referral Verified</strong>
            <small>Trusted connections. Real opportunity.</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#applications">Applications</a>
          <a href="#rules">Speed rules</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            Private preview
          </p>
          <h1>One lean front door for the apps that matter.</h1>
          <p className="hero-lede">
            Referral Verified should open fast, stay mostly CSS above the fold,
            and connect Golden Goose Machine and Commercial Transition Sphere
            without carrying visual weight they do not need.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#applications">
              See the applications
            </a>
            <a className="button button-secondary" href="#rules">
              Review the speed rules
            </a>
          </div>
          <div className="hero-notes" aria-label="Launch principles">
            <span>CSS-first hero</span>
            <span>Noindex until launch</span>
            <span>Independent app deployments</span>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Referral Verified launch status">
          <div className="status-badge">Current focus</div>
          <h2>Finish Referral Verified first.</h2>
          <p>
            Get the front door stable, fast, and correctly named. Then connect
            the subdomains and swing back to the superAgent work.
          </p>
          <dl className="status-grid">
            <div>
              <dt>2</dt>
              <dd>apps preserved</dd>
            </div>
            <div>
              <dt>No</dt>
              <dd>crawl exposure</dd>
            </div>
            <div>
              <dt>CSS</dt>
              <dd>hero only</dd>
            </div>
            <div>
              <dt>Next</dt>
              <dd>subdomain wiring</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="applications" id="applications">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Applications
            </p>
            <h2>Two serious tools. One disciplined shell.</h2>
          </div>
          <p>
            Referral Verified stays light so each application can carry its own
            operational complexity without slowing the brand front door down.
          </p>
        </div>

        <div className="app-grid">
          {applications.map((application) => (
            <article className="app-card" id={application.id} key={application.id}>
              <div className="app-header">
                <span className="app-number">{application.number}</span>
                <span className="app-status">{application.status}</span>
              </div>
              <h3>{application.name}</h3>
              <p className="app-description">{application.description}</p>
              <ul className="app-points" aria-label={`${application.name} highlights`}>
                {application.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="app-path">
                <span>Planned path</span>
                <strong>{application.path}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rules" id="rules">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Speed rules
            </p>
            <h2>What this page has to obey.</h2>
          </div>
          <p>
            The PingClose standard is simple: fast first paint, no above-fold
            image drag, and no launch-page clutter pretending to be strategy.
          </p>
        </div>

        <div className="rule-grid">
          {rules.map((rule) => (
            <article className="rule-card" key={rule.title}>
              <h3>{rule.title}</h3>
              <p>{rule.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap" id="roadmap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              Roadmap
            </p>
            <h2>The order matters.</h2>
          </div>
          <p>
            Referral Verified becomes the stable home first. Then the app
            routing gets connected. Then the superAgent work comes back into the
            spotlight.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <article className="roadmap-card" key={item.title}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Referral Verified</strong>
          <p>Lean shell first. Apps next. SuperAgent after that.</p>
        </div>
        <div className="footer-meta">
          <span>referralverified.com</span>
          <span>Preview only</span>
        </div>
      </footer>
    </main>
  );
}
