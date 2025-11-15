// src/pages/Projector.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Projector = () => {
  const [projectors, setProjectors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    protocol: "",
    bits: "",
    frequency: "",
  });

  const navigate = useNavigate();
  const API_URL = "/api/projectors";

  useEffect(() => {
    api
      .get(API_URL)
      .then((res) => setProjectors(res.data))
      .catch((err) => console.error("Error fetching projectors:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post(API_URL, {
        name: formData.name,
        protocol: formData.protocol,
        bits: formData.bits,
        frequency: formData.frequency,
      })
      .then((res) => {
        setProjectors([...projectors, res.data]);
        setFormData({ name: "", protocol: "", bits: "", frequency: "" });
        setShowForm(false);
      })
      .catch((err) => console.error("Error adding projector:", err));
  };

  const handleDelete = (id) => {
    api
      .delete(`${API_URL}/${id}`)
      .then(() => setProjectors(projectors.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error deleting projector:", err));
  };

  const handleViewButtons = (id) => {
    if (!id) {
      console.error("handleViewButtons called with undefined id");
      return;
    }
    navigate(`/buttons/${id}`);
  };

  return (
    <div className="p-8 text-black">
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Projector
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
            <h3 className="text-2xl font-bold mb-4">Add New Projector</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="border border-black px-3 py-1 rounded text-black"
              />
              <input
                name="protocol"
                type="text"
                value={formData.protocol}
                onChange={handleChange}
                placeholder="Protocol"
                required
                className="border border-black px-3 py-1 rounded text-black"
              />
              <input
                name="bits"
                type="text"
                value={formData.bits}
                onChange={handleChange}
                placeholder="Bits"
                className="border border-black px-3 py-1 rounded text-black"
              />
              <input
                name="frequency"
                type="text"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Frequency"
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

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-black text-black">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["S.No", "Projector ID", "Name", "Protocol", "Bits", "Frequency", "Buttons", "Action"].map((h) => (
                <th key={h} className="px-4 py-2 border border-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projectors.length ? (
              projectors.map((p, i) => (
                <tr key={p.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border border-black">{i + 1}</td>
                  <td className="px-4 py-2 border border-black">{p.id}</td>
                  <td className="px-4 py-2 border border-black">{p.name}</td>
                  <td className="px-4 py-2 border border-black">{p.protocol}</td>
                  <td className="px-4 py-2 border border-black">{p.bits}</td>
                  <td className="px-4 py-2 border border-black">{p.frequency}</td>
                  <td className="px-4 py-2 border border-black">
                    <button
                      onClick={() => handleViewButtons(p.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      View Buttons
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-black">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-4 py-2 border border-black">
                  No projectors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projector;
