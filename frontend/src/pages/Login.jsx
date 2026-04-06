import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { extractErrorMessage } from "../services/errorUtils";
import { validateLogin } from "../utils/validation";

const highlights = [
  "Institution-ready login experience",
  "Role-aware access for admin and student users",
  "Directly wired to the existing Spring Boot authentication backend"
];

export default function Login() {
  const navigate = useNavigate();
  const { login, sessionMessage, clearSessionMessage } = useAuth();
  const [mode, setMode] = useState("admin");
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const applyPreset = (nextMode) => {
    setMode(nextMode);
    setError("");
    setFieldErrors({});
    clearSessionMessage();
    if (nextMode === "admin") {
      setForm({ username: "admin", password: "admin123" });
      return;
    }
    setForm({ username: "student1", password: "student123" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateLogin(form);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("");
      return;
    }

    setError("");
    setFieldErrors({});
    clearSessionMessage();
    setLoading(true);
    try {
      const data = await login(form);
      navigate(data.role === "ADMIN" ? "/admin" : "/student");
    } catch (err) {
      setError(extractErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <section className="auth-panel">
          <div className="brand">
            <div className="brand-badge">SP</div>
            <div className="brand-copy">
              <strong>Student Performance Analyzer</strong>
              <span>Academic Executive Access</span>
            </div>
          </div>

          <h1>Access the institutional dashboard with a cleaner premium workflow.</h1>
          <p className="muted-copy" style={{ marginTop: "16px" }}>
            Sign in with admin or student credentials to use the existing backend, live data APIs, and role-based
            application flow.
          </p>

          <div className="auth-feature-grid">
            {highlights.map((item) => (
              <article className="auth-feature-card" key={item}>
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="auth-form-panel">
          <span className="section-chip">Secure Access</span>
          <h2 style={{ marginTop: "18px" }}>Welcome back</h2>
          <p className="muted-copy" style={{ marginTop: "10px" }}>
            Use the seeded credentials below or sign in with an existing registered account.
          </p>

          <div className="auth-tabs">
            <button className={`tab-btn ${mode === "admin" ? "active" : ""}`} type="button" onClick={() => applyPreset("admin")}>
              Admin
            </button>
            <button
              className={`tab-btn ${mode === "student" ? "active" : ""}`}
              type="button"
              onClick={() => applyPreset("student")}
            >
              Student
            </button>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            <FormField id="username" label="Username" error={fieldErrors.username}>
              <input
                id="username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                placeholder="Enter username"
                required
              />
            </FormField>

            <div className={`field ${fieldErrors.password ? "field-invalid" : ""}`}>
              <div className="field-inline">
                <label htmlFor="password">Password</label>
                <span className="field-help">Forgot Password?</span>
              </div>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter password"
                required
              />
              {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
            </div>

            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              Keep me logged in for 30 days
            </label>

            {sessionMessage && <div className="notice-box">{sessionMessage}</div>}
            {error && <div className="error-box">{error}</div>}

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="field-help" style={{ marginTop: "18px" }}>
            Need an account? <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Create one here</Link>
          </p>

          <div className="auth-feature-grid" style={{ marginTop: "20px" }}>
            <article className="auth-feature-card">
              <strong>Seed admin</strong>
              <p className="muted-copy">admin / admin123</p>
            </article>
            <article className="auth-feature-card">
              <strong>Seed student</strong>
              <p className="muted-copy">student1 / student123</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
