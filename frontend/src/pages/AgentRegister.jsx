// pages/AgentRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAgent } from "../services/authService";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext"; 

const AgentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    latitude: null,
    longitude: null,
  });

  const navigate = useNavigate();
   const { login } = useAuth();
  // Fetch geolocation on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, latitude, longitude }));
        },
        (error) => console.error("Error fetching location:", error.message)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
 
         // ✅ Update AuthContext
         login(response.user); // This updates `user` in context and localStorage
 
         console.log("🔄 Navigating to: /dashboard/agent");
         navigate("/dashboard/agent"); // Navigate to dashboard
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
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative bg-white p-8 shadow-lg rounded-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Agent Registration</h2>
        <p className="text-gray-600 mb-4">Join our network and offer amazing travel experiences.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
            disabled={!formData.latitude || !formData.longitude}
          >
            Register as Agent
          </button>
        </form>
        {!formData.latitude || !formData.longitude ? (
          <p className="text-red-500 mt-4">Fetching location...</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AgentRegister;
