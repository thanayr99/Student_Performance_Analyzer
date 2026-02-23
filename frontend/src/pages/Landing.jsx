import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <p className="landing-kicker">Student Performance Analytics</p>
        <h1>Predictive Academic Dashboard</h1>
        <p>
          Track student outcomes, identify risk early, and manage classroom performance through an analytics-first
          workflow.
        </p>
        <div className="landing-actions">
          <Link className="primary-btn landing-btn" to="/login">
            Open Login
          </Link>
          <a
            className="ghost-btn landing-btn"
            href="https://github.com/thanayr99/Student_Performance_Analyzer"
            target="_blank"
            rel="noreferrer"
          >
            View Repository
          </a>
        </div>
      </div>
    </div>
  );
}
