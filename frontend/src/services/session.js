const SESSION_KEYS = {
  token: "token",
  role: "role",
  username: "username"
};

let unauthorizedHandler = null;

export function getStoredSession() {
  return {
    token: localStorage.getItem(SESSION_KEYS.token),
    role: localStorage.getItem(SESSION_KEYS.role),
    username: localStorage.getItem(SESSION_KEYS.username)
  };
}

export function persistSession({ token, role, username }) {
  if (token) {
    localStorage.setItem(SESSION_KEYS.token, token);
  } else {
    localStorage.removeItem(SESSION_KEYS.token);
  }

  if (role) {
    localStorage.setItem(SESSION_KEYS.role, role);
  } else {
    localStorage.removeItem(SESSION_KEYS.role);
  }

  if (username) {
    localStorage.setItem(SESSION_KEYS.username, username);
  } else {
    localStorage.removeItem(SESSION_KEYS.username);
  }
}

export function clearSession() {
  persistSession({ token: null, role: null, username: null });
}

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function handleUnauthorized() {
  clearSession();
  if (typeof unauthorizedHandler === "function") {
    unauthorizedHandler();
  }
}
