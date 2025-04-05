//scr/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { toast } from "react-hot-toast";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  // Fetch geolocation on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, latitude, longitude }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          toast.error("Failed to get location. Enable location services.");
          setLocationLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setLocationLoading(false);
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
    setLoading(true);
    try {
      const res = await loginUser(formData);
      console.log("Login successful! Response:", res);
  
      login(res.user); // ✅ updates context and localStorage
      localStorage.setItem("token", res.token); // ✅ store token
  
      toast.success("Login successful!");
  
      // ✅ Now navigate
      if (res.user.role === "customer") {
        navigate("/dashboard/customer");
      } else if (res.user.role === "agent") {
        navigate("/dashboard/agent");
      } else {
        toast.error("Unknown user role");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
    style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-8 shadow-lg rounded-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>
        <p className="text-center text-gray-600 mb-4">Explore the world with us!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <FaUser className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full outline-none p-2 bg-transparent"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <FaLock className="text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full outline-none p-2 bg-transparent"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white text-lg font-semibold transition ${
              !formData.latitude || !formData.longitude || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={!formData.latitude || !formData.longitude || loading}
          >
            {loading ? <FaSpinner className="animate-spin inline-block mr-2" /> : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {locationLoading ? (
            <span className="text-red-500">Fetching location...</span>
          ) : (
            <span className="text-green-600">Location detected ✅</span>
          )}
        </p>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/register/customer" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;