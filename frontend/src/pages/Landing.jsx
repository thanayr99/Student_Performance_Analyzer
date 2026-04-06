import { Link } from "react-router-dom";

const features = [
  {
    title: "Performance Tracking",
    description: "Real-time monitoring of GPA, subject trends, and cohort quality with faster executive visibility."
  },
  {
    title: "Risk Detection",
    description: "Spot students who need support earlier through attendance, marks, and predictive analysis."
  },
  {
    title: "Predictive Analytics",
    description: "Forecast outcomes and surface intervention priorities before final assessments arrive."
  },
  {
    title: "Attendance Monitoring",
    description: "Tie attendance behavior directly into academic standing and recommendation quality."
  },
  {
    title: "Student Insights",
    description: "Deliver role-based experiences for administrators and students with cleaner information design."
  },
  {
    title: "Actionable Recommendations",
    description: "Translate raw data into practical next steps instead of static reports."
  }
];

export default function Landing() {
  return (
    <div className="page-shell">
      <div className="landing-page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-badge">SP</div>
            <div className="brand-copy">
              <strong>Student Performance Analyzer</strong>
              <span>Institutional View Edition</span>
            </div>
          </div>

          <nav className="topbar-nav">
            <a className="active" href="#home">
              Home
            </a>
            <a href="#product">Product</a>
            <a href="#features">Features</a>
          </nav>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" aria-label="Alerts">
              A
            </button>
            <button className="icon-btn" type="button" aria-label="Settings">
              G
            </button>
            <Link className="pill-btn" to="/login">
              Profile
            </Link>
          </div>
        </header>

        <section className="landing-grid" id="home">
          <div className="hero-panel">
            <span className="section-chip">The Digital Curator</span>
            <h1 className="hero-title">
              Analyze Academic Performance <em>Like Never Before</em>
            </h1>
            <p className="hero-copy">
              Move beyond spreadsheets and scattered reports. Student Performance Analyzer creates a premium command
              center for administrators and students with predictive risk detection, attendance intelligence, and
              academic insights that are easier to act on.
            </p>

            <div className="hero-actions">
              <Link className="primary-btn" to="/login">
                Get Started
              </Link>
              <a className="ghost-btn" href="#features">
                Watch Demo
              </a>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <strong>12.4%</strong>
                <span>Average performance growth visualized in a cleaner decision view.</span>
              </article>
              <article className="stat-card">
                <strong>Role-Based</strong>
                <span>Separate dashboards for institutional admin workflows and student progress.</span>
              </article>
              <article className="stat-card">
                <strong>Live</strong>
                <span>Connected directly to the real backend and academic dataset already running locally.</span>
              </article>
            </div>
          </div>

          <aside className="preview-panel" id="product">
            <div className="preview-image">
              <img
                alt="Product dashboard preview"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_X9_B-iRZY3hmuGxgMUFlRMpLaO81NdmkhuvOwex_xrIvDDkVwQm7oukmkyTdfOEwH8_SBk2rB9bZsBEzCRGgf6s933jazpsVevj_m9hoZeDPtI5KCbTD8juyR1jKHEi24X-5P2G0hpH_3m4e0g1V0AVLcBtMn6MZ2m3Ah8rSY2mXAYHE-_u0OHxrUqKq3HmekFbLtNTku-G3LO5N971Wp__Epe379KPrdbuxYHiaER5feHd6IptYHNeyZ8X5REGeajzAiS74WZI"
              />
            </div>

            <div className="floating-metric">
              <div className="card-inline">
                <div className="feature-icon">T</div>
                <div>
                  <div className="eyebrow">Avg Growth</div>
                  <strong>+12.4%</strong>
                </div>
              </div>
              <div style={{ marginTop: "18px" }} className="progress-bar">
                <div className="progress-fill" style={{ width: "75%" }} />
              </div>
            </div>
          </aside>
        </section>
      </div>

      <section className="section-block" style={{ background: "var(--surface-alt)" }}>
        <div className="section-heading">
          <h2>From Data Points to Decisions</h2>
          <p>
            Treat academic performance as an operating system, not a spreadsheet. This platform gives institutional
            leaders and learners a more curated view of GPA, attendance, predictive scoring, and intervention planning.
          </p>
        </div>
      </section>

      <section className="section-block" id="features">
        <div className="section-heading">
          <h2>Powerful Features for Modern Education</h2>
          <p>
            The interface is designed to feel premium and professional while staying practical for everyday academic
            workflows.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{index + 1}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" style={{ background: "var(--surface-alt)" }}>
        <div className="roles-grid">
          <article className="role-card">
            <h3>For Administrators</h3>
            <p>
              Manage students, subjects, registrations, risk reports, and institutional analytics through a refined
              executive control layer.
            </p>
            <ul className="role-list">
              <li>Campus-wide analytics</li>
              <li>Risk and intervention monitoring</li>
              <li>Registration and academic operations</li>
            </ul>
          </article>

          <article className="role-card">
            <h3>For Students</h3>
            <p>
              Give students a focused dashboard for progress, attendance, marks history, and personalized academic
              recommendations.
            </p>
            <ul className="role-list">
              <li>Personal progress dashboard</li>
              <li>Marks history and trend visibility</li>
              <li>AI-based recommendations</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="cta-banner">
          <h2>Ready to elevate academic success?</h2>
          <p>
            Use the existing backend and data model with a more polished frontend experience for institutional and
            student-facing workflows.
          </p>
          <Link className="primary-btn" to="/register">
            Get Started Today
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="brand">
                <div className="brand-badge">SP</div>
                <div className="brand-copy">
                  <strong>Student Performance Analyzer</strong>
                  <span>Premier Academic Platform</span>
                </div>
              </div>
              <p className="footer-note" style={{ marginTop: "14px" }}>
                The premium choice for academic institutions focused on data-driven student outcomes.
              </p>
            </div>

            <div className="footer-links">
              <strong>Platform</strong>
              <a href="#product">Dashboard</a>
              <a href="#features">Analytics</a>
              <a href="#features">Reports</a>
            </div>

            <div className="footer-links">
              <strong>Company</strong>
              <a href="#home">About Us</a>
              <a href="#home">Privacy Policy</a>
              <a href="#home">Terms</a>
            </div>

            <div className="footer-links">
              <strong>Support</strong>
              <Link to="/login">Help Center</Link>
              <Link to="/register">Registration</Link>
              <Link to="/login">Contact</Link>
            </div>
          </div>

          <p className="footer-note">Copyright 2024 Student Performance Analyzer. Institutional View Edition.</p>
        </div>
      </footer>
    </div>
  );
}
