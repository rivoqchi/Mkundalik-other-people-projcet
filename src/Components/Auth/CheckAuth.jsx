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
    const token = localStorage.getItem("token"); // string token
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`; // faqat string
    const response = await fetch(`${API}${url}`, {
      method: "GET",
      headers,
      credentials: "include"
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
export const signout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    next?.();
    return getRequest("/auth/signout");
  }
};

// ❌ isAuthenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const jwt = localStorage.getItem("token");
  return jwt ? JSON.parse(jwt) : false;
};

// ❌ fetchRole
    export const fetchRole = async () => {
      const token = localStorage.getItem("jwt"); // <--- Haqiqiy kalit nomini ishlatib ko'ring
      if (!token) return null;
      const data = await getRequest("/auth", token);
      return data?.message || null;
    };
    

// ❌ auth (GET request, body yo‘q)
    export const auth = async () => {
      const jwt = localStorage.getItem("jwt"); // <--- jwt kalitidan oling
      const token = jwt ? JSON.parse(jwt).token : null; // Agar JWT obyekti ichida token bo'lsa
      if (!token) return null; // Token topilmasa, so'rov yubormang
      return await getRequest("/auth", token);
    };