//scr/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";
import { toast } from "react-hot-toast";
import { FaUser, FaLock, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import bgImage from "../assets/mountains.jpg";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    latitude: null,
    longitude: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
          setLocationError("Location permission denied.");
          setLocationLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setLocationError("Geolocation not supported.");
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
      login(res.user);
      localStorage.setItem("token", res.token);
      toast.success("Login successful!");

      const redirectTo = location.state?.from?.pathname ||
        (res.user.role === "customer"
          ? "/dashboard/customer"
          : res.user.role === "agent"
          ? "/dashboard/agent"
          : "/");

      navigate(redirectTo);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {(loading || locationLoading) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <FaSpinner className="text-white text-4xl animate-spin" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-0"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 shadow-2xl rounded-3xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 drop-shadow-md">
          Welcome Back
        </h2>
        <p className="text-center text-gray-700 mb-6 text-sm">
          Ready for your next adventure?
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2 shadow-inner bg-white">
            <FaUser className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-inner bg-white">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 focus:outline-none ml-2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {locationError && (
            <p className="text-red-500 text-xs text-center">{locationError}</p>
          )}

          <button
            type="submit"
            disabled={!formData.latitude || !formData.longitude || loading}
            className={`w-full py-3 rounded-full text-white text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg backdrop-blur-md ${
              !formData.latitude || !formData.longitude || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin inline-block mr-2" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4">
        
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          {locationLoading ? (
            <span className="text-yellow-500 animate-pulse">Fetching location...</span>
          ) : (
            <span className="text-green-600">Location detected ✅</span>
          )}
        </p>

        <p className="text-center mt-5 text-sm text-gray-800">
          Don't have an account? {" "}
          <a
            href="/register/customer"
            className="text-blue-700 font-medium hover:underline transition"
          >
            Register here
          </a>
        </p>
      </div>

      {/* Subtle Animated Background Blur Circles */}
      <div className="absolute w-60 h-60 bg-blue-400 rounded-full top-[-100px] right-[-100px] blur-3xl opacity-30 animate-float"></div>
      <div className="absolute w-60 h-60 bg-pink-400 rounded-full bottom-[-100px] left-[-100px] blur-3xl opacity-30 animate-float delay-300"></div>
    </div>
  );
};

export default Login;
