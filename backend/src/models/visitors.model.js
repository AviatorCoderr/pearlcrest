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
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    checkin: {
        type: String,
        required: true
    },
    checkout: {
        type: String
    }
});

export const Visitor = mongoose.model("Visitor", visitorSchema);
