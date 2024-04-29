import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    mode: {
        type: String,
        uppercase: true
    },
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
