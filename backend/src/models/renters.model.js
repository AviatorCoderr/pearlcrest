import mongoose, {Schema} from "mongoose";

const renterSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    name: {
        type: String,
        uppercase: true,
        trim: true
    },
    mobile: {
        type: String,
        uppercase: true,
        trim: true
    },
    aadhar: {
        type: String,
        uppercase: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    spouse_name: {
        type: String,
        uppercase: true
    },
    spouse_mobile: {
        type: String,
        uppercase: true
    }
});

export const Renter = mongoose.model("Renter", renterSchema);

