import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
const electionOfficerSchema = new mongoose.Schema({
  fullName: {
    type: String, 
    required: true
  },
  email: {
    type: String
  },
  lastLogIn: {
    type: Date
},
refreshToken: {
    type: String
},
});

electionOfficerSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
electionOfficerSchema.methods.generateRefreshToken = async function(){
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

const electionOfficer = mongoose.model('electionOfficer', electionOfficerSchema);

export default electionOfficer;
