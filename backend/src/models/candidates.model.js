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
    post: {
        type:String,
        uppercase: true,
        trim: true
    },
    votes:{
        type: Number,
        default: 0
    }
})

export const Candidate = mongoose.model("Candidate", candidateSchema)