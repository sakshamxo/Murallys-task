import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage', required: true },
  status: { type: String, enum: ['unpaid', 'pending', 'paid', 'cancelled','confirmed'], default: 'unpaid' },
  paymentId: { type: String },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;