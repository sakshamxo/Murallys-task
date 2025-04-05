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

const CustomerDashboard = () => {
  const { location, error, requestLocation } = useGeolocation();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingBookingId, setLoadingBookingId] = useState(null);
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
      // const booking = await bookPackage(packageId);
      // setBookings((prev) => [...prev, booking]);
      // alert("Package added to cart! You can pay from your bookings below.");
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
    setLoadingBookingId(booking._id); // only this booking will show processing

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
      setLoadingBookingId(null); // reset specific booking loading state
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Explore Travel Packages in Your City
        </h1>

        {error && (
          <div className="text-red-500 text-center mb-4">Error: {error}</div>
        )}

        {!location && (
          <div className="flex justify-center mb-6">
            <button
              onClick={requestLocation}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-200"
                  >
                    <h2 className="text-2xl font-bold text-indigo-700 mb-2">
                      {pkg.destination}
                    </h2>
                    {/* <p className="mt-2 text-sm text-gray-500">
                      Provided by:{" "}
                      <span className="font-semibold text-black">
                        {pkg.agentId?.name || "Unknown Agent"}
                      </span>
                    </p> */}
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-green-600">
                        ₹{pkg.price}
                      </span>

                      <button
                        onClick={() => handleBook(pkg._id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-3">
                  No travel packages available.
                </p>
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Your Bookings
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center">No bookings yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white p-5 rounded-xl shadow border"
                  >
                    <h3 className="text-xl font-semibold text-blue-800 mb-1">
                      {booking.packageId?.destination || "Unknown Destination"}
                    </h3>
                    <p className="text-gray-700 mb-1">
                      <strong>Price:</strong> ₹{booking.packageId?.price}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-medium ${
                          booking.status === "confirmed"
                            ? "text-green-600"
                            : booking.status === "pending"
                            ? "text-yellow-600"
                            : booking.status === "unpaid"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>

                    {booking.status === "unpaid" && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        disabled={loadingBookingId === booking._id}
                      >
                        {loadingBookingId === booking._id
                          ? "Processing..."
                          : "Pay Now"}
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
