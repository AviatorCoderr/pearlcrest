import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    numofpeople: {
        type: Number,
        default: 1
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
        enum: ["relative", "delivery", "staff"]
    },
    checkin: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkout: {
        type: Date
    }
});

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
