import mongoose from "mongoose"
const otpverificationSchema = new mongoose.Schema({
    userId: {
        type: String
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

const otpverification = mongoose.model("otpverification", otpverificationSchema)
export default otpverification