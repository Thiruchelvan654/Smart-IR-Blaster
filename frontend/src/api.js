// src/api.js
import axios from "axios";

function resolveApiBase() {
  // Prefer Vite -> CRA -> fallback
  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
    (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE) ||
    "http://localhost:5000";

  // Support special keywords
  if (raw === "proxy" || raw === "relative") return "";      // use dev proxy
  if (raw === "auto") return `${location.protocol}//${location.host}`; // same-origin

  // If it's just ":5000"
  if (/^:\d+$/.test(raw)) {
    return `${location.protocol}//${location.hostname}${raw}`;
  }

  // If it's just "5000"
  if (/^\d+$/.test(raw)) {
    return `${location.protocol}//${location.hostname}:${raw}`;
  }

  // Absolute http(s) URL -> use as-is
  if (/^https?:\/\//i.test(raw)) return raw;

  // Otherwise treat as relative base (e.g., "/api")
  return raw;
}

const API_BASE = resolveApiBase();

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
