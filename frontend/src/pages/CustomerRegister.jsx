// pages/CustomerRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/authService";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext"; 
import { motion } from "framer-motion";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    latitude: null,
    longitude: null,
  });

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Fetched location:", latitude, longitude);
          setFormData((prev) => ({ ...prev, latitude, longitude }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setLoadingLocation(false);
          setError("Failed to get location. Please enable location services.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoadingLocation(false);
      setError("Geolocation is not supported by this browser.");
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
      const response = await registerCustomer(formData);
      if (response?.message === "Customer registration successful") {
        login(response.user);
        navigate("/dashboard/customer");
      } else {
        console.error("❌ Unexpected response format:", response);
      }
    } catch (error) {
      console.error("❌ Registration failed", error.response?.data);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black opacity-60 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white p-10 shadow-2xl rounded-3xl max-w-lg w-full text-center backdrop-blur-lg bg-opacity-90"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight drop-shadow-md">Join as a Customer</h2>
        {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input 
            whileFocus={{ scale: 1.02 }} 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          />

          <motion.input 
            whileFocus={{ scale: 1.02 }} 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          />

          <motion.input 
            whileFocus={{ scale: 1.02 }} 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
          />

          <motion.button 
            whileTap={{ scale: 0.95 }} 
            type="submit" 
            disabled={loadingLocation} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
          >
            {loadingLocation ? "Fetching location..." : "Register Now"}
          </motion.button>
        </form>

        <p className="text-gray-600 mt-4 text-sm">Already have an account? <a href="/login" className="text-blue-500 font-medium hover:underline">Login here</a></p>
      </motion.div>
    </div>
  );
};

export default CustomerRegister;
