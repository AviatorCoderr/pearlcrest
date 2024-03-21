import mongoose, { Schema } from "mongoose"

const flatSchema = mongoose.Schema({
    flatnumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    currentstay: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
        trim: true
    }
})

export const Flat = mongoose.model("Flat", flatSchema)