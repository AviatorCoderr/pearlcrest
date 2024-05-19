import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
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
    },
    refreshToken: {
        type: String
    },
    lastLogIn: {
        type: String
    },
    deviceToken: [{
        type: String
    }]
})
flatSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10);
})
flatSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
flatSchema.methods.generateAccessToken = async function(){
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
flatSchema.methods.generateRefreshToken = async function(){
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
export const Flat = mongoose.model("Flat", flatSchema)