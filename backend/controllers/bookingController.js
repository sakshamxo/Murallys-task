// travel-booking-app/backend/controllers/bookingController.js
import Booking from '../models/Booking.js';
import TravelPackage from '../models/Package.js';

// 📌 Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { packageId } = req.body;
    const travelPackage = await TravelPackage.findById(packageId);
    
    if (!travelPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const booking = new Booking({ 
      customerId: req.user._id, 
      packageId, 
      status: 'unpaid' 
    });

    await booking.save();

    // Redirect user to payment with necessary details
    res.status(201).json({ 
      success: true, 
      bookingId: booking._id, 
      amount: travelPackage.price * 100, // Convert to paise for Razorpay
      currency: "INR",
      message: 'Booking initiated. Proceed to payment'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// 📌 Get bookings based on role
export const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'agent') {
      bookings = await Booking.find().populate('packageId customerId');
    } else {
      bookings = await Booking.find({ customerId: req.user._id }).populate('packageId');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 Confirm or Cancel a booking (Agent only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// �� Cancel a booking (Customer only)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Cancellation failed', error: error.message });
  }
};

// ✅ Confirm Booking (only allowed after payment is marked)
export const confirmBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "paid") {
      return res.status(400).json({ message: "Booking must be paid before confirmation" });
    }

    booking.status = "confirmed";
    await booking.save();

    console.log("✅ Booking confirmed:", bookingId);
    res.json({ success: true, message: "Booking confirmed successfully" });
  } catch (error) {
    console.error("🔥 Error in confirmBooking:", error);
    res.status(500).json({ message: "Error confirming booking", error: error.message });
  }
};

// In controllers/bookingController.js
export const getAgentBookings = async (req, res) => {
  try {
    const packages = await TravelPackage.find({ agentId: req.user._id }).select('_id');
    const packageIds = packages.map(pkg => pkg._id);

    const bookings = await Booking.find({ packageId: { $in: packageIds } })
      .populate('packageId')
      .populate('customerId', 'name email');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agent bookings', error: error.message });
  }
};