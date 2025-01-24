import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voter',
    required: true,
  },
  encryptedVotes: {
    type: [String],
    required: true,
  },
  voteTimestamp: {
    type: Date,
    default: Date.now,
  }
});

voteSchema.pre('save', function (next) {
  if (this.isModified('encryptedVotes')) {
    throw new Error('encryptedVotes is immutable and cannot be modified.');
  }
  next();
});

const EncryptedVotes = mongoose.model('EncryptedVotes', voteSchema);

export default EncryptedVotes;
