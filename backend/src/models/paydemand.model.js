import mongoose, { Schema } from "mongoose"

const payDemandSchema = mongoose.Schema({
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