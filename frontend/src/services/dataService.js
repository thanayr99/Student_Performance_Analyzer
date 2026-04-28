import api from "./api";
import { mockStore } from "./mockStore";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const authService = {
  login: async (credentials) => {
    if (useMock) return mockStore.login(credentials);
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  }
};

export const dashboardService = {
  getAdminDashboard: async () => {
    if (useMock) return mockStore.getAdminDashboard();
    const [studentsRes, subjectsRes, registrationsRes, analyticsRes, riskRes] = await Promise.all([
      api.get("/admin/students"),
      api.get("/admin/subjects"),
      api.get("/admin/registrations"),
      api.get("/admin/analytics"),
      api.get("/admin/risk-report")
    ]);
    return {
      students: studentsRes.data,
      subjects: subjectsRes.data,
      registrations: registrationsRes.data,
      analytics: analyticsRes.data,
      riskReport: riskRes.data
    };
  },
  createStudent: async (payload) => (useMock ? mockStore.createStudent(payload) : api.post("/admin/students", payload)),
  updateStudent: async (id, payload) =>
    (useMock ? mockStore.updateStudent(id, payload) : api.put(`/admin/students/${id}`, payload)),
  deleteStudent: async (id) => (useMock ? mockStore.deleteStudent(id) : api.delete(`/admin/students/${id}`)),
  createSubject: async (payload) => (useMock ? mockStore.createSubject(payload) : api.post("/admin/subjects", payload)),
  updateSubject: async (id, payload) =>
    (useMock ? mockStore.updateSubject(id, payload) : api.put(`/admin/subjects/${id}`, payload)),
  deleteSubject: async (id) => (useMock ? mockStore.deleteSubject(id) : api.delete(`/admin/subjects/${id}`)),
  createRegistration: async (payload) =>
    useMock ? mockStore.createRegistration(payload) : api.post("/admin/registrations", payload),
  updateRegistration: async (id, payload) =>
    (useMock ? mockStore.updateRegistration(id, payload) : api.put(`/admin/registrations/${id}`, payload)),
  deleteRegistration: async (id) =>
    useMock ? mockStore.deleteRegistration(id) : api.delete(`/admin/registrations/${id}`),
  getStudentDashboard: async (username) => {
    if (useMock) return mockStore.getStudentDashboard(username);
    const [profileRes, marksRes, analyticsRes] = await Promise.all([
      api.get("/student/profile"),
      api.get("/student/marks"),
      api.get("/student/analytics")
    ]);
    return {
      profile: profileRes.data,
      marks: marksRes.data,
      analytics: analyticsRes.data
    };
  },
  getTeacherDashboard: async () => {
    if (useMock) return mockStore.getTeacherDashboard();
    const [studentsRes, subjectsRes, performanceRes] = await Promise.all([
      api.get("/teacher/students"),
      api.get("/teacher/subjects"),
      api.get("/teacher/performance")
    ]);
    return {
      students: studentsRes.data,
      subjects: subjectsRes.data,
      performance: performanceRes.data
    };
  },
  createTeacherStudent: async (payload) =>
    useMock ? mockStore.createStudent(payload) : api.post("/teacher/students", payload),
  deleteTeacherStudent: async (id) =>
    useMock ? mockStore.deleteStudent(id) : api.delete(`/teacher/students/${id}`),
  addTeacherMarks: async (payload) =>
    useMock ? mockStore.addMarks(payload) : api.post("/teacher/marks", payload),
  addTeacherAttendance: async (payload) =>
    useMock ? mockStore.addAttendance(payload) : api.post("/teacher/attendance", payload)
};
