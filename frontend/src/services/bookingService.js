// src/services/bookingService.js
import axiosInstance from './axiosInstance';

// 📦 Book a package (Customer only)
export const bookPackage = async (packageId) => {
  const res = await axiosInstance.post(`/api/bookings/book`, { packageId });
  return res.data;
};

// 📥 Get all bookings (customer gets their own, agent gets all)
export const getBookings = async () => {
  const res = await axiosInstance.get(`/api/bookings/get-booking`);
  return res.data;
};

// // ✅ Agent: Update booking status
// export const updateBookingStatus = async (bookingId, status) => {
//   await axiosInstance.put(`/api/bookings/status`, { bookingId, status });
// };

// ❌ Customer: Cancel booking
export const cancelBooking = async (bookingId) => {
  const response = await axiosInstance.put(`/api/bookings/cancel/${bookingId}`);
  return response.data;
};

// 📄 Get booking by ID
export const getBookingById = async (id) => {
  const res = await axiosInstance.post(`/api/bookings/bookingId/${id}`);
  return res.data;
};

// 💰 Create Razorpay Order (for frontend checkout flow)
export const createRazorpayOrder = async (bookingId, amount) => {
  const res = await axiosInstance.post("/api/payment/order", {
    bookingId,
    amount,
    currency: "INR",
  });
  return res.data;
};

// 🔐 Verify Razorpay payment (after user completes checkout)
export const verifyRazorpayPayment = async (paymentData) => {
  const res = await axiosInstance.post("/api/payment/verify", paymentData);
  return res.data;
};

// 🧾 (Optional) Create booking + payment link (if you use payment link flow)
export const createRazorpayPaymentLink = async (packageId) => {
  const res = await axiosInstance.post("/api/payment/pay", { packageId });
  return res.data;
};

export const fetchAgentBookings = async () => {
  const res = await axiosInstance.get("/api/bookings/agent-bookings"); // adjust endpoint
  return res.data;
};

export const updateBookingStatus = async (id) => {
  const res = await axiosInstance.put(`/api/bookings/confirm/${id}`);
  return await res.data;
};