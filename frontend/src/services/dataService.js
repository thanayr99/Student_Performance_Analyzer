import api from "./api";
import { mockStore } from "./mockStore";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const authService = {
  login: async (credentials) => {
    if (useMock) return mockStore.login(credentials);
    const { data } = await api.post("/auth/login", credentials);
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
  deleteStudent: async (id) => (useMock ? mockStore.deleteStudent(id) : api.delete(`/admin/students/${id}`)),
  createSubject: async (payload) => (useMock ? mockStore.createSubject(payload) : api.post("/admin/subjects", payload)),
  deleteSubject: async (id) => (useMock ? mockStore.deleteSubject(id) : api.delete(`/admin/subjects/${id}`)),
  createRegistration: async (payload) =>
    useMock ? mockStore.createRegistration(payload) : api.post("/admin/registrations", payload),
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
  }
};
