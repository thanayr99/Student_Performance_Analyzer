import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import FormField from "../components/FormField";
import MetricCard from "../components/MetricCard";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dataService";
import { extractErrorMessage } from "../services/errorUtils";
import { validateStudent } from "../utils/validation";

const teacherTabs = [
  { id: "dashboard", label: "Dashboard", meta: "Analyze" },
  { id: "students", label: "Students", meta: "Manage" },
  { id: "marks", label: "Marks", meta: "Allot" },
  { id: "attendance", label: "Attendance", meta: "Record" }
];

const examTypes = ["QUIZ", "MIDTERM", "FINAL"];

function formatMetric(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return number.toFixed(digits).replace(/\.00$/, "");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherDashboard() {
  const { username, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [studentForm, setStudentForm] = useState({ username: "", password: "", name: "", className: "", section: "" });
  const [studentErrors, setStudentErrors] = useState({});
  const [marksForm, setMarksForm] = useState({ studentId: "", subjectId: "", marks: "", examType: "MIDTERM", semester: 1, date: today() });
  const [attendanceForm, setAttendanceForm] = useState({ studentId: "", attendancePercentage: "" });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await dashboardService.getTeacherDashboard();
      setStudents(data.students);
      setSubjects(data.subjects);
      setPerformance(data.performance);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load teacher dashboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const perform = async (action, message) => {
    try {
      setError("");
      setNotice("");
      await action();
      await load();
      setNotice(message);
    } catch (err) {
      setError(extractErrorMessage(err, "Action failed"));
    }
  };

  const averageCgpa = useMemo(() => {
    if (!performance.length) return 0;
    return performance.reduce((sum, item) => sum + Number(item.cgpa || 0), 0) / performance.length;
  }, [performance]);

  const averageAttendance = useMemo(() => {
    if (!performance.length) return 0;
    return performance.reduce((sum, item) => sum + Number(item.attendancePercentage || 0), 0) / performance.length;
  }, [performance]);

  const highRiskCount = performance.filter((item) => item.riskLevel === "HIGH").length;
  const activeTab = teacherTabs.find((item) => item.id === tab);
  const initials = username?.slice(0, 2)?.toUpperCase() || "TR";

  const submitStudent = (event) => {
    event.preventDefault();
    const validation = validateStudent(studentForm);
    if (!validation.valid) {
      setStudentErrors(validation.errors);
      return;
    }
    setStudentErrors({});
    perform(async () => {
      await dashboardService.createTeacherStudent({
        username: studentForm.username.trim(),
        password: studentForm.password,
        name: studentForm.name.trim(),
        className: studentForm.className.trim(),
        section: studentForm.section.trim()
      });
      setStudentForm({ username: "", password: "", name: "", className: "", section: "" });
    }, "Student added successfully.");
  };

  const submitMarks = (event) => {
    event.preventDefault();
    perform(async () => {
      await dashboardService.addTeacherMarks({
        studentId: Number(marksForm.studentId),
        subjectId: Number(marksForm.subjectId),
        marks: Number(marksForm.marks),
        examType: marksForm.examType,
        semester: Number(marksForm.semester),
        date: marksForm.date
      });
      setMarksForm({ studentId: "", subjectId: "", marks: "", examType: "MIDTERM", semester: 1, date: today() });
    }, "Marks allotted successfully.");
  };

  const submitAttendance = (event) => {
    event.preventDefault();
    perform(async () => {
      await dashboardService.addTeacherAttendance({
        studentId: Number(attendanceForm.studentId),
        attendancePercentage: Number(attendanceForm.attendancePercentage)
      });
      setAttendanceForm({ studentId: "", attendancePercentage: "" });
    }, "Attendance updated successfully.");
  };

  return (
    <DashboardShell
      brandSubtitle="Teacher View"
      sidebarProfile={
        <div className="sidebar-profile">
          <div className="avatar-chip">{initials}</div>
          <h3>{username}</h3>
          <p>Teacher workspace for student records, attendance, marks, CGPA, and performance analysis.</p>
          <div className="sidebar-mini-stats">
            <div className="sidebar-mini-stat"><span>Students</span><strong>{students.length}</strong></div>
            <div className="sidebar-mini-stat"><span>Avg CGPA</span><strong>{formatMetric(averageCgpa)}</strong></div>
          </div>
        </div>
      }
      navItems={teacherTabs}
      activeTab={tab}
      onTabChange={setTab}
      sidebarFooter={<button className="ghost-btn" type="button" onClick={logout}>Log Out</button>}
      searchPlaceholder="Search students..."
      profileTitle={username}
      profileSubtitle="Teacher account"
      profileInitials={initials}
      pageTitle={activeTab?.label || "Teacher Dashboard"}
      pageDescription="Manage students, allot marks, update attendance, and analyze CGPA-backed performance using persisted backend data."
      pageActions={<><span className="status-chip">Database backed</span><span className="status-chip">{students.length} students</span></>}
    >
      {notice && <div className="notice-box">{notice}</div>}
      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <section className="content-grid">
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-3" />
          <div className="skeleton span-12" />
        </section>
      ) : null}

      {!loading && tab === "dashboard" && (
        <>
          <section className="summary-grid">
            <MetricCard title="Students" badge="Live" badgeClassName="metric-note success" value={students.length} note="Students currently stored in the database." />
            <MetricCard title="Average CGPA" badge="CGPA" badgeClassName="metric-note success" value={formatMetric(averageCgpa)} note="Overall class CGPA from the analytics service." />
            <MetricCard title="Attendance" badge="Average" badgeClassName="metric-note" value={`${formatMetric(averageAttendance, 0)}%`} note="Average attendance percentage across students." />
            <MetricCard title="High Risk" badge="Focus" badgeClassName="metric-note warning" value={highRiskCount} note="Students needing attention based on CGPA and attendance." />
          </section>

          <section className="table-card">
            <div className="card-head">
              <div>
                <h3>Student Performance Analysis</h3>
                <p className="muted-copy">CGPA, attendance percentage, predicted score, risk, and recommendation for each student.</p>
              </div>
            </div>
            <PerformanceTable rows={performance} />
          </section>
        </>
      )}

      {!loading && tab === "students" && (
        <section className="content-grid">
          <article className="action-card span-4">
            <div className="card-head"><div><h3>Add Student</h3><p className="muted-copy">Creates a persisted student login and profile.</p></div></div>
            <form className="form-stack" style={{ marginTop: "18px" }} onSubmit={submitStudent}>
              <FormField id="teacher-student-username" label="Username" error={studentErrors.username}><input id="teacher-student-username" value={studentForm.username} onChange={(event) => setStudentForm({ ...studentForm, username: event.target.value })} required /></FormField>
              <FormField id="teacher-student-password" label="Password" error={studentErrors.password}><input id="teacher-student-password" type="password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} required /></FormField>
              <FormField id="teacher-student-name" label="Full Name" error={studentErrors.name}><input id="teacher-student-name" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} required /></FormField>
              <div className="form-grid two">
                <FormField id="teacher-student-class" label="Class" error={studentErrors.className}><input id="teacher-student-class" value={studentForm.className} onChange={(event) => setStudentForm({ ...studentForm, className: event.target.value })} required /></FormField>
                <FormField id="teacher-student-section" label="Section" error={studentErrors.section}><input id="teacher-student-section" value={studentForm.section} onChange={(event) => setStudentForm({ ...studentForm, section: event.target.value })} required /></FormField>
              </div>
              <button className="primary-btn" type="submit">Add Student</button>
            </form>
          </article>

          <article className="table-card span-8">
            <div className="card-head"><div><h3>Student Records</h3><p className="muted-copy">Teachers can delete student records when needed.</p></div></div>
            <div className="clean-list" style={{ marginTop: "18px" }}>
              {students.map((student) => (
                <div className="editable-row" key={student.id}>
                  <div className="editable-row-head">
                    <div className="person-cell">
                      <div className="person-avatar">{student.name.slice(0, 2).toUpperCase()}</div>
                      <div className="list-main"><strong>{student.name}</strong><span className="list-subtext">{student.username} - Class {student.className} {student.section}</span></div>
                    </div>
                    <button className="mini-btn" type="button" onClick={() => perform(() => dashboardService.deleteTeacherStudent(student.id), "Student deleted successfully.")}>Delete</button>
                  </div>
                </div>
              ))}
              {students.length === 0 ? <div className="empty-state">No students available.</div> : null}
            </div>
          </article>
        </section>
      )}

      {!loading && tab === "marks" && (
        <section className="content-grid">
          <article className="action-card span-4">
            <div className="card-head"><div><h3>Allot Marks</h3><p className="muted-copy">Marks are stored and immediately refresh CGPA/performance.</p></div></div>
            <form className="form-stack" style={{ marginTop: "18px" }} onSubmit={submitMarks}>
              <FormField id="marks-student" label="Student"><select id="marks-student" value={marksForm.studentId} onChange={(event) => setMarksForm({ ...marksForm, studentId: event.target.value })} required><option value="">Select student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></FormField>
              <FormField id="marks-subject" label="Subject"><select id="marks-subject" value={marksForm.subjectId} onChange={(event) => setMarksForm({ ...marksForm, subjectId: event.target.value })} required><option value="">Select subject</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></FormField>
              <div className="form-grid two">
                <FormField id="marks-score" label="Marks"><input id="marks-score" type="number" min="0" max="100" value={marksForm.marks} onChange={(event) => setMarksForm({ ...marksForm, marks: event.target.value })} required /></FormField>
                <FormField id="marks-semester" label="Semester"><input id="marks-semester" type="number" min="1" value={marksForm.semester} onChange={(event) => setMarksForm({ ...marksForm, semester: event.target.value })} required /></FormField>
              </div>
              <div className="form-grid two">
                <FormField id="marks-exam" label="Exam Type"><select id="marks-exam" value={marksForm.examType} onChange={(event) => setMarksForm({ ...marksForm, examType: event.target.value })}>{examTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></FormField>
                <FormField id="marks-date" label="Date"><input id="marks-date" type="date" value={marksForm.date} onChange={(event) => setMarksForm({ ...marksForm, date: event.target.value })} required /></FormField>
              </div>
              <button className="primary-btn" type="submit">Save Marks</button>
            </form>
          </article>
          <article className="table-card span-8">
            <div className="card-head"><div><h3>CGPA Results</h3><p className="muted-copy">Overall CGPA displayed after marks are allotted.</p></div></div>
            <PerformanceTable rows={performance} compact />
          </article>
        </section>
      )}

      {!loading && tab === "attendance" && (
        <section className="content-grid">
          <article className="action-card span-4">
            <div className="card-head"><div><h3>Provide Attendance</h3><p className="muted-copy">Attendance percentage is stored per student.</p></div></div>
            <form className="form-stack" style={{ marginTop: "18px" }} onSubmit={submitAttendance}>
              <FormField id="attendance-student" label="Student"><select id="attendance-student" value={attendanceForm.studentId} onChange={(event) => setAttendanceForm({ ...attendanceForm, studentId: event.target.value })} required><option value="">Select student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></FormField>
              <FormField id="attendance-percent" label="Attendance Percentage"><input id="attendance-percent" type="number" min="0" max="100" value={attendanceForm.attendancePercentage} onChange={(event) => setAttendanceForm({ ...attendanceForm, attendancePercentage: event.target.value })} required /></FormField>
              <button className="primary-btn" type="submit">Save Attendance</button>
            </form>
          </article>
          <article className="table-card span-8">
            <div className="card-head"><div><h3>Attendance View</h3><p className="muted-copy">Teachers can view attendance percentage alongside performance risk.</p></div></div>
            <PerformanceTable rows={performance} compact />
          </article>
        </section>
      )}
    </DashboardShell>
  );
}

function PerformanceTable({ rows, compact = false }) {
  return (
    <div className="table-scroll" style={{ marginTop: "18px" }}>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>CGPA</th>
            <th>Attendance</th>
            <th>Predicted</th>
            <th>Risk</th>
            {!compact && <th>Performance</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={compact ? 5 : 6}><div className="empty-state">No performance data available.</div></td></tr>
          ) : rows.map((row) => (
            <tr key={row.studentId}>
              <td>
                <div className="person-cell">
                  <div className="person-avatar">{row.name.slice(0, 2).toUpperCase()}</div>
                  <div className="list-main"><strong>{row.name}</strong><span className="list-subtext">Class {row.className} {row.section}</span></div>
                </div>
              </td>
              <td>{formatMetric(row.cgpa)}</td>
              <td>{formatMetric(row.attendancePercentage, 0)}%</td>
              <td>{formatMetric(row.predictedScore)}</td>
              <td><span className={`risk-pill ${String(row.riskLevel).toLowerCase()}`}>{row.riskLevel}</span></td>
              {!compact && <td>{row.recommendation || "No recommendation yet."}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
