import mongoose from "mongoose";

const maidSchema = new mongoose.Schema({
    flat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    aadhar: {
        type: String,
        trim: true
    },
    checkin: {
        type: Date
    },
    checkout: {
        type: Date
    }
});

const Maid = mongoose.model("Maid", maidSchema);

export default Maid;
