import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['ongoing', 'finished'],
    default: 'ongoing',
  },
});

const Election = mongoose.model('Election', electionSchema);

export default Election;
