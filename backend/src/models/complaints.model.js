import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  flatNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  executiveFlat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  status: { type: String, enum: ['pending', 'in progress', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Complaint', complaintSchema);
