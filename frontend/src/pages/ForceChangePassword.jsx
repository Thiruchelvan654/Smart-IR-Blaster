// src/pages/ForceChangePassword.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ForceChangePassword() {
  const [staffId, setStaffId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Populate staffId if available in token payload or localStorage user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.staff_id) setStaffId(user.staff_id);
    // also try to decode token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.staff_id) setStaffId(payload.staff_id);
      } catch (e) {}
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!staffId || !oldPassword || !newPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      // POST to change password endpoint in your backend.
      // Your backend changePassword expects { staff_id, oldpassword, newpassword }.
      await api.post("/api/users/change-password", {
        staff_id: staffId,
        oldpassword: oldPassword,
        newpassword: newPassword,
      });

      alert("Password changed successfully. Please login with the new password.");
      // clear stored token/user to force re-login (good practice)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Change password error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Change Default Password
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Staff ID</span>
            <input
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring"
              required
              disabled={!!staffId}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Old (current) Password</span>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Confirm New Password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
