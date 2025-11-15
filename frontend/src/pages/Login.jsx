// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { staff_id: staffId, password });
      const { token, name, message, forceChange } = res.data || {};
      if (!token) throw new Error("No token returned from server");

      // Save token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, staff_id: staffId }));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect if default password
      if (forceChange) {
        navigate("/force-change", { replace: true });
        return;
      }

      alert(message || "Login successful");
      navigate("/home", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Staff ID */}
          <label className="block">
            <span className="text-sm text-gray-700">Staff ID</span>
            <input
              type="text"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500"
              placeholder="Enter your Staff ID"
              required
              autoFocus
            />
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500"
              placeholder="Enter your Password"
              required
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
