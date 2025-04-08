// pages/AgentDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addPackage } from "../services/packageService";
import { fetchAgentDashboard } from "../services/authService";
import {
  fetchAgentBookings,
  updateBookingStatus,
} from "../services/bookingService";

const AgentDashboard = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    destination: "",
    price: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'add' | 'bookings'

  useEffect(() => {
    if (activeTab === "dashboard") fetchPackages();
    if (activeTab === "bookings") fetchBookings();
  }, [activeTab]);

  const fetchPackages = async () => {
    try {
      const data = await fetchAgentDashboard();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch agent packages", error);
      setPackages([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await fetchAgentBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      setBookings([]);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "confirmed");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "confirmed" } : b
        )
      );
     
    } catch (error) {
      console.error("Error confirming booking", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPackage = await addPackage(formData);
      setPackages([...packages, newPackage]);
      setFormData({ destination: "", price: "", description: "" });
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Failed to add package", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed w-64 h-full bg-white shadow-md p-6 border-r border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 mb-12 tracking-tight">Agent Panel</h2>
        <ul className="space-y-6">
          {[
            { label: '🗂️ Dashboard', tab: 'dashboard' },
            { label: '➕ Add Package', tab: 'add' },
            { label: '✅ Confirm Bookings', tab: 'bookings' }
          ].map(({ label, tab }) => (
            <li
              key={tab}
              className={`cursor-pointer text-lg font-medium transition ${
                activeTab === tab ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {label}
            </li>
          ))}
        </ul>
      </aside>
  
      {/* Main Content */}
      <main className="ml-64 w-full p-10">
        {activeTab === "add" ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Add New Travel Package</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  Submit Package
                </button>
              </form>
            </div>
          </div>
        ) : activeTab === "bookings" ? (
          <>
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Booking Requests</h3>
            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
                    <h4 className="text-xl font-semibold mb-3 text-blue-600">
                      {booking.packageId.destination}
                    </h4>
                    <p><strong>Customer:</strong> {booking.customerId.name} ({booking.customerId.email})</p>
                    <p><strong>Price:</strong> ₹{booking.packageId.price}</p>
                    <p><strong>Description:</strong> {booking.packageId.description}</p>
                    <p className="mt-2">
                      <strong>Status:</strong>{" "}
                      <span className={`ml-2 font-semibold ${
                        booking.status === "paid" ? "text-green-600" : "text-red-600"
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </p>
  
                    {booking.status === "paid" && (
                      <button
                        onClick={() => handleConfirm(booking._id)}
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                      >
                        Confirm Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No booking requests available.</p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Your Travel Packages</h3>
            {packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition border border-gray-200"
                  >
                    <h4 className="text-xl font-bold text-blue-600">{pkg.destination}</h4>
                    <p className="text-gray-700 mt-2">{pkg.description}</p>
                    <p className="mt-3 font-semibold text-gray-800">₹{pkg.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No packages found</p>
            )}
          </>
        )}
      </main>
    </div>
  );
  
};

export default AgentDashboard;
