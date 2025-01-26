import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['ongoing', 'finished', 'not started', 'declared'],
    default: 'not started',
  },
});

const Election = mongoose.model('Election', electionSchema);

export default Election;
