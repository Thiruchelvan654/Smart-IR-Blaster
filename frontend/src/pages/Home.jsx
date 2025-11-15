// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "/api/logs";

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_URL);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatIndianDateTime = (utcString) => {
    if (!utcString) return "—";
    try {
      const date = new Date(utcString);
      if (isNaN(date.getTime())) return utcString;
      return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return String(utcString);
    }
  };

  const fmtDuration = (d) => {
    if (d == null) return "—";
    if (typeof d === "string" || typeof d === "number") return String(d);
    if (typeof d === "object") {
      const h = d.hours ?? 0;
      const m = d.minutes ?? 0;
      const s = d.seconds ?? 0;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const ss = String(s).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }
    return String(d);
  };

  const deleteLog = async (session_id) => {
    if (!session_id) return;
    if (!window.confirm("Delete this log?")) return;
    try {
      await api.delete(`${API_URL}/${session_id}`);
      setLogs((prev) => prev.filter((s) => s.session_id !== session_id));
    } catch (err) {
      console.error("Error deleting log:", err);
      alert(err?.response?.data?.message || "Failed to delete log.");
    }
  };

  return (
    <div className="p-8 text-black">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Session Logs</h2>
        {loading && <span className="text-gray-600">Loading…</span>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 border">S.No</th>
              <th className="px-4 py-2 border">Staff Name</th>
              <th className="px-4 py-2 border">Classroom</th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((s, i) => (
                <tr key={s.session_id ?? `${i}-${s.start_time}`} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border">{s.staff_name ?? "—"}</td>
                  <td className="px-4 py-2 border">{s.classroom_name ?? "—"}</td>
                  <td className="px-4 py-2 border">{formatIndianDateTime(s.start_time)}</td>
                  <td className="px-4 py-2 border">{formatIndianDateTime(s.end_time)}</td>
                  <td className="px-4 py-2 border">{fmtDuration(s.duration)}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => deleteLog(s.session_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-4 py-2 border">
                  {loading ? "Loading…" : "No logs found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
