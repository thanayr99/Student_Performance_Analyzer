import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/dataService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [token, role, username]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setRole(data.role);
    setUsername(data.username);
    return data;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      username,
      isAuthenticated: Boolean(token),
      login,
      logout
    }),
    [token, role, username]
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
