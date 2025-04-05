import express from 'express';
import { cancelBooking, confirmBooking, createBooking, getAgentBookings, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 Create a new booking (Protected, User Only)
router.post('/book', protect, roleBasedAccess(['customer']), createBooking);

// 📌 Get bookings (User gets their own, Agent gets all)
router.get('/get-booking', protect, getBookings);

// 📌 Update booking status (Agent only)
router.put('/status', protect, roleBasedAccess(['agent']), updateBookingStatus);

// �� Cancel a booking (Customer only)
router.put('/cancel/:id', protect, roleBasedAccess(['customer']), cancelBooking);

router.put("/confirm/:id", protect, confirmBooking);

router.get('/agent-bookings', protect, roleBasedAccess(['agent']), getAgentBookings);

export default router;