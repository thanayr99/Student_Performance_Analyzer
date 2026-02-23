import { useAuth } from "../context/AuthContext";

export default function Header({ title }) {
  const { username, role, logout } = useAuth();

  return (
    <header className="header">
      <div>
        <h2>{title}</h2>
        <span className="muted">
          {username} ({role})
        </span>
      </div>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
