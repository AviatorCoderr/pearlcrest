import mongoose from "mongoose";

const facilityReservationSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    transactionUn: { type: mongoose.Schema.Types.ObjectId, ref: 'UnTransaction' },
    purpose: {
        type: String,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        trim: true,
        uppercase: true
    },
    dates: [{
        type: Date
    }],
    verified: {
        type: Boolean,
        default: false
    }
});

const Facility = mongoose.model("Facility", facilityReservationSchema);

export default Facility;
