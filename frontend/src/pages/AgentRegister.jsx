// pages/AgentRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAgent } from "../services/authService";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const AgentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    latitude: null,
    longitude: null,
  });

  const [loadingLocation, setLoadingLocation] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, latitude, longitude }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setLoadingLocation(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerAgent(formData);

      if (response?.message === "Agent registration successful") {
        console.log("✅ Registration successful:", response);
        login(response.user);
        navigate("/dashboard/agent");
      } else {
        console.error("❌ Unexpected response format:", response);
      }
    } catch (error) {
      console.error("❌ Registration failed", error.response?.data);
    }
  };

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm"></div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white/20 backdrop-blur-lg border border-white/30 p-10 shadow-2xl rounded-2xl max-w-md w-full text-center text-white"
      >
        <h2 className="text-4xl font-extrabold mb-2 drop-shadow-md">Agent Registration</h2>
        <p className="text-gray-200 mb-6">Join our network and offer amazing travel experiences.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loadingLocation}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition duration-300 disabled:opacity-60"
          >
            {loadingLocation ? "Fetching location..." : "Register as Agent"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AgentRegister;
