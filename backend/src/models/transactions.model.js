import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
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
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    from_month:{
        type: Date,
        required: true
    },
    to_month: {
        type: Date,
        required: true
    }   
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
