import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js';
import TravelPackage from '../models/Package.js';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 📌 Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Missing bookingId or amount' });
    }

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment order creation failed', error: error.message });
  }
};

// 📌 Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    console.log("🟡 Incoming verification data:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("🔐 Generated Signature:", generated_signature);
    console.log("🔐 Received Signature:", razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("✅ Razorpay Payment Status:", payment.status);

    if (payment.status !== "captured") {
      return res.status(400).json({ message: `Payment not captured. Status: ${payment.status}` });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "paid";
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    console.log("✅ Booking marked as paid");

    res.json({ success: true, message: "Payment verified and booking updated" });
  } catch (error) {
    console.error("🔥 Error in verifyPayment:", error);
    res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};


// 📌 Create Booking + Return Razorpay Payment Link (Optional)
export const createPayment = async (req, res) => {
  try {
    const { packageId } = req.body;

    const travelPackage = await TravelPackage.findById(packageId);
    if (!travelPackage) return res.status(404).json({ message: 'Package not found' });

    const booking = new Booking({
      customerId: req.user._id,
      packageId,
      status: 'unpaid',
    });
    await booking.save();

    const paymentLink = await razorpay.paymentLink.create({
      amount: travelPackage.price * 100,
      currency: 'INR',
      accept_partial: false,
      description: `Booking for ${travelPackage.destination}`,
      customer: {
        name: req.user.name,
        email: req.user.email,
      },
      notify: {
        sms: false,
        email: true,
      },
      reminder_enable: true,
      reference_id: booking._id.toString(),
      callback_url: `${process.env.FRONTEND_URL}/payment-success`,
      callback_method: 'get',
    });

    res.status(201).json({
      success: true,
      paymentLink: paymentLink.short_url,
      bookingId: booking._id,
    });

  } catch (error) {
    console.error('Payment link creation failed:', error);
    res.status(500).json({ message: 'Payment link creation failed', error: error.message });
  }
};