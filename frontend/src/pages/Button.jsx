// src/pages/Button.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

const Button = () => {
  const { projectorId } = useParams();
  const [buttons, setButtons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", hexCode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectorId) {
      navigate("/projector");
      return;
    }
    fetchButtons();
  }, [projectorId]);

  const fetchButtons = async () => {
    try {
      const res = await api.get(`/api/buttons/projector/${projectorId}`);
      setButtons(res.data);
    } catch (err) {
      console.error("Error fetching buttons:", err);
      setButtons([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/buttons", {
        name: formData.name,
        hex_code: formData.hexCode,
        projector_id: Number(projectorId),
        row: null,
        column: null,
        column_span: null,
        colour: null,
      });
      setButtons((prev) => [...prev, res.data]);
      setFormData({ name: "", hexCode: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding button:", err);
      alert(err?.response?.data?.message || "Failed to add button.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this button?")) return;
    try {
      await api.delete(`/api/buttons/${id}`);
      setButtons((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting button:", err);
      alert(err?.response?.data?.message || "Failed to delete button.");
    }
  };

  return (
    <div className="p-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">
        {`Projector ${projectorId}`} ({projectorId})
      </h1>

      <div className="flex justify-start mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Button
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
            <h3 className="text-2xl font-bold mb-4">Add New Button</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="border border-black px-3 py-1 rounded text-black"
              />
              <input
                name="hexCode"
                value={formData.hexCode}
                onChange={handleChange}
                placeholder="Hex Code"
                required
                className="border border-black px-3 py-1 rounded text-black"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full border border-black text-black">
        <thead className="bg-blue-600 text-white">
          <tr>
            {["S.No", "Name", "Hex Code", "Action"].map((header) => (
              <th key={header} className="px-4 py-2 border border-black">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buttons.length ? (
            buttons.map((btn, idx) => (
              <tr key={btn.id} className="text-center hover:bg-gray-100">
                <td className="border border-black px-4 py-2">{idx + 1}</td>
                <td className="border border-black px-4 py-2">{btn.name}</td>
                <td className="border border-black px-4 py-2">{btn.hex_code}</td>
                <td className="border border-black px-4 py-2">
                  <button
                    onClick={() => handleDelete(btn.id)}
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
                No buttons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/projector")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Projector List
        </button>
      </div>
    </div>
  );
};

export default Button;
