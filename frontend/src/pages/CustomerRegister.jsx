// pages/CustomerRegister.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/authService";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext"; 

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
  // Fetch geolocation on component mount
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

  // useEffect(() => {
  //   console.log("Updated formData:", formData);
  // }, [formData]);

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
        console.log("✅ Registration successful:", response);

        // ✅ Update AuthContext
        login(response.user); // This updates `user` in context and localStorage

        console.log("🔄 Navigating to: /dashboard/customer");
        navigate("/dashboard/customer"); // Navigate to dashboard
      } else {
        console.error("❌ Unexpected response format:", response);
      }
    } catch (error) {
      console.error("❌ Registration failed", error.response?.data);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative bg-white p-8 shadow-lg rounded-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Customer Registration</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded" />
          
          <button type="submit" disabled={loadingLocation} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition">
            {loadingLocation ? "Fetching location..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;
