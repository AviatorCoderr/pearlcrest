import mongoose, { Schema } from "mongoose";

const complaintSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    closedAt: {
        type: Date
    }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
