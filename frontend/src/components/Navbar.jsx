import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full bg-white text-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
              Travel<span className="text-yellow-500">Ease</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>

              {!user && (
                <>
                  <Link to="/register/customer" className="hover:text-blue-600 transition">Register</Link>
                  <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
                </>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 hover:text-blue-600 transition focus:outline-none"
                  >
                    <FaUserCircle className="text-xl" />
                    <span>{user.name}</span>
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                      {user.role === "customer" && (
                        <Link
                          to="/dashboard/customer"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Customer Dashboard
                        </Link>
                      )}
                      {user.role === "agent" && (
                        <Link
                          to="/dashboard/agent"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Agent Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2 text-center">
            <Link to="/" className="block py-2 hover:text-blue-600">Home</Link>

            {!user && (
              <>
                <Link to="/register/customer" className="block py-2 hover:text-blue-600">Register</Link>
                <Link to="/login" className="block py-2 hover:text-blue-600">Login</Link>
              </>
            )}

            {user && (
              <>
                {user.role === "customer" && (
                  <Link to="/dashboard/customer" className="block py-2 hover:text-blue-600">
                    Customer Dashboard
                  </Link>
                )}
                {user.role === "agent" && (
                  <Link to="/dashboard/agent" className="block py-2 hover:text-blue-600">
                    Agent Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer below Navbar to avoid overlap */}
      <div className="pt-16" />
    </>
  );
};

export default Navbar;
