import mongoose, { Schema } from "mongoose"

const candidateSchema = mongoose.Schema({
    flatnumber: {
        type: String,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        uppercase: true,
        trim: true
    },
    aadhar: {
        type: String,
        uppercase: true,
        trim: true
    },
    mobile: {
        type: String,
        uppercase: true
    },
    photo: {
        type: String
    }
})

export const Candidate = mongoose.model("Candidate", candidateSchema)