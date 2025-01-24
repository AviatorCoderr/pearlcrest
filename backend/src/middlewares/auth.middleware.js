import { ApiError } from "../utils/ApiError.js"
import jwt, { decode } from "jsonwebtoken"
import { Flat } from "../models/flats.model.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { Voter } from "../models/voters.model.js"
import electionOfficer from "../models/Electionofficer.model.js"
const verifyJWT = asyncHandler(async(req, res, next) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const flat = await Flat.findById(decodedToken?._id).select("-password -refreshToken")
        if(!flat){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.flat = flat
        next()
    } catch (error) {
        throw new ApiError(401, "Please go to home page and login again ")
    }
})

const verifyVoter = asyncHandler(async(req, res, next) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const voter = await Voter.findById(decodedToken?._id)
        if(!voter){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.voter = voter
        next()
    } catch (error) {
        throw new ApiError(401, "Please go to home page and login again ")
    }
})

const verifyElectionOfficer = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
      if (!token) {
        throw new ApiError(401, "Unauthorised request")
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
      const officer = await electionOfficer.findById(decodedToken?._id)
      if (!officer) {
        throw new ApiError(401, "Access Denied: Not an election officer")
      }
  
      req.officer = officer
  
      next()
    } catch (error) {
      throw new ApiError(401, "Please go to home page and login again")
    }
  })

export {verifyJWT, verifyVoter, verifyElectionOfficer}