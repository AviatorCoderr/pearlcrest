import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter',
    required: true,
  },
  auditTimestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    type: String,
    enum: ['Logged In', 'Voted', 'Vote Receipt Generated', 'Vote Decrypted'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const AuditLog = mongoose.model('AuditLog', auditSchema);

export default AuditLog;
