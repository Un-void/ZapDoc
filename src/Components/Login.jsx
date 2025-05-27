import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const LogIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn =
    localStorage.getItem("userId") ||
    localStorage.getItem("doctorToken") ||
    localStorage.getItem("adminToken");

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Log In to{" "}
          <Link className="text-indigo-600 text-3xl" to={"/"}>
            ZapDoc
          </Link>
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 text-gray-600 hover:text-indigo-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || isLoggedIn}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full shadow-lg transition duration-300 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          {isLoggedIn && (
            <div className="text-green-600 text-center mt-4">
              You are already logged in.
            </div>
          )}
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
