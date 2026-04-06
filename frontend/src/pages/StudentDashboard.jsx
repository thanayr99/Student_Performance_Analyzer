import { useEffect, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../services/errorUtils";
import { dashboardService } from "../services/dataService";

const studentTabs = [
  { id: "dashboard", label: "Dashboard", meta: "Overview" },
  { id: "marks", label: "Marks", meta: "History" },
  { id: "attendance", label: "Attendance", meta: "Status" },
  { id: "calendar", label: "Calendar", meta: "Plan" }
];

const trendBars = [40, 55, 45, 70, 65, 85];
const trendMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function formatMetric(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return number.toFixed(digits).replace(/\.00$/, "");
}

export default function StudentDashboard() {
  const { username, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await dashboardService.getStudentDashboard(username);
        setProfile(data.profile);
        setMarks(data.marks);
        setAnalytics(data.analytics);
      } catch (err) {
        setError(extractErrorMessage(err, "Unable to load dashboard"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  const activeTab = studentTabs.find((item) => item.id === tab);
  const firstName = profile?.name?.split(" ")[0] || username || "Student";
  const riskLevel = analytics?.riskLevel || "LOW";
  const riskClass = String(riskLevel).toLowerCase();
  const profileInitials = firstName.slice(0, 2).toUpperCase();

  return (
    <DashboardShell
      brandSubtitle="Student View"
      sidebarProfile={
        <div className="sidebar-profile">
          <div className="avatar-chip">{profileInitials}</div>
          <h3>{profile?.name || username}</h3>
          <p>
            {profile?.className || "-"} - Section {profile?.section || "-"}
          </p>
          <div className="sidebar-mini-stats">
            <div className="sidebar-mini-stat">
              <span>GPA</span>
              <strong>{formatMetric(analytics?.gpa)}</strong>
            </div>
            <div className="sidebar-mini-stat">
              <span>Attendance</span>
              <strong>{formatMetric(analytics?.attendancePercentage, 0)}%</strong>
            </div>
          </div>
        </div>
      }
      navItems={studentTabs}
      activeTab={tab}
      onTabChange={setTab}
      sidebarFooter={
        <>
          <button className="sidebar-cta" type="button">
            Full Transcript
          </button>
          <button className="ghost-btn" type="button" onClick={logout}>
            Log Out
          </button>
        </>
      }
      searchPlaceholder="Search analytics..."
      profileTitle={profile?.name || username}
      profileSubtitle={`${profile?.className || "-"} - Section ${profile?.section || "-"}`}
      profileInitials={profileInitials}
      pageTitle={activeTab?.label || "Dashboard"}
      pageDescription={`Welcome back, ${firstName}. This student interface keeps the same backend functionality while presenting your performance data with a cleaner and more stable dashboard structure.`}
      pageActions={
        <>
          <span className="status-chip">Student portal</span>
          <span className={`risk-pill ${riskClass}`}>{riskLevel}</span>
        </>
      }
    >
      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <section className="content-grid">
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-8" />
          <div className="skeleton span-4" />
        </section>
      ) : null}

      {!loading && tab === "dashboard" && (
        <>
          <section className="summary-grid">
            <MetricCard
              title="Current GPA"
              badge="Stable"
              badgeClassName="metric-note success"
              value={formatMetric(analytics?.gpa)}
              note="Your current weighted GPA from the academic analytics backend."
            />
            <MetricCard
              title="Attendance"
              badge="Present"
              badgeClassName="metric-note success"
              value={`${formatMetric(analytics?.attendancePercentage, 0)}%`}
              note="Attendance percentage currently used for performance and risk analysis."
            />
            <MetricCard
              title="Predicted Final"
              badge="Forecast"
              badgeClassName="metric-note"
              value={formatMetric(analytics?.predictedScore)}
              valueClassName="metric-value-compact"
              note="AI-driven projection based on recent academic activity and attendance."
            />
            <MetricCard
              title="Academic Standing"
              badge={riskLevel}
              badgeClassName={`risk-pill ${riskClass}`}
              value={riskLevel}
              valueClassName={`metric-risk-value ${riskClass}`}
              note="Current system risk classification from the backend analytics service."
            />
          </section>

          <section className="content-grid">
            <article className="table-card span-8">
              <div className="card-head">
                <div>
                  <h3>Subject Performance</h3>
                  <p className="muted-copy">Subject averages and personal academic trend summary.</p>
                </div>
                <button className="ghost-btn" type="button">Filter Semester</button>
              </div>
              <div className="table-scroll" style={{ marginTop: "18px" }}>
                <table>
                  <thead>
                    <tr><th>Subject Name</th><th>Average Marks</th><th>Grade View</th></tr>
                  </thead>
                  <tbody>
                    {(analytics?.subjectAverages || []).length === 0 ? (
                      <tr><td colSpan="3"><div className="empty-state">No subject averages available.</div></td></tr>
                    ) : (
                      (analytics?.subjectAverages || []).map((subject) => (
                        <tr key={subject.subject}>
                          <td>
                            <div className="subject-cell">
                              <div className="subject-icon">{subject.subject.slice(0, 1).toUpperCase()}</div>
                              <div className="list-main">
                                <strong>{subject.subject}</strong>
                                <span className="list-subtext">Academic subject average</span>
                              </div>
                            </div>
                          </td>
                          <td>{formatMetric(subject.averageMarks)}</td>
                          <td><span className="grade-pill">{subject.averageMarks >= 90 ? "A" : subject.averageMarks >= 80 ? "B+" : subject.averageMarks >= 70 ? "B" : "C"}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="action-card span-4">
              <div className="card-head">
                <div>
                  <h3>Next Steps</h3>
                  <p className="muted-copy">Recommendation and quick academic guidance from the existing backend.</p>
                </div>
              </div>
              <div className="action-card highlight-card" style={{ marginTop: "18px" }}>
                <h3>Suggested Improvements</h3>
                <p style={{ marginTop: "10px" }}>{analytics?.recommendation || "No recommendation available yet. Keep engaging with your coursework."}</p>
                <button className="ghost-btn" style={{ marginTop: "18px", color: "var(--primary)" }} type="button">Access Study Guide</button>
              </div>
              <div className="advisor-card" style={{ marginTop: "18px" }}>
                <div className="advisor-avatar">ER</div>
                <div className="list-main">
                  <strong>Dr. Elena Rodriguez</strong>
                  <span className="list-subtext">Academic Advisor</span>
                </div>
              </div>
            </article>

            <article className="timeline-card span-4">
              <div className="card-head">
                <div>
                  <h3>Marks History</h3>
                  <p className="muted-copy">Recent academic activity from your existing marks endpoint.</p>
                </div>
              </div>
              <ul className="timeline-list" style={{ marginTop: "18px" }}>
                {marks.slice(0, 3).map((mark) => (
                  <li className="timeline-item" key={mark.id}>
                    <strong>{mark.subject} - {mark.examType}</strong>
                    <p className="list-subtext">Semester {mark.semester} - {mark.marks} marks - {mark.date}</p>
                  </li>
                ))}
                {marks.length === 0 ? <div className="empty-state">No marks history available yet.</div> : null}
              </ul>
            </article>

            <article className="dashboard-card gradient span-8">
              <div className="card-head">
                <div>
                  <h3>Performance Trend</h3>
                  <p className="muted-copy">A cleaner visual pulse inspired by the premium dashboard reference.</p>
                </div>
                <span className="status-chip">Last 6 periods</span>
              </div>
              <div className="chart-bars alt" style={{ marginTop: "18px" }}>
                {trendBars.map((height, index) => <span key={`${height}-${index}`} style={{ height: `${height * 2}px` }} />)}
              </div>
              <div className="chart-months">{trendMonths.map((month) => <span key={month}>{month}</span>)}</div>
            </article>
          </section>
        </>
      )}

      {!loading && tab === "marks" && (
        <section className="table-card">
          <div className="card-head">
            <div>
              <h3>Exam History</h3>
              <p className="muted-copy">All marks currently returned by the student marks endpoint.</p>
            </div>
          </div>
          <div className="table-scroll" style={{ marginTop: "18px" }}>
            <table>
              <thead>
                <tr><th>Subject</th><th>Exam Type</th><th>Semester</th><th>Marks</th><th>Date</th></tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr><td colSpan="5"><div className="empty-state">No marks recorded yet.</div></td></tr>
                ) : (
                  marks.map((mark) => (
                    <tr key={mark.id}>
                      <td>{mark.subject}</td>
                      <td>{mark.examType}</td>
                      <td>{mark.semester}</td>
                      <td>{mark.marks}</td>
                      <td>{mark.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && tab === "attendance" && (
        <section className="content-grid">
          <article className="dashboard-card span-6">
            <div className="card-head">
              <div>
                <h3>Attendance Status</h3>
                <p className="muted-copy">Attendance is fully wired to the backend analytics response.</p>
              </div>
            </div>
            <div className="line-area">
              <div className="metric-value">{formatMetric(analytics?.attendancePercentage, 0)}%</div>
              <p className="muted-copy" style={{ marginTop: "12px" }}>Stay above 80% to help maintain stronger academic standing and lower risk.</p>
              <div style={{ marginTop: "18px" }} className="progress-bar">
                <div className="progress-fill" style={{ width: `${analytics?.attendancePercentage ?? 0}%` }} />
              </div>
            </div>
          </article>

          <article className="dashboard-card gradient span-6">
            <div className="card-head">
              <div>
                <h3>Performance Trend</h3>
                <p className="muted-copy">A visual pulse inspired by your dashboard reference.</p>
              </div>
            </div>
            <div className="chart-bars alt" style={{ marginTop: "18px" }}>
              {trendBars.map((height, index) => <span key={`${height}-${index}`} style={{ height: `${height * 2}px` }} />)}
            </div>
            <div className="chart-months">{trendMonths.map((month) => <span key={month}>{month}</span>)}</div>
          </article>
        </section>
      )}

      {!loading && tab === "calendar" && (
        <section className="content-grid">
          <article className="timeline-card span-7">
            <div className="card-head">
              <div>
                <h3>Study Calendar</h3>
                <p className="muted-copy">Polished planning view for weekly academic priorities.</p>
              </div>
            </div>
            <ul className="timeline-list" style={{ marginTop: "18px" }}>
              <li className="timeline-item"><strong>Tuesday 07:00 - Mathematics Revision</strong><p className="list-subtext">Focus on practice sets and concept reinforcement.</p></li>
              <li className="timeline-item"><strong>Wednesday 18:00 - Science Mock Test</strong><p className="list-subtext">Use timed practice to strengthen exam confidence.</p></li>
              <li className="timeline-item"><strong>Friday 17:30 - Writing Practice</strong><p className="list-subtext">Build consistency in long-form answers and structure.</p></li>
            </ul>
          </article>

          <article className="action-card span-5 highlight-card">
            <h3>Personal Progress Dashboard</h3>
            <p style={{ marginTop: "12px" }}>
              Keep checking your GPA, predicted score, marks, and attendance each week to stay ahead of performance changes.
            </p>
            <button className="ghost-btn" style={{ marginTop: "20px", color: "var(--primary)" }} type="button" onClick={() => setTab("dashboard")}>
              Return to Overview
            </button>
          </article>
        </section>
      )}
    </DashboardShell>
  );
}
