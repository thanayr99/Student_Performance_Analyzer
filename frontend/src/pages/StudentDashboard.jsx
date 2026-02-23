import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dataService";

const bars = [2, 6, 9, 7, 8, 5, 9, 10, 8, 7, 6, 8];

export default function StudentDashboard() {
  const { username, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getStudentDashboard(username);
        setProfile(data.profile);
        setMarks(data.marks);
        setAnalytics(data.analytics);
      } catch (err) {
        setError(err?.message || "Unable to load dashboard");
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
              <button className="active">Dashboard</button>
              <button>Marks</button>
              <button>Attendance</button>
              <button>Calendar</button>
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

          <section className="dash-grid">
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
              <ul className="list clean tight">
                {(analytics?.subjectAverages || []).map((s) => (
                  <li key={s.subject}>
                    {s.subject}
                    <span>{s.averageMarks}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="dash-card span-2">
              <h3>Recommendation</h3>
              <p className="rec">{analytics?.recommendation}</p>
            </article>
          </section>

          <section className="dash-card">
            <h3>Exam History</h3>
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
          </section>
        </main>
      </div>
    </div>
  );
}
