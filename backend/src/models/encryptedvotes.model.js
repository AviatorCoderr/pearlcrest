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
  },
});

const EncryptedVotes = mongoose.model('EncryptedVotes', voteSchema);

export default EncryptedVotes;
