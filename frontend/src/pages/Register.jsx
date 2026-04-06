import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { extractErrorMessage } from "../services/errorUtils";
import { validateRegistration } from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    name: "",
    className: "",
    section: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRegistration(form);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setError("");
      return;
    }

    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
        role: form.role,
        name: form.name.trim(),
        className: form.role === "STUDENT" ? form.className.trim() : "",
        section: form.role === "STUDENT" ? form.section.trim() : ""
      };
      const data = await register(payload);
      navigate(data.role === "ADMIN" ? "/admin" : "/student");
    } catch (err) {
      setError(extractErrorMessage(err, "Registration failed"));
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
              <span>Registration Access</span>
            </div>
          </div>

          <h1>Create an account that is already wired to the live backend.</h1>
          <p className="muted-copy" style={{ marginTop: "16px" }}>
            This registration page uses the existing `/auth/register` backend endpoint, stores the returned token, and
            redirects the user into the matching role-based dashboard.
          </p>

          <div className="auth-feature-grid">
            <article className="auth-feature-card">
              <strong>Student registration</strong>
              <p className="muted-copy">Creates a learner account with name, class, and section fields.</p>
            </article>
            <article className="auth-feature-card">
              <strong>Admin registration</strong>
              <p className="muted-copy">Allows direct creation of an administrative account without backend changes.</p>
            </article>
            <article className="auth-feature-card">
              <strong>Immediate sign-in</strong>
              <p className="muted-copy">The backend returns a token, and the app logs the user in automatically.</p>
            </article>
          </div>
        </section>

        <section className="auth-form-panel">
          <span className="section-chip">Registration</span>
          <h2 style={{ marginTop: "18px" }}>Create your account</h2>
          <p className="muted-copy" style={{ marginTop: "10px" }}>
            Keep the backend as-is while upgrading the frontend experience for account creation.
          </p>

          <form className="form-stack" style={{ marginTop: "28px" }} onSubmit={handleSubmit}>
            <div className="form-grid two">
              <FormField id="reg-username" label="Username" error={fieldErrors.username}>
                <input
                  id="reg-username"
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  placeholder="Choose username"
                  required
                />
              </FormField>

              <FormField id="reg-password" label="Password" error={fieldErrors.password}>
                <input
                  id="reg-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Create password"
                  required
                />
              </FormField>
            </div>

            <div className="form-grid two">
              <FormField id="reg-confirm-password" label="Confirm Password" error={fieldErrors.confirmPassword}>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                  placeholder="Re-enter password"
                  required
                />
              </FormField>

              <FormField id="reg-role" label="Role">
                <select
                  id="reg-role"
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value,
                      className: event.target.value === "STUDENT" ? form.className : "",
                      section: event.target.value === "STUDENT" ? form.section : ""
                    })
                  }
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </FormField>
            </div>

            <div className="form-grid two">
              <FormField id="reg-name" label="Display Name" error={fieldErrors.name}>
                <input
                  id="reg-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Full name"
                />
              </FormField>
              <div className="field">
                <label htmlFor="reg-role-summary">Access Profile</label>
                <div className="field-readonly" id="reg-role-summary">
                  {form.role === "STUDENT" ? "Student account with academic profile" : "Admin account with control access"}
                </div>
              </div>
            </div>

            <div className="form-grid two">
              <FormField
                id="reg-class"
                label="Class"
                error={fieldErrors.className}
                help={form.role !== "STUDENT" ? "Student-only field" : ""}
              >
                <input
                  id="reg-class"
                  value={form.className}
                  onChange={(event) => setForm({ ...form, className: event.target.value })}
                  placeholder="Class"
                  disabled={form.role !== "STUDENT"}
                />
              </FormField>

              <FormField
                id="reg-section"
                label="Section"
                error={fieldErrors.section}
                help={form.role !== "STUDENT" ? "Student-only field" : ""}
              >
                <input
                  id="reg-section"
                  value={form.section}
                  onChange={(event) => setForm({ ...form, section: event.target.value })}
                  placeholder="Section"
                  disabled={form.role !== "STUDENT"}
                />
              </FormField>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="field-help" style={{ marginTop: "18px" }}>
            Already registered? <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Go to login</Link>
          </p>

          <div className="auth-feature-grid" style={{ marginTop: "20px" }}>
            <article className="auth-feature-card">
              <strong>Backend wired</strong>
              <p className="muted-copy">Uses the existing auth registration endpoint without changing backend logic.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
