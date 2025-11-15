// src/pages/User.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

const User = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    role: "",
    designation: "",
    mail: "",
  });

  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post("/api/users", {
        name: formData.name,
        staff_id: formData.staffId,
        role: formData.role,
        designation: formData.designation,
        mail: formData.mail,
      })
      .then((res) => {
        setUsers([...users, res.data]);
        setFormData({ staffId: "", name: "", role: "", designation: "", mail: "" });
        setShowForm(false);
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  const handleDelete = (id) => {
    api
      .delete(`/api/users/${id}`)
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error("Error deleting user:", err));
  };

  return (
    <div className="p-8 text-black">
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
            <h3 className="text-2xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {["staffId", "name", "role", "designation", "mail"].map((field) => (
                <input
                  key={field}
                  type={field === "mail" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                  className="border border-black px-3 py-1 rounded text-black"
                />
              ))}

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
              <th className="px-4 py-2 border border-black">S.No</th>
              <th className="px-4 py-2 border border-black">Staff ID</th>
              <th className="px-4 py-2 border border-black">Name</th>
              <th className="px-4 py-2 border border-black">Role</th>
              <th className="px-4 py-2 border border-black">Designation</th>
              <th className="px-4 py-2 border border-black">Mail</th>
              <th className="px-4 py-2 border border-black">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u, i) => (
                <tr key={u.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 border border-black">{i + 1}</td>
                  <td className="px-4 py-2 border border-black">{u.staff_id}</td>
                  <td className="px-4 py-2 border border-black">{u.name}</td>
                  <td className="px-4 py-2 border border-black">{u.role}</td>
                  <td className="px-4 py-2 border border-black">{u.designation}</td>
                  <td className="px-4 py-2 border border-black">{u.mail}</td>
                  <td className="px-4 py-2 border border-black">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-4 py-2 border border-black">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
