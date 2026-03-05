import { API } from '../../config';

// POST requests
const postRequest = async (url, body) => {
  try {
    const response = await fetch(`${API}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include" // cookie bilan ishlash uchun
    });
    return await response.json();
  } catch (err) {
    console.error(`POST ${url} xatolik:`, err);
    return null;
  }
};

// GET requests
const getRequest = async (url) => {
  try {
    const response = await fetch(`${API}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include" // ✅ Sends httpOnly cookies automatically
    });
    return await response.json();
  } catch (err) {
    console.error(`GET ${url} xatolik:`, err);
    return null;
  }
};


// ❌ Signup
export const signup = (user) => postRequest("/auth/signup", user);

// ❌ SignIn
export const signIn = (user) => postRequest("/auth/login", user);

// ❌ Create Employee
export const createEmployee = (employee) => postRequest("/auth/create/newemployee", employee);

// ❌ New Admin
export const newAdmin = (user) => postRequest("/auth/addnewadmin", user);

// ❌ Signout
export const signout = async (next) => {
  if (typeof window !== "undefined") {
    await getRequest("/auth/logout");
    window.localStorage.clear();
    next?.();
  }
};

// ❌ isAuthenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("isSignedIn") === "true";
};

// ❌ fetchRole
export const fetchRole = async () => {
  const data = await getRequest("/auth");
  if (data?.error) {
    window.localStorage.clear();
    return null;
  }
  return data?.role || window.localStorage.getItem("role");
};


// ❌ auth (Backend profile check)
export const auth = async () => {
  return await getRequest("/auth");
};
