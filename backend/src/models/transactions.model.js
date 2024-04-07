import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    transactionId: {
        type: String,
        trim: true,
        required: true
    },
    mode: {
        type: String,
        required: true,
        trim: true,
        enum: ['online', 'cash']
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
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    months: [{
        type: String,
        required: true
    }]
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
