// src/pages/Classroom.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", projectorId: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = "/api/class";

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      const res = await api.get(API_URL);
      setClassrooms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
      setClassrooms([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      projector_id:
        formData.projectorId === "" || formData.projectorId == null
          ? null
          : Number(formData.projectorId),
    };

    if (!payload.name) {
      alert("Please enter a classroom name.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(API_URL, payload);
      setClassrooms((prev) => [...prev, res.data]);
      setFormData({ name: "", projectorId: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding classroom:", err);
      alert(err?.response?.data?.message || "Failed to add classroom.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this classroom?")) return;
    try {
      await api.delete(`${API_URL}/${id}`);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting classroom:", err);
      alert(err?.response?.data?.message || "Failed to delete classroom.");
    }
  };

  return (
    <div className="p-8 text-black">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Classrooms</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Classroom
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
            <h3 className="text-2xl font-bold mb-4">Add New Classroom</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Classroom name"
                required
                className="border border-black px-3 py-2 rounded bg-white text-black placeholder-gray-500"
              />
              <input
                name="projectorId"
                value={formData.projectorId}
                onChange={handleChange}
                placeholder="Projector ID (numeric, optional)"
                className="border border-black px-3 py-2 rounded bg-white text-black placeholder-gray-500"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", projectorId: "" });
                  }}
                  className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-black text-black">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["S.No", "Name", "Projector ID", "Action"].map((h) => (
                <th key={h} className="px-4 py-2 border border-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {classrooms.length ? (
              classrooms.map((c, i) => (
                <tr key={c.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border border-black">{i + 1}</td>
                  <td className="px-4 py-2 border border-black">{c.name}</td>
                  <td className="px-4 py-2 border border-black">
                    {c.projector_id ?? "—"}
                  </td>
                  <td className="px-4 py-2 border border-black">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-2 border border-black">
                  No classrooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classroom;
