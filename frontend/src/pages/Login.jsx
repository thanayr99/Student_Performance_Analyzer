import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fill = (role) => {
    if (role === "admin") setForm({ username: "admin", password: "admin123" });
    else setForm({ username: "student1", password: "student123" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      navigate(data.role === "ADMIN" ? "/admin" : "/student");
    } catch (err) {
      setError(err?.message || err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand">Student Performance Analytics</div>
        <h1>Dashboard Access</h1>
        <p>Seeded frontend demo mode for review. Backend integration can be switched with one flag.</p>
        <div className="quick-row">
          <button type="button" className="ghost-btn" onClick={() => fill("admin")}>
            Use Admin Seed
          </button>
          <button type="button" className="ghost-btn" onClick={() => fill("student")}>
            Use Student Seed
          </button>
        </div>
        <form onSubmit={handleSubmit} className="stack">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Signing in..." : "Enter Dashboard"}
          </button>
        </form>
        <small>Seed credentials: admin/admin123, student1/student123</small>
      </div>
    </div>
  );
}
