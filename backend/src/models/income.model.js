import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
    mode: {
        type: String,
        uppercase: true
    },
    purpose: {
        type: String,
        trim: true,
        uppercase: true
    },
    amount: {
        type: Number,
        min: 0
    },
    createdAt: {
        type: String,
        required: true,
        default: new Date()
    }
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
