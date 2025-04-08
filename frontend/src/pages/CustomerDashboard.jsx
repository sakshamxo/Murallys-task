// pages/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import { fetchCustomerDashboard } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import socket from "../services/socket";
import {
  bookPackage,
  cancelBooking,
  createRazorpayOrder,
  getBookings,
  verifyRazorpayPayment,
} from "../services/bookingService";
import { MapPin, Loader2, IndianRupee, Moon, Sun } from "lucide-react";

const CustomerDashboard = () => {
  const { location, error, requestLocation } = useGeolocation();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookingId, setLoadingBookingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (location && user?.role === "customer") {
      fetchCustomerDashboard(location.city).then((data) => setPackages(data));
      getBookings().then((data) => setBookings(data));
    }
  }, [location, user]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected ✅");
    });

    socket.on("packageAdded", (newPackage) => {
      if (newPackage.city === location?.city) {
        setPackages((prev) => [...prev, newPackage]);
      }
    });

    return () => {
      socket.off("packageAdded");
      socket.off("connect");
    };
  }, [location]);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleBook = async (packageId) => {
    try {
      await bookPackage(packageId);
      const updatedBookings = await getBookings();
      setBookings(updatedBookings);
      alert("Package added to cart! You can pay from your bookings below.");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book package. Please try again.");
    }
  };

  const handlePayment = async (booking) => {
    setLoadingBookingId(booking._id);

    try {
      const { orderId, amount, currency } = await createRazorpayOrder(
        booking._id,
        booking.packageId.price * 100
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Travel Booking",
        description: `Payment for ${booking.packageId.destination}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verification = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            alert(verification.message);
            const updated = await getBookings();
            setBookings(updated);
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: booking.customerId.name,
          email: booking.customerId.email,
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingBookingId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      alert("Booking cancelled");
      const updated = await getBookings();
      setBookings(updated);
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className={
      `min-h-screen p-8 pt-24 transition-colors duration-300 ease-in-out ` +
      (darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800")
    }>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-extrabold text-center w-full">
            Discover Getaways in Your City
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-6 right-6 p-2 rounded-full shadow bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">Error: {error}</div>
        )}

        {!location && (
          <div className="flex justify-center mb-6">
            <button
              onClick={requestLocation}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md"
            >
              Enable Location
            </button>
          </div>
        )}

        {user?.role !== "customer" ? (
          <div className="text-red-500 text-center text-xl font-semibold">
            Access Denied: You are not authorized to view this page.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className={
                      `rounded-2xl shadow-md hover:shadow-xl overflow-hidden border transition ` +
                      (darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200")
                    }
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                      alt={pkg.destination}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-5">
                      <h2 className="text-2xl font-bold mb-1">
                        {pkg.destination}
                      </h2>
                      <p className="text-sm mb-3">
                        {pkg.description.slice(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-500 flex items-center gap-1">
                          <IndianRupee size={18} /> {pkg.price}
                        </span>
                        <button
                          onClick={() => handleBook(pkg._id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-3">
                  No travel packages available.
                </p>
              )}
            </div>

            <h2 className="text-3xl font-extrabold mb-6">Your Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-center">No bookings yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={
                      `p-6 rounded-xl shadow border transition ` +
                      (darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200")
                    }
                  >
                    <h3 className="text-2xl font-semibold mb-1">
                      {booking.packageId?.destination || "Unknown Destination"}
                    </h3>
                    <p className="mb-1">
                      <strong>Price:</strong> ₹{booking.packageId?.price}
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-medium capitalize ${
                          booking.status === "confirmed"
                            ? "text-green-500"
                            : booking.status === "pending"
                            ? "text-yellow-500"
                            : booking.status === "unpaid"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>

                    {booking.status === "unpaid" && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        disabled={loadingBookingId === booking._id}
                      >
                        {loadingBookingId === booking._id ? (
                          <>
                            <Loader2 className="animate-spin inline mr-2" />
                            Processing...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </button>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
