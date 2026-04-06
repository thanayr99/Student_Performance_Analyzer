function normalize(value) {
  return String(value ?? "").trim();
}

function addError(errors, field, message) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

export function validateLogin(values) {
  const errors = {};
  const username = normalize(values.username);
  const password = normalize(values.password);

  if (!username) addError(errors, "username", "Username is required.");
  if (username && username.length < 3) addError(errors, "username", "Username must be at least 3 characters.");
  if (!password) addError(errors, "password", "Password is required.");
  if (password && password.length < 6) addError(errors, "password", "Password must be at least 6 characters.");

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegistration(values, options = {}) {
  const { requirePassword = true } = options;
  const errors = {};
  const username = normalize(values.username);
  const password = normalize(values.password);
  const confirmPassword = normalize(values.confirmPassword);
  const name = normalize(values.name);
  const className = normalize(values.className);
  const section = normalize(values.section);
  const isStudent = values.role === "STUDENT";

  if (!username) addError(errors, "username", "Username is required.");
  if (username && username.length < 3) addError(errors, "username", "Username must be at least 3 characters.");
  if (requirePassword && !password) addError(errors, "password", "Password is required.");
  if (password && password.length < 6) addError(errors, "password", "Password must be at least 6 characters.");
  if ((requirePassword || password) && !confirmPassword) addError(errors, "confirmPassword", "Please confirm the password.");
  if (password && confirmPassword && password !== confirmPassword) {
    addError(errors, "confirmPassword", "Passwords do not match.");
  }
  if (!name) addError(errors, "name", "Display name is required.");

  if (isStudent) {
    if (!className) addError(errors, "className", "Class is required for students.");
    if (!section) addError(errors, "section", "Section is required for students.");
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStudent(values, requirePassword = true) {
  const errors = {};
  const username = normalize(values.username);
  const password = normalize(values.password);
  const name = normalize(values.name);
  const className = normalize(values.className);
  const section = normalize(values.section);

  if (!username) addError(errors, "username", "Username is required.");
  if (username && username.length < 3) addError(errors, "username", "Username must be at least 3 characters.");
  if (requirePassword && !password) addError(errors, "password", "Password is required.");
  if (password && password.length < 6) addError(errors, "password", "Password must be at least 6 characters.");
  if (!name) addError(errors, "name", "Full name is required.");
  if (!className) addError(errors, "className", "Class is required.");
  if (!section) addError(errors, "section", "Section is required.");

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSubject(values) {
  const errors = {};
  const name = normalize(values.name);
  const credits = Number(values.credits);

  if (!name) addError(errors, "name", "Subject name is required.");
  if (!Number.isInteger(credits) || credits < 1 || credits > 10) {
    addError(errors, "credits", "Credits must be a whole number between 1 and 10.");
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegistrationAdmin(values, options = {}) {
  const result = validateRegistration({
    ...values,
    confirmPassword: values.confirmPassword ?? values.password
  }, options);
  return result;
}
