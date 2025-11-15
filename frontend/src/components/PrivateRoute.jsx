// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Basic JWT parse - does NOT verify signature.
 * Used only for reading payload (expiry/role).
 */
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

/**
 * PrivateRoute expects children (the element) and optional requireAdmin boolean.
 * If requireAdmin === true, it checks payload.role === 'admin' (case-insensitive).
 */
export default function PrivateRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  const payload = parseJwt(token);
  if (!payload) {
    // invalid token format
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  // expiry check (exp is seconds since epoch)
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  if (requireAdmin) {
    const role = (payload.role || "").toLowerCase();
    if (role !== "admin") {
      // you could redirect to a "not authorized" page; for now go home/login
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
