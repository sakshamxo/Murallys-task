import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String },
}, { timestamps: true });

const TravelPackage = mongoose.model('TravelPackage', packageSchema);
export default TravelPackage;