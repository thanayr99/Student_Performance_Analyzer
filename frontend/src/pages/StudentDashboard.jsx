import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dataService";

const bars = [2, 6, 9, 7, 8, 5, 9, 10, 8, 7, 6, 8];

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
        const data = await dashboardService.getStudentDashboard(username);
        setProfile(data.profile);
        setMarks(data.marks);
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <aside className="sidebar">
          <div>
            <div className="logo">Education</div>
            <div className="avatar-block">
              <div className="avatar student" />
              <h4>{profile?.name || username}</h4>
              <p>{profile?.className || "-"} Section {profile?.section || "-"}</p>
            </div>
            <nav className="nav">
              <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
                Dashboard
              </button>
              <button className={tab === "marks" ? "active" : ""} onClick={() => setTab("marks")}>
                Marks
              </button>
              <button className={tab === "attendance" ? "active" : ""} onClick={() => setTab("attendance")}>
                Attendance
              </button>
              <button className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>
                Calendar
              </button>
            </nav>
          </div>
          <button className="ghost-btn full" onClick={logout}>
            Log Out
          </button>
        </aside>

        <main className="panel">
          <header className="panel-head">
            <h1>Hello, {profile?.name?.split(" ")[0] || "Student"}!</h1>
            <div className="search-chip">Student View</div>
          </header>
          {error && <div className="error">{error}</div>}
          {loading && (
            <section className="dash-grid">
              <article className="dash-card skeleton h120" />
              <article className="dash-card skeleton h120" />
              <article className="dash-card skeleton h120" />
              <article className="dash-card skeleton h120" />
              <article className="dash-card skeleton h160 span-2" />
              <article className="dash-card skeleton h160" />
              <article className="dash-card skeleton h160 span-2" />
            </section>
          )}

          {!loading && tab === "dashboard" && <section className="dash-grid">
            <article className="dash-card">
              <h3>GPA</h3>
              <div className="big">{analytics?.gpa ?? "-"}</div>
              <p>Current semester score</p>
            </article>
            <article className="dash-card">
              <h3>Attendance</h3>
              <div className="big">{analytics?.attendancePercentage ?? "-"}%</div>
              <p>Class participation</p>
            </article>
            <article className="dash-card">
              <h3>Predicted Score</h3>
              <div className="big">{analytics?.predictedScore ?? "-"}</div>
              <p>Next exam forecast</p>
            </article>
            <article className="dash-card">
              <h3>Risk Level</h3>
              <div className={`pill ${String(analytics?.riskLevel || "").toLowerCase()}`}>{analytics?.riskLevel}</div>
              <p>AI-based risk marker</p>
            </article>

            <article className="dash-card span-2">
              <div className="card-head">
                <h3>Personal Activity</h3>
                <span>Last 12 days</span>
              </div>
              <div className="bars">
                {bars.map((v, i) => (
                  <span key={i} style={{ height: `${v * 9}px` }} />
                ))}
              </div>
            </article>

            <article className="dash-card">
              <h3>Subject Averages</h3>
              {(analytics?.subjectAverages || []).length === 0 ? (
                <div className="empty-state">No subject averages available.</div>
              ) : (
              <ul className="list clean tight">
                {(analytics?.subjectAverages || []).map((s) => (
                  <li key={s.subject}>
                    {s.subject}
                    <span>{s.averageMarks}</span>
                  </li>
                ))}
              </ul>
              )}
            </article>

            <article className="dash-card span-2">
              <h3>Recommendation</h3>
              <p className="rec">{analytics?.recommendation}</p>
            </article>
          </section>}

          {!loading && tab === "marks" && (
            <section className="dash-card">
              <h3>Exam History</h3>
              {marks.length === 0 ? (
                <div className="empty-state">No marks recorded yet.</div>
              ) : (
              <ul className="list clean">
                {marks.map((m) => (
                  <li key={m.id}>
                    {m.subject} ({m.examType})
                    <span>
                      {m.marks} | Sem {m.semester} | {m.date}
                    </span>
                  </li>
                ))}
              </ul>
              )}
            </section>
          )}

          {!loading && tab === "attendance" && (
            <section className="dash-card">
              <h3>Attendance Summary</h3>
              <p className="rec">
                Current attendance: <strong>{analytics?.attendancePercentage ?? "-"}%</strong>
                <br />
                Target weekly attendance: <strong>85%</strong>
                <br />
                Recommendation: stay above 80% to keep low-risk status.
              </p>
            </section>
          )}

          {!loading && tab === "calendar" && (
            <section className="dash-card">
              <h3>Study Calendar</h3>
              <p className="rec">
                Tue 07:00 - Mathematics revision
                <br />
                Wed 18:00 - Science mock test
                <br />
                Fri 17:30 - English writing practice
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
