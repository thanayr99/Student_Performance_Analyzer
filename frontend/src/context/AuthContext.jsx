import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/dataService";
import { clearSession, getStoredSession, persistSession, registerUnauthorizedHandler } from "../services/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const stored = getStoredSession();
  const [token, setToken] = useState(stored.token);
  const [role, setRole] = useState(stored.role);
  const [username, setUsername] = useState(stored.username);
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setToken(null);
      setRole(null);
      setUsername(null);
      setSessionMessage("Your session expired. Please sign in again.");
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    persistSession({ token, role, username });
  }, [token, role, username]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setSessionMessage("");
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    setSessionMessage("");
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setRole(null);
    setUsername(null);
    setSessionMessage("");
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      role,
      username,
      isAuthenticated: Boolean(token),
      sessionMessage,
      clearSessionMessage: () => setSessionMessage(""),
      login,
      register,
      logout
    }),
    [token, role, username, sessionMessage]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
