import mongoose, { Schema } from "mongoose"

const payDemandSchema = new mongoose.Schema({
    type: {
        type: String,
        uppercase: true,
        trim: true
    },
    amount: {
        type: Number,
        trim: true
    }
})

export const PayDemand = mongoose.model("PayDemand", payDemandSchema)