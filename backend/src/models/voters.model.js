import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const voterSchema = new mongoose.Schema({
    flatnumber: {
        type: String, 
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mobile:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastLogIn: {
        type: Date
    },
    refreshToken: {
        type: String
    },
});

voterSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            flatnumber: this.flatnumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
voterSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Voter = mongoose.model("Voter", voterSchema);
