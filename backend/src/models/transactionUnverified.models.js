import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    transactionId: {
        type: String,
        trim: true,
        uppercase: true,
        unique: true
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
    date: {
        type: Date,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    months: [{
        type: String,
        required: true
    }]
});

const UnTransaction = mongoose.model("UnTransaction", transactionSchema);

export default UnTransaction;
