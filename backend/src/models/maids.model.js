import mongoose from "mongoose";

const maidSchema = new mongoose.Schema({
    flat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    name: {
        type: String,
        required: [true, "Maid's Name is required"],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, "Maid's Mobile is required"],
        trim: true
    },
    aadhar: {
        type: String,
        trim: true
    }
});

const Maid = mongoose.model("Maid", maidSchema);

export default Maid;
