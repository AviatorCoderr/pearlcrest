import mongoose from "mongoose"
const otpelectionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
})

const otpelection = mongoose.model("otpelection", otpelectionSchema)
export default otpelection