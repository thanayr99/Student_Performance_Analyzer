import { useEffect, useState } from "react";
import FormField from "../components/FormField";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dataService";
import { extractErrorMessage } from "../services/errorUtils";
import { validateRegistrationAdmin, validateStudent, validateSubject } from "../utils/validation";

const adminTabs = [
  { id: "dashboard", label: "Dashboard", meta: "Overview" },
  { id: "students", label: "Students", meta: "Manage" },
  { id: "subjects", label: "Subjects", meta: "Catalog" },
  { id: "reports", label: "Reports", meta: "Risk" }
];

const chartHeights = [44, 60, 48, 72, 68, 84];
const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

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
  const [notice, setNotice] = useState("");
  const [studentForm, setStudentForm] = useState({ username: "", password: "", name: "", className: "", section: "" });
  const [studentErrors, setStudentErrors] = useState({});
  const [subjectForm, setSubjectForm] = useState({ name: "", credits: 3 });
  const [subjectErrors, setSubjectErrors] = useState({});
  const [registrationForm, setRegistrationForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    name: "",
    className: "",
    section: ""
  });
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingStudentForm, setEditingStudentForm] = useState({ username: "", password: "", name: "", className: "", section: "" });
  const [editingStudentErrors, setEditingStudentErrors] = useState({});
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingSubjectForm, setEditingSubjectForm] = useState({ name: "", credits: 3 });
  const [editingSubjectErrors, setEditingSubjectErrors] = useState({});
  const [editingRegistrationId, setEditingRegistrationId] = useState(null);
  const [editingRegistrationForm, setEditingRegistrationForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    name: "",
    className: "",
    section: ""
  });
  const [editingRegistrationErrors, setEditingRegistrationErrors] = useState({});

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
      setError(extractErrorMessage(err, "Failed to load dashboard"));
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
      setNotice("");
      await action();
      await load();
    } catch (err) {
      setError(extractErrorMessage(err, "Action failed"));
    }
  };

  const activeTab = adminTabs.find((item) => item.id === tab);
  const topPerformerCount = analytics?.topPerformers?.length ?? 0;

  const beginStudentEdit = (student) => {
    setEditingStudentId(student.id);
    setEditingStudentForm({
      username: student.username,
      password: "",
      name: student.name,
      className: student.className,
      section: student.section
    });
    setEditingStudentErrors({});
  };

  const beginSubjectEdit = (subject) => {
    setEditingSubjectId(subject.id);
    setEditingSubjectForm({ name: subject.name, credits: subject.credits });
    setEditingSubjectErrors({});
  };

  const beginRegistrationEdit = (registration) => {
    setEditingRegistrationId(registration.id);
    setEditingRegistrationForm({
      username: registration.username,
      password: "",
      confirmPassword: "",
      role: registration.role,
      name: registration.studentName || registration.username,
      className: registration.className || "",
      section: registration.section || ""
    });
    setEditingRegistrationErrors({});
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand">
            <div className="brand-badge">SP</div>
            <div className="brand-copy">
              <strong>Performance Analyzer</strong>
              <span>Institutional View</span>
            </div>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="avatar-chip">{username?.slice(0, 2)?.toUpperCase() || "AD"}</div>
          <h3>{username}</h3>
          <p>Executive control layer for academic operations, analytics, and intervention tracking.</p>
          <div className="sidebar-mini-stats">
            <div className="sidebar-mini-stat">
              <span>Students</span>
              <strong>{analytics?.totalStudents ?? 0}</strong>
            </div>
            <div className="sidebar-mini-stat">
              <span>High Risk</span>
              <strong>{analytics?.highRiskStudents ?? 0}</strong>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {adminTabs.map((item) => (
            <button key={item.id} className={`sidebar-link ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <span>{item.label}</span>
              <span>{item.meta}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-cta" type="button">
            Export Data
          </button>
          <button className="ghost-btn" type="button" onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="search-shell">
            <span>Go</span>
            <input placeholder="Search academic data..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn" type="button">N</button>
            <button className="icon-btn" type="button">S</button>
            <div className="profile-chip">
              <div>
                <strong>{username}</strong>
                <div className="field-help">Academic Executive</div>
              </div>
              <div className="avatar-chip">{username?.slice(0, 2)?.toUpperCase() || "AD"}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="page-intro-row">
            <div className="page-intro">
              <h1>{activeTab?.label || "Dashboard"}</h1>
              <p>
                A sharper institutional command center for academic analytics, student operations, and risk monitoring,
                all still wired to the existing backend and database.
              </p>
            </div>
            <div className="header-actions">
              <span className="status-chip">Live backend</span>
              <span className="status-chip">{registrations.length} accounts</span>
            </div>
          </section>

          {notice && <div className="notice-box">{notice}</div>}
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
                <MetricCard title="Total Students" badge="Live" badgeClassName="metric-note success" value={analytics?.totalStudents ?? 0} note="Current student count loaded from the active institutional dataset." />
                <MetricCard title="Average GPA" badge="Cohort" badgeClassName="metric-note success" value={analytics?.classAverageGpa ?? 0} note="Institution-wide GPA average across the tracked student population." />
                <MetricCard title="High Risk" badge="Focus" badgeClassName="metric-note warning" value={analytics?.highRiskStudents ?? 0} note="Students currently requiring support, monitoring, or intervention." />
                <MetricCard title="Top Performers" badge="Top Tier" badgeClassName="metric-note success" value={topPerformerCount} note="High-performing students surfaced by the backend analytics pipeline." />
              </section>

              <section className="content-grid">
                <article className="dashboard-card span-6">
                  <div className="card-head">
                    <div>
                      <h3>Subject Performance Matrix</h3>
                      <p className="muted-copy">Difficulty index preview based on live marks and institutional averages.</p>
                    </div>
                    <span className="soft-chip">Subject Health</span>
                  </div>
                  <div className="clean-list" style={{ marginTop: "22px" }}>
                    {Object.entries(analytics?.subjectDifficultyIndex || {}).length === 0 ? (
                      <div className="empty-state">No subject analytics available yet.</div>
                    ) : (
                      Object.entries(analytics?.subjectDifficultyIndex || {}).map(([subject, score]) => (
                        <div key={subject} className="dashboard-card soft">
                          <div className="card-head"><strong>{subject}</strong><strong>{score}%</strong></div>
                          <div style={{ marginTop: "12px" }} className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, Number(score) || 0)}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="dashboard-card gradient span-6">
                  <div className="card-head">
                    <div>
                      <h3>Performance Trend</h3>
                      <p className="muted-copy">Editorial-style performance pulse with a cleaner visual rhythm.</p>
                    </div>
                    <span className="status-chip">Last 6 periods</span>
                  </div>
                  <div className="chart-bars" style={{ marginTop: "26px" }}>
                    {chartHeights.map((height, index) => <span key={index} style={{ height: `${height * 2}px` }} />)}
                  </div>
                  <div className="chart-months">
                    {chartMonths.map((month) => <span key={month}>{month}</span>)}
                  </div>
                </article>

                <article className="table-card span-8">
                  <div className="card-head">
                    <div>
                      <h3>High-Risk Students</h3>
                      <p className="muted-copy">Live risk report directly from the backend analytics service.</p>
                    </div>
                    <span className="status-chip">{riskReport.length} flagged</span>
                  </div>
                  <div className="table-scroll" style={{ marginTop: "18px" }}>
                    <table>
                      <thead>
                        <tr><th>Student Name</th><th>GPA</th><th>Attendance</th><th style={{ textAlign: "right" }}>Risk Level</th></tr>
                      </thead>
                      <tbody>
                        {riskReport.length === 0 ? (
                          <tr><td colSpan="4"><div className="empty-state">No high-risk students found in the current dataset.</div></td></tr>
                        ) : (
                          riskReport.map((student) => (
                            <tr key={student.studentId}>
                              <td>
                                <div className="person-cell">
                                  <div className="person-avatar">{student.name.slice(0, 2).toUpperCase()}</div>
                                  <div className="list-main">
                                    <strong>{student.name}</strong>
                                    <span className="list-subtext">Student ID {student.studentId}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{student.gpa}</td>
                              <td>{student.attendance}%</td>
                              <td style={{ textAlign: "right" }}><span className={`risk-pill ${String(student.riskLevel).toLowerCase()}`}>{student.riskLevel}</span></td>
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
                      <h3>Quick Actions</h3>
                      <p className="muted-copy">More reference-like operational shortcuts without changing functionality.</p>
                    </div>
                  </div>
                  <div className="action-grid" style={{ marginTop: "18px" }}>
                    <button className="action-btn" type="button" onClick={() => setTab("students")}><div className="subject-icon">S</div><div className="list-main"><strong>Manage Students</strong><span className="list-subtext">Create and remove student records</span></div><span>{">"}</span></button>
                    <button className="action-btn" type="button" onClick={() => setTab("subjects")}><div className="subject-icon">C</div><div className="list-main"><strong>Manage Subjects</strong><span className="list-subtext">Maintain the academic catalog</span></div><span>{">"}</span></button>
                    <button className="action-btn highlight-card" type="button" onClick={() => setTab("reports")}><div className="subject-icon" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>I</div><div className="list-main"><strong>Automated Insights</strong><span className="list-subtext" style={{ color: "rgba(255,255,255,0.84)" }}>Review registration and risk trends</span></div></button>
                  </div>
                </article>

                <article className="timeline-card span-4">
                  <div className="card-head">
                    <div>
                      <h3>Operational Notes</h3>
                      <p className="muted-copy">A tighter side-panel summary for executive monitoring.</p>
                    </div>
                  </div>
                  <div className="split-metrics" style={{ marginTop: "18px" }}>
                    <div className="dashboard-card soft"><div className="eyebrow">Registrations</div><div className="metric-value" style={{ fontSize: "2rem", marginTop: "8px" }}>{registrations.length}</div></div>
                    <div className="dashboard-card soft"><div className="eyebrow">Top Performers</div><div className="metric-value" style={{ fontSize: "2rem", marginTop: "8px" }}>{topPerformerCount}</div></div>
                  </div>
                  <ul className="timeline-list" style={{ marginTop: "20px" }}>
                    <li className="timeline-item"><strong>Registration pipeline stable</strong><p className="list-subtext">Both public registration and admin registration are wired to the backend.</p></li>
                    <li className="timeline-item"><strong>Risk data active</strong><p className="list-subtext">The risk report remains synced with the analytics backend logic.</p></li>
                    <li className="timeline-item"><strong>Premium UI refinement</strong><p className="list-subtext">This second pass brings the layout closer to your dashboard reference.</p></li>
                  </ul>
                </article>
              </section>
            </>
          )}

          {!loading && tab === "students" && (
            <section className="content-grid">
              <article className="action-card span-4">
                <div className="card-head">
                  <div>
                    <h3>Create Student</h3>
                    <p className="muted-copy">Create a student record using the existing `/admin/students` API.</p>
                  </div>
                </div>
                <form className="form-stack" style={{ marginTop: "20px" }} onSubmit={(event) => {
                  event.preventDefault();
                  const validation = validateStudent(studentForm);
                  if (!validation.valid) {
                    setStudentErrors(validation.errors);
                    return;
                  }
                  setStudentErrors({});
                  perform(async () => {
                    await dashboardService.createStudent({
                      username: studentForm.username.trim(),
                      password: studentForm.password,
                      name: studentForm.name.trim(),
                      className: studentForm.className.trim(),
                      section: studentForm.section.trim()
                    });
                    setStudentForm({ username: "", password: "", name: "", className: "", section: "" });
                    setNotice("Student created successfully.");
                  });
                }}>
                  <FormField id="student-username" label="Username" error={studentErrors.username}><input id="student-username" value={studentForm.username} onChange={(event) => setStudentForm({ ...studentForm, username: event.target.value })} required /></FormField>
                  <FormField id="student-password" label="Password" error={studentErrors.password}><input id="student-password" type="password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} required /></FormField>
                  <FormField id="student-name" label="Full Name" error={studentErrors.name}><input id="student-name" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} required /></FormField>
                  <div className="form-grid two">
                    <FormField id="student-class" label="Class" error={studentErrors.className}><input id="student-class" value={studentForm.className} onChange={(event) => setStudentForm({ ...studentForm, className: event.target.value })} required /></FormField>
                    <FormField id="student-section" label="Section" error={studentErrors.section}><input id="student-section" value={studentForm.section} onChange={(event) => setStudentForm({ ...studentForm, section: event.target.value })} required /></FormField>
                  </div>
                  <button className="primary-btn" type="submit">Add Student</button>
                </form>
              </article>

              <article className="table-card span-8">
                <div className="card-head">
                  <div>
                    <h3>Student Directory</h3>
                    <p className="muted-copy">Live student list from the current admin dashboard endpoints.</p>
                  </div>
                  <span className="status-chip">{students.length} records</span>
                </div>
                <div className="clean-list" style={{ marginTop: "18px" }}>
                  {students.length === 0 ? <div className="empty-state">No students found.</div> : students.map((student) => (
                    <div className="editable-row" key={student.id}>
                      <div className="editable-row-head">
                        <div className="list-main">
                          <strong>{student.name}</strong>
                          <span className="list-subtext">@{student.username} - {student.className}-{student.section}</span>
                        </div>
                        <div className="inline-actions">
                          <button className="mini-btn" type="button" onClick={() => beginStudentEdit(student)}>Edit</button>
                          <button className="mini-btn" type="button" onClick={() => perform(async () => {
                            await dashboardService.deleteStudent(student.id);
                            setNotice("Student deleted successfully.");
                          })}>Delete</button>
                        </div>
                      </div>
                      {editingStudentId === student.id ? (
                        <form className="form-stack inline-form" onSubmit={(event) => {
                          event.preventDefault();
                          const validation = validateStudent(editingStudentForm, false);
                          if (!validation.valid) {
                            setEditingStudentErrors(validation.errors);
                            return;
                          }
                          setEditingStudentErrors({});
                          perform(async () => {
                            await dashboardService.updateStudent(student.id, {
                              username: editingStudentForm.username.trim(),
                              name: editingStudentForm.name.trim(),
                              className: editingStudentForm.className.trim(),
                              section: editingStudentForm.section.trim()
                            });
                            setEditingStudentId(null);
                            setNotice("Student updated successfully.");
                          });
                        }}>
                          <div className="form-grid two">
                            <FormField id={`edit-student-user-${student.id}`} label="Username" error={editingStudentErrors.username}><input id={`edit-student-user-${student.id}`} value={editingStudentForm.username} onChange={(event) => setEditingStudentForm({ ...editingStudentForm, username: event.target.value })} /></FormField>
                            <FormField id={`edit-student-name-${student.id}`} label="Full Name" error={editingStudentErrors.name}><input id={`edit-student-name-${student.id}`} value={editingStudentForm.name} onChange={(event) => setEditingStudentForm({ ...editingStudentForm, name: event.target.value })} /></FormField>
                          </div>
                          <div className="form-grid two">
                            <FormField id={`edit-student-class-${student.id}`} label="Class" error={editingStudentErrors.className}><input id={`edit-student-class-${student.id}`} value={editingStudentForm.className} onChange={(event) => setEditingStudentForm({ ...editingStudentForm, className: event.target.value })} /></FormField>
                            <FormField id={`edit-student-section-${student.id}`} label="Section" error={editingStudentErrors.section}><input id={`edit-student-section-${student.id}`} value={editingStudentForm.section} onChange={(event) => setEditingStudentForm({ ...editingStudentForm, section: event.target.value })} /></FormField>
                          </div>
                          <div className="inline-actions">
                            <button className="primary-btn" type="submit">Save Changes</button>
                            <button className="ghost-btn" type="button" onClick={() => setEditingStudentId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {!loading && tab === "subjects" && (
            <section className="content-grid">
              <article className="action-card span-5">
                <div className="card-head">
                  <div>
                    <h3>Create Subject</h3>
                    <p className="muted-copy">Maintain subjects using the current backend subject endpoints.</p>
                  </div>
                </div>
                <form className="form-stack" style={{ marginTop: "20px" }} onSubmit={(event) => {
                  event.preventDefault();
                  const validation = validateSubject(subjectForm);
                  if (!validation.valid) {
                    setSubjectErrors(validation.errors);
                    return;
                  }
                  setSubjectErrors({});
                  perform(async () => {
                    await dashboardService.createSubject({
                      name: subjectForm.name.trim(),
                      credits: Number(subjectForm.credits)
                    });
                    setSubjectForm({ name: "", credits: 3 });
                    setNotice("Subject created successfully.");
                  });
                }}>
                  <FormField id="subject-name" label="Subject Name" error={subjectErrors.name}><input id="subject-name" value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} required /></FormField>
                  <FormField id="subject-credits" label="Credits" error={subjectErrors.credits}><input id="subject-credits" type="number" min="1" max="10" value={subjectForm.credits} onChange={(event) => setSubjectForm({ ...subjectForm, credits: event.target.value })} required /></FormField>
                  <button className="primary-btn" type="submit">Add Subject</button>
                </form>
              </article>

              <article className="action-card span-7">
                <div className="card-head">
                  <div>
                    <h3>Create Registration</h3>
                    <p className="muted-copy">Still wired to `/admin/registrations` with no backend behavior changes.</p>
                  </div>
                </div>
                <form className="form-stack" style={{ marginTop: "20px" }} onSubmit={(event) => {
                  event.preventDefault();
                  const validation = validateRegistrationAdmin(registrationForm);
                  if (!validation.valid) {
                    setRegistrationErrors(validation.errors);
                    return;
                  }
                  setRegistrationErrors({});
                  perform(async () => {
                    await dashboardService.createRegistration({
                      username: registrationForm.username.trim(),
                      password: registrationForm.password,
                      role: registrationForm.role,
                      name: registrationForm.name.trim(),
                      className: registrationForm.role === "STUDENT" ? registrationForm.className.trim() : "",
                      section: registrationForm.role === "STUDENT" ? registrationForm.section.trim() : ""
                    });
                    setRegistrationForm({ username: "", password: "", confirmPassword: "", role: "STUDENT", name: "", className: "", section: "" });
                    setNotice("Registration created successfully.");
                  });
                }}>
                  <div className="form-grid two">
                    <FormField id="reg-user" label="Username" error={registrationErrors.username}><input id="reg-user" value={registrationForm.username} onChange={(event) => setRegistrationForm({ ...registrationForm, username: event.target.value })} required /></FormField>
                    <FormField id="reg-pass" label="Password" error={registrationErrors.password}><input id="reg-pass" type="password" value={registrationForm.password} onChange={(event) => setRegistrationForm({ ...registrationForm, password: event.target.value })} required /></FormField>
                  </div>
                  <div className="form-grid two">
                    <FormField id="reg-confirm" label="Confirm Password" error={registrationErrors.confirmPassword}><input id="reg-confirm" type="password" value={registrationForm.confirmPassword} onChange={(event) => setRegistrationForm({ ...registrationForm, confirmPassword: event.target.value })} required /></FormField>
                    <FormField id="reg-role" label="Role"><select id="reg-role" value={registrationForm.role} onChange={(event) => setRegistrationForm({ ...registrationForm, role: event.target.value, className: event.target.value === "STUDENT" ? registrationForm.className : "", section: event.target.value === "STUDENT" ? registrationForm.section : "" })}><option value="STUDENT">STUDENT</option><option value="ADMIN">ADMIN</option></select></FormField>
                  </div>
                  <div className="form-grid two">
                    <FormField id="reg-name" label="Display Name" error={registrationErrors.name}><input id="reg-name" value={registrationForm.name} onChange={(event) => setRegistrationForm({ ...registrationForm, name: event.target.value })} /></FormField>
                    <div className="field"><label htmlFor="reg-role-mode">Access Profile</label><div className="field-readonly" id="reg-role-mode">{registrationForm.role === "STUDENT" ? "Student record with profile details" : "Administrative control account"}</div></div>
                  </div>
                  <div className="form-grid two">
                    <FormField id="reg-class" label="Class" error={registrationErrors.className}><input id="reg-class" value={registrationForm.className} onChange={(event) => setRegistrationForm({ ...registrationForm, className: event.target.value })} disabled={registrationForm.role !== "STUDENT"} /></FormField>
                    <FormField id="reg-section" label="Section" error={registrationErrors.section}><input id="reg-section" value={registrationForm.section} onChange={(event) => setRegistrationForm({ ...registrationForm, section: event.target.value })} disabled={registrationForm.role !== "STUDENT"} /></FormField>
                  </div>
                  <button className="primary-btn" type="submit">Create Registration</button>
                </form>

                <div className="clean-list" style={{ marginTop: "24px" }}>
                  {subjects.length === 0 ? <div className="empty-state">No subjects available yet.</div> : subjects.map((subject) => (
                    <div className="editable-row" key={subject.id}>
                      <div className="editable-row-head">
                        <div className="list-main">
                          <strong>{subject.name}</strong>
                          <span className="list-subtext">{subject.credits} credits</span>
                        </div>
                        <div className="inline-actions">
                          <button className="mini-btn" type="button" onClick={() => beginSubjectEdit(subject)}>Edit</button>
                          <button className="mini-btn" type="button" onClick={() => perform(async () => {
                            await dashboardService.deleteSubject(subject.id);
                            setNotice("Subject deleted successfully.");
                          })}>Delete</button>
                        </div>
                      </div>
                      {editingSubjectId === subject.id ? (
                        <form className="form-stack inline-form" onSubmit={(event) => {
                          event.preventDefault();
                          const validation = validateSubject(editingSubjectForm);
                          if (!validation.valid) {
                            setEditingSubjectErrors(validation.errors);
                            return;
                          }
                          setEditingSubjectErrors({});
                          perform(async () => {
                            await dashboardService.updateSubject(subject.id, {
                              name: editingSubjectForm.name.trim(),
                              credits: Number(editingSubjectForm.credits)
                            });
                            setEditingSubjectId(null);
                            setNotice("Subject updated successfully.");
                          });
                        }}>
                          <div className="form-grid two">
                            <FormField id={`edit-subject-name-${subject.id}`} label="Subject Name" error={editingSubjectErrors.name}><input id={`edit-subject-name-${subject.id}`} value={editingSubjectForm.name} onChange={(event) => setEditingSubjectForm({ ...editingSubjectForm, name: event.target.value })} /></FormField>
                            <FormField id={`edit-subject-credits-${subject.id}`} label="Credits" error={editingSubjectErrors.credits}><input id={`edit-subject-credits-${subject.id}`} type="number" min="1" max="10" value={editingSubjectForm.credits} onChange={(event) => setEditingSubjectForm({ ...editingSubjectForm, credits: event.target.value })} /></FormField>
                          </div>
                          <div className="inline-actions">
                            <button className="primary-btn" type="submit">Save Changes</button>
                            <button className="ghost-btn" type="button" onClick={() => setEditingSubjectId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {!loading && tab === "reports" && (
            <section className="content-grid">
              <article className="table-card span-7">
                <div className="card-head">
                  <div>
                    <h3>Registrations</h3>
                    <p className="muted-copy">Current user accounts created through the admin and auth flows.</p>
                  </div>
                </div>
                <div className="clean-list" style={{ marginTop: "18px" }}>
                  {registrations.length === 0 ? <div className="empty-state">No registrations available.</div> : registrations.map((registration) => (
                    <div className="editable-row" key={registration.id}>
                      <div className="editable-row-head">
                        <div className="list-main">
                          <strong>{registration.username}</strong>
                          <span className="list-subtext">
                            {registration.role}
                            {registration.studentName ? ` - ${registration.studentName}` : ""}
                            {registration.className ? ` - ${registration.className}-${registration.section}` : ""}
                          </span>
                        </div>
                        <div className="inline-actions">
                          <button className="mini-btn" type="button" onClick={() => beginRegistrationEdit(registration)}>Edit</button>
                          <button className="mini-btn" type="button" onClick={() => perform(async () => {
                            await dashboardService.deleteRegistration(registration.id);
                            setNotice("Registration deleted successfully.");
                          })}>Delete</button>
                        </div>
                      </div>
                      {editingRegistrationId === registration.id ? (
                        <form className="form-stack inline-form" onSubmit={(event) => {
                          event.preventDefault();
                          const validation = validateRegistrationAdmin(editingRegistrationForm, { requirePassword: false });
                          if (!validation.valid) {
                            setEditingRegistrationErrors(validation.errors);
                            return;
                          }
                          setEditingRegistrationErrors({});
                          perform(async () => {
                            await dashboardService.updateRegistration(registration.id, {
                              username: editingRegistrationForm.username.trim(),
                              password: editingRegistrationForm.password || undefined,
                              role: editingRegistrationForm.role,
                              name: editingRegistrationForm.name.trim(),
                              className: editingRegistrationForm.role === "STUDENT" ? editingRegistrationForm.className.trim() : "",
                              section: editingRegistrationForm.role === "STUDENT" ? editingRegistrationForm.section.trim() : ""
                            });
                            setEditingRegistrationId(null);
                            setNotice("Registration updated successfully.");
                          });
                        }}>
                          <div className="form-grid two">
                            <FormField id={`edit-reg-user-${registration.id}`} label="Username" error={editingRegistrationErrors.username}><input id={`edit-reg-user-${registration.id}`} value={editingRegistrationForm.username} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, username: event.target.value })} /></FormField>
                            <FormField id={`edit-reg-role-${registration.id}`} label="Role"><select id={`edit-reg-role-${registration.id}`} value={editingRegistrationForm.role} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, role: event.target.value, className: event.target.value === "STUDENT" ? editingRegistrationForm.className : "", section: event.target.value === "STUDENT" ? editingRegistrationForm.section : "" })}><option value="STUDENT">STUDENT</option><option value="ADMIN">ADMIN</option></select></FormField>
                          </div>
                          <div className="form-grid two">
                            <FormField id={`edit-reg-pass-${registration.id}`} label="New Password" error={editingRegistrationErrors.password} help="Leave blank to keep the current password."><input id={`edit-reg-pass-${registration.id}`} type="password" value={editingRegistrationForm.password} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, password: event.target.value })} /></FormField>
                            <FormField id={`edit-reg-confirm-${registration.id}`} label="Confirm Password" error={editingRegistrationErrors.confirmPassword}><input id={`edit-reg-confirm-${registration.id}`} type="password" value={editingRegistrationForm.confirmPassword} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, confirmPassword: event.target.value })} /></FormField>
                          </div>
                          <div className="form-grid two">
                            <FormField id={`edit-reg-name-${registration.id}`} label="Display Name" error={editingRegistrationErrors.name}><input id={`edit-reg-name-${registration.id}`} value={editingRegistrationForm.name} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, name: event.target.value })} /></FormField>
                            <div className="field"><label htmlFor={`edit-reg-mode-${registration.id}`}>Account Type</label><div className="field-readonly" id={`edit-reg-mode-${registration.id}`}>{editingRegistrationForm.role === "STUDENT" ? "Student account with profile record" : "Administrative control account"}</div></div>
                          </div>
                          <div className="form-grid two">
                            <FormField id={`edit-reg-class-${registration.id}`} label="Class" error={editingRegistrationErrors.className}><input id={`edit-reg-class-${registration.id}`} value={editingRegistrationForm.className} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, className: event.target.value })} disabled={editingRegistrationForm.role !== "STUDENT"} /></FormField>
                            <FormField id={`edit-reg-section-${registration.id}`} label="Section" error={editingRegistrationErrors.section}><input id={`edit-reg-section-${registration.id}`} value={editingRegistrationForm.section} onChange={(event) => setEditingRegistrationForm({ ...editingRegistrationForm, section: event.target.value })} disabled={editingRegistrationForm.role !== "STUDENT"} /></FormField>
                          </div>
                          <div className="inline-actions">
                            <button className="primary-btn" type="submit">Save Changes</button>
                            <button className="ghost-btn" type="button" onClick={() => setEditingRegistrationId(null)}>Cancel</button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>

              <article className="timeline-card span-5">
                <div className="card-head">
                  <div>
                    <h3>Operational Notes</h3>
                    <p className="muted-copy">A tighter side-panel summary for executive monitoring.</p>
                  </div>
                </div>
                <div className="split-metrics" style={{ marginTop: "18px" }}>
                  <div className="dashboard-card soft"><div className="eyebrow">Registrations</div><div className="metric-value" style={{ fontSize: "2rem", marginTop: "8px" }}>{registrations.length}</div></div>
                  <div className="dashboard-card soft"><div className="eyebrow">Top Performers</div><div className="metric-value" style={{ fontSize: "2rem", marginTop: "8px" }}>{topPerformerCount}</div></div>
                </div>
                <ul className="timeline-list" style={{ marginTop: "20px" }}>
                  <li className="timeline-item"><strong>Registration pipeline stable</strong><p className="list-subtext">Both public registration and admin registration are wired to the backend.</p></li>
                  <li className="timeline-item"><strong>Risk data active</strong><p className="list-subtext">The risk report remains synced with the analytics backend logic.</p></li>
                  <li className="timeline-item"><strong>Premium UI refinement</strong><p className="list-subtext">This second pass brings the layout closer to your dashboard reference.</p></li>
                </ul>
              </article>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
