import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dataService";

const perfPoints = [18, 42, 31, 55, 49, 62, 57, 70, 46, 64, 78];
const bars = [3, 7, 9, 5, 10, 7, 6, 10, 8, 10, 9, 8, 6, 7];

function Sparkline() {
  const points = perfPoints.map((v, i) => `${i * 34},${120 - v}`).join(" ");
  return (
    <svg viewBox="0 0 360 130" className="line-svg" role="img" aria-label="performance chart">
      <defs>
        <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5cff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7a5cff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="#7a5cff" strokeWidth="4" strokeLinecap="round" />
      <polyline points={`${points} 340,130 0,130`} fill="url(#lineGlow)" />
      <polyline
        points={perfPoints.map((v, i) => `${i * 34},${114 - v}`).join(" ")}
        fill="none"
        stroke="#ff2e92"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [riskReport, setRiskReport] = useState([]);
  const [error, setError] = useState("");
  const [studentForm, setStudentForm] = useState({ username: "", password: "", name: "", className: "", section: "" });
  const [subjectForm, setSubjectForm] = useState({ name: "", credits: 3 });
  const [registrationForm, setRegistrationForm] = useState({
    username: "",
    password: "",
    role: "STUDENT",
    name: "",
    className: "",
    section: ""
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getAdminDashboard();
      setStudents(data.students);
      setSubjects(data.subjects);
      setRegistrations(data.registrations);
      setAnalytics(data.analytics);
      setRiskReport(data.riskReport);
    } catch (err) {
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const perform = async (action) => {
    try {
      setError("");
      await action();
      await load();
    } catch (err) {
      setError(err?.message || "Action failed");
    }
  };

  const ring = useMemo(() => {
    const score = Math.round((analytics?.classAverageGpa || 0) * 10);
    return {
      style: {
        "--p": `${score}`,
        "--c": "#ff2e92"
      }
    };
  }, [analytics]);

  return (
    <div className="dash-page">
      <div className="dash-shell">
        <aside className="sidebar">
          <div>
            <div className="logo">Education</div>
            <div className="avatar-block">
              <div className="avatar" />
              <h4>{username}</h4>
              <p>admin@academy.com</p>
            </div>
            <nav className="nav">
              <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
                Dashboard
              </button>
              <button className={tab === "students" ? "active" : ""} onClick={() => setTab("students")}>
                Students
              </button>
              <button className={tab === "subjects" ? "active" : ""} onClick={() => setTab("subjects")}>
                Subjects
              </button>
              <button className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>
                Calendar
              </button>
              <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>
                Reports
              </button>
            </nav>
          </div>
          <button className="ghost-btn full" onClick={logout}>
            Log Out
          </button>
        </aside>

        <main className="panel">
          <header className="panel-head">
            <h1>Hello, {username}!</h1>
            <div className="search-chip">Review Mode</div>
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
              <article className="dash-card skeleton h160" />
            </section>
          )}

          {!loading && tab === "dashboard" && <section className="dash-grid">
            <article className="dash-card span-2">
              <div className="card-head">
                <h3>Performance</h3>
                <span>This Month</span>
              </div>
              <Sparkline />
            </article>
            <article className="dash-card">
              <h3>Personal Progress</h3>
              <div className="ring" {...ring}>
                <span>{Math.round((analytics?.classAverageGpa || 0) * 10)}%</span>
              </div>
              <p className="good">+10% vs last week</p>
            </article>
            <article className="dash-card">
              <h3>Students</h3>
              <div className="big">{analytics?.totalStudents ?? 0}</div>
              <p>Total active learners</p>
            </article>
            <article className="dash-card">
              <h3>At Risk</h3>
              <div className="big pink">{analytics?.highRiskStudents ?? 0}</div>
              <p>Need mentoring support</p>
            </article>

            <article className="dash-card span-2">
              <div className="card-head">
                <h3>Daily Activity</h3>
                <span>20 - 02 Feb</span>
              </div>
              <div className="bars">
                {bars.map((v, i) => (
                  <span key={i} style={{ height: `${v * 9}px` }} />
                ))}
              </div>
            </article>

            <article className="dash-card">
              <h3>Top Performers</h3>
              {(analytics?.topPerformers || []).length === 0 ? (
                <div className="empty-state">No performers available yet.</div>
              ) : (
              <ul className="list clean">
                {(analytics?.topPerformers || []).map((p) => (
                  <li key={p.studentId}>
                    {p.studentName}
                    <span>{p.gpa}</span>
                  </li>
                ))}
              </ul>
              )}
            </article>

            <article className="dash-card">
              <h3>Risk Report</h3>
              {riskReport.length === 0 ? (
                <div className="empty-state">No at-risk students in current dataset.</div>
              ) : (
              <ul className="list clean">
                {riskReport.map((r) => (
                  <li key={r.studentId}>
                    {r.name}
                    <span className={`pill ${r.riskLevel.toLowerCase()}`}>{r.riskLevel}</span>
                  </li>
                ))}
              </ul>
              )}
            </article>
          </section>}

          {!loading && tab === "students" && <section className="forms-grid">
            <article className="dash-card">
              <h3>Add Student</h3>
              <form
                className="stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(async () => {
                    await dashboardService.createStudent(studentForm);
                    setStudentForm({ username: "", password: "", name: "", className: "", section: "" });
                  });
                }}
              >
                <input placeholder="Username" value={studentForm.username} onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })} required />
                <input type="password" placeholder="Password" value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} required />
                <input placeholder="Full Name" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} required />
                <div className="grid-2">
                  <input placeholder="Class" value={studentForm.className} onChange={(e) => setStudentForm({ ...studentForm, className: e.target.value })} required />
                  <input placeholder="Section" value={studentForm.section} onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })} required />
                </div>
                <button className="primary-btn">Add Student</button>
              </form>
            </article>
            <article className="dash-card span-2">
              <h3>Manage Students</h3>
              {students.length === 0 ? (
                <div className="empty-state">No students found. Add one using the form.</div>
              ) : (
              <ul className="list clean">
                {students.map((s) => (
                  <li key={s.id}>
                    {s.name} ({s.className}-{s.section})
                    <span>
                      @{s.username}
                      <button className="mini-btn" onClick={() => perform(() => dashboardService.deleteStudent(s.id))}>
                        delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              )}
            </article>
          </section>}

          {!loading && tab === "subjects" && <section className="forms-grid">
            <article className="dash-card span-2">
              <h3>Add Subject</h3>
              <form
                className="stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(async () => {
                    await dashboardService.createSubject(subjectForm);
                    setSubjectForm({ name: "", credits: 3 });
                  });
                }}
              >
                <input placeholder="Subject Name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} required />
                <input type="number" min="1" max="10" placeholder="Credits" value={subjectForm.credits} onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })} required />
                <button className="primary-btn">Add Subject</button>
              </form>
              {subjects.length === 0 ? (
                <div className="empty-state">No subjects yet. Add the first subject.</div>
              ) : (
              <ul className="list clean tight">
                {subjects.map((s) => (
                  <li key={s.id}>
                    {s.name}
                    <span>
                      {s.credits} cr{" "}
                      <button className="mini-btn" onClick={() => perform(() => dashboardService.deleteSubject(s.id))}>
                        delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              )}
            </article>

            <article className="dash-card">
              <h3>Create Registration</h3>
              <form
                className="stack"
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(async () => {
                    await dashboardService.createRegistration(registrationForm);
                    setRegistrationForm({
                      username: "",
                      password: "",
                      role: "STUDENT",
                      name: "",
                      className: "",
                      section: ""
                    });
                  });
                }}
              >
                <input placeholder="Username" value={registrationForm.username} onChange={(e) => setRegistrationForm({ ...registrationForm, username: e.target.value })} required />
                <input type="password" placeholder="Password" value={registrationForm.password} onChange={(e) => setRegistrationForm({ ...registrationForm, password: e.target.value })} required />
                <select value={registrationForm.role} onChange={(e) => setRegistrationForm({ ...registrationForm, role: e.target.value })}>
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <input placeholder="Display Name" value={registrationForm.name} onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })} />
                <div className="grid-2">
                  <input placeholder="Class" value={registrationForm.className} onChange={(e) => setRegistrationForm({ ...registrationForm, className: e.target.value })} />
                  <input placeholder="Section" value={registrationForm.section} onChange={(e) => setRegistrationForm({ ...registrationForm, section: e.target.value })} />
                </div>
                <button className="primary-btn">Create User</button>
              </form>
            </article>
          </section>}

          {!loading && tab === "calendar" && (
            <section className="dash-card">
              <h3>Calendar</h3>
              <p className="rec">
                09:00 - Subject planning
                <br />
                11:30 - Parent follow-up
                <br />
                14:00 - Mentoring session (high-risk group)
              </p>
            </section>
          )}

          {!loading && tab === "reports" && (
            <section className="dash-card">
              <h3>Registration Report</h3>
              {registrations.length === 0 ? (
                <div className="empty-state">No registrations available.</div>
              ) : (
              <ul className="list clean">
                {registrations.map((r) => (
                  <li key={r.id}>
                    {r.username}
                    <span>
                      {r.role}
                      <button className="mini-btn" onClick={() => perform(() => dashboardService.deleteRegistration(r.id))}>
                        delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
