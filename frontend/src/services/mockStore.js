const STORE_KEY = "spa_mock_store_v1";

const initialState = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "ADMIN",
      profile: { name: "Sasha Groen", className: "Faculty", section: "A" }
    },
    {
      id: 2,
      username: "student1",
      password: "student123",
      role: "STUDENT",
      profile: { name: "John Carter", className: "10", section: "A" }
    }
  ],
  subjects: [
    { id: 1, name: "Mathematics", credits: 4 },
    { id: 2, name: "Science", credits: 3 },
    { id: 3, name: "English", credits: 3 },
    { id: 4, name: "Computer", credits: 4 }
  ],
  students: [
    { id: 1, username: "student1", name: "John Carter", className: "10", section: "A", attendance: 82, gpa: 7.6 },
    { id: 2, username: "emma", name: "Emma Watson", className: "10", section: "B", attendance: 73, gpa: 7.1 },
    { id: 3, username: "david", name: "David Lee", className: "9", section: "A", attendance: 58, gpa: 5.2 },
    { id: 4, username: "mira", name: "Mira Khan", className: "11", section: "C", attendance: 91, gpa: 8.4 }
  ],
  studentMarks: {
    student1: [
      { id: 1, subject: "Mathematics", marks: 78, examType: "QUIZ", semester: 1, date: "2026-01-15" },
      { id: 2, subject: "Science", marks: 74, examType: "MIDTERM", semester: 1, date: "2026-01-30" },
      { id: 3, subject: "English", marks: 81, examType: "FINAL", semester: 1, date: "2026-02-15" }
    ]
  }
};

function readStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(initialState));
    return structuredClone(initialState);
  }
  const parsed = JSON.parse(raw);
  const repaired = ensureSeedIntegrity(parsed);
  if (repaired.__changed) {
    delete repaired.__changed;
    writeStore(repaired);
  }
  return repaired;
}

function writeStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function ensureSeedIntegrity(data) {
  const clone = structuredClone(data);
  let changed = false;

  if (!clone.users.some((u) => u.username === "admin")) {
    clone.users.unshift({
      id: nextId(clone.users),
      username: "admin",
      password: "admin123",
      role: "ADMIN",
      profile: { name: "Sasha Groen", className: "Faculty", section: "A" }
    });
    changed = true;
  }

  if (!clone.users.some((u) => u.username === "student1")) {
    clone.users.push({
      id: nextId(clone.users),
      username: "student1",
      password: "student123",
      role: "STUDENT",
      profile: { name: "John Carter", className: "10", section: "A" }
    });
    changed = true;
  }

  if (!clone.students.some((s) => s.username === "student1")) {
    clone.students.unshift({
      id: nextId(clone.students),
      username: "student1",
      name: "John Carter",
      className: "10",
      section: "A",
      attendance: 82,
      gpa: 7.6
    });
    changed = true;
  }

  if (changed) clone.__changed = true;
  return clone;
}

function nextId(items) {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

function riskFrom(student) {
  if (student.gpa < 5 || student.attendance < 60) return "HIGH";
  if (student.gpa <= 7) return "MEDIUM";
  return "LOW";
}

function adminAnalytics(data) {
  const totalStudents = data.students.length;
  const classAverageGpa =
    Math.round((data.students.reduce((sum, s) => sum + s.gpa, 0) / Math.max(totalStudents, 1)) * 100) / 100;
  const highRiskStudents = data.students.filter((s) => riskFrom(s) === "HIGH").length;
  const topPerformers = [...data.students]
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 5)
    .map((s) => ({ studentId: s.id, studentName: s.name, gpa: s.gpa }));

  return {
    totalStudents,
    classAverageGpa,
    highRiskStudents,
    topPerformers,
    subjectDifficultyIndex: {
      Mathematics: 26,
      Science: 32,
      English: 21,
      Computer: 19
    }
  };
}

const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 120));

export const mockStore = {
  async login({ username, password }) {
    const db = readStore();
    const user = db.users.find((u) => u.username === username && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return delay({
      token: `mock-token-${user.username}`,
      username: user.username,
      role: user.role
    });
  },

  async getAdminDashboard() {
    const db = readStore();
    return delay({
      students: db.students,
      subjects: db.subjects,
      registrations: db.users.map((u) => {
        const stu = db.students.find((s) => s.username === u.username);
        return {
          id: u.id,
          username: u.username,
          role: u.role,
          studentId: stu?.id ?? null,
          studentName: stu?.name ?? null,
          className: stu?.className ?? null,
          section: stu?.section ?? null
        };
      }),
      analytics: adminAnalytics(db),
      riskReport: db.students
        .map((s) => ({
          studentId: s.id,
          name: s.name,
          gpa: s.gpa,
          attendance: s.attendance,
          riskLevel: riskFrom(s)
        }))
        .filter((r) => r.riskLevel !== "LOW")
    });
  },

  async createStudent(payload) {
    const db = readStore();
    if (db.users.some((u) => u.username === payload.username)) throw new Error("Username already exists");
    const studentId = nextId(db.students);
    const userId = nextId(db.users);
    db.students.push({
      id: studentId,
      username: payload.username,
      name: payload.name,
      className: payload.className,
      section: payload.section,
      attendance: 75,
      gpa: 6.8
    });
    db.users.push({
      id: userId,
      username: payload.username,
      password: payload.password,
      role: "STUDENT",
      profile: { name: payload.name, className: payload.className, section: payload.section }
    });
    writeStore(db);
    return delay(true);
  },

  async deleteStudent(id) {
    const db = readStore();
    const target = db.students.find((s) => s.id === id);
    db.students = db.students.filter((s) => s.id !== id);
    if (target) db.users = db.users.filter((u) => u.username !== target.username);
    writeStore(db);
    return delay(true);
  },

  async createSubject(payload) {
    const db = readStore();
    db.subjects.push({ id: nextId(db.subjects), name: payload.name, credits: Number(payload.credits) });
    writeStore(db);
    return delay(true);
  },

  async deleteSubject(id) {
    const db = readStore();
    db.subjects = db.subjects.filter((s) => s.id !== id);
    writeStore(db);
    return delay(true);
  },

  async createRegistration(payload) {
    const db = readStore();
    if (db.users.some((u) => u.username === payload.username)) throw new Error("Username already exists");
    db.users.push({
      id: nextId(db.users),
      username: payload.username,
      password: payload.password,
      role: payload.role,
      profile: {
        name: payload.name || payload.username,
        className: payload.className || "10",
        section: payload.section || "A"
      }
    });
    if (payload.role === "STUDENT") {
      db.students.push({
        id: nextId(db.students),
        username: payload.username,
        name: payload.name || payload.username,
        className: payload.className || "10",
        section: payload.section || "A",
        attendance: 76,
        gpa: 6.9
      });
    }
    writeStore(db);
    return delay(true);
  },

  async deleteRegistration(id) {
    const db = readStore();
    const target = db.users.find((u) => u.id === id);
    if (!target) return delay(true);
    if (target.username === "admin") {
      throw new Error("Seed admin cannot be deleted in demo mode");
    }
    db.users = db.users.filter((u) => u.id !== id);
    if (target?.role === "STUDENT") {
      db.students = db.students.filter((s) => s.username !== target.username);
    }
    writeStore(db);
    return delay(true);
  },

  async getStudentDashboard(username) {
    const db = readStore();
    const student = db.students.find((s) => s.username === username) || db.students[0];
    const marks = db.studentMarks[student.username] || [];
    const analytics = {
      gpa: student.gpa,
      attendancePercentage: student.attendance,
      predictedScore: 79.3,
      riskLevel: riskFrom(student),
      improvementIndex: 0.5,
      trendSlope: 1.2,
      subjectAverages: [
        { subject: "Mathematics", averageMarks: 78.2 },
        { subject: "Science", averageMarks: 72.6 },
        { subject: "English", averageMarks: 80.4 },
        { subject: "Computer", averageMarks: 84.1 }
      ],
      recommendation: "Great consistency. Focus on Science practice sets and keep attendance above 80%."
    };

    return delay({
      profile: {
        id: student.id,
        username: student.username,
        name: student.name,
        className: student.className,
        section: student.section
      },
      marks,
      analytics
    });
  }
};
