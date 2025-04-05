import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 bg-blue-600 text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left - Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Travel<span className="text-yellow-400">Ease</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/register/customer" className="hover:text-yellow-400">Register</Link>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <FaUserCircle className="text-xl" />
                  <span>{user.name}</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {user.role === "customer" && (
                    <Link to="/dashboard/customer" className="block px-4 py-2 hover:bg-gray-200">
                      Customer Dashboard
                    </Link>
                  )}
                  {user.role === "agent" && (
                    <Link to="/dashboard/agent" className="block px-4 py-2 hover:bg-gray-200">
                      Agent Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white">
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 py-4 space-y-2 text-center">
          <Link to="/" className="block hover:text-yellow-400">Home</Link>
          <Link to="/register/customer" className="block hover:text-yellow-400">Register</Link>
          <Link to="/login" className="block hover:text-yellow-400">Login</Link>

          {user && (
            <>
              {user.role === "customer" && (
                <Link to="/dashboard/customer" className="block hover:text-yellow-400">
                  Customer Dashboard
                </Link>
              )}
              {user.role === "agent" && (
                <Link to="/dashboard/agent" className="block hover:text-yellow-400">
                  Agent Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-center py-2 hover:bg-red-500 hover:text-white">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
