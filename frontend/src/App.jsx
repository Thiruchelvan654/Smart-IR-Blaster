// src/App.jsx
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import User from "./pages/User";
import Projector from "./pages/Projector";
import Classroom from "./pages/Classroom";
import Button from "./pages/Button";
import Login from "./pages/Login";
import ForceChangePassword from "./pages/ForceChangePassword";

import PrivateRoute from "./components/PrivateRoute";
import api from "./api";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 detect current route
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      setUser(u);
      const token = localStorage.getItem("token");
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      api.defaults.headers.common["Authorization"] = "";
    } catch (e) {}
    setUser(null);
    navigate("/", { replace: true });
  };

  // 👇 hide navbar on login and force-change pages
  const hideNavbar = ["/", "/force-change"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && (
        <>
          <b className="m-8 text-5xl text-blue-500 flex justify-center">
            Admin Panel
          </b>

          <nav className="m-8 p-4 bg-blue-600 text-3xl text-white flex items-center gap-8 justify-between">
            <div className="flex gap-8 items-center">
              <Link
                to="/home"
                className="hover:text-yellow-300 hover:underline transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/user"
                className="hover:text-yellow-300 hover:underline transition duration-300"
              >
                User
              </Link>
              <Link
                to="/projector"
                className="hover:text-yellow-300 hover:underline transition duration-300"
              >
                Projector
              </Link>
              <Link
                to="/classroom"
                className="hover:text-yellow-300 hover:underline transition duration-300"
              >
                Classroom
              </Link>
            </div>

            <div className="flex items-center gap-6">
              {user?.name && (
                <span className="text-lg hidden md:inline">Hi, {user.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-lg"
              >
                Logout
              </button>
            </div>
          </nav>
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route
          path="/force-change"
          element={
            <PrivateRoute>
              <ForceChangePassword />
            </PrivateRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path="/projector"
          element={
            <PrivateRoute>
              <Projector />
            </PrivateRoute>
          }
        />
        <Route
          path="/classroom"
          element={
            <PrivateRoute>
              <Classroom />
            </PrivateRoute>
          }
        />
        <Route
          path="/buttons/:projectorId"
          element={
            <PrivateRoute>
              <Button />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
