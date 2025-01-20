import { ApiError } from "../utils/ApiError.js"
import jwt, { decode } from "jsonwebtoken"
import { Flat } from "../models/flats.model.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { Voter } from "../models/voters.model.js"

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
      // Get the token from cookies or Authorization header
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
      if (!token) {
        throw new ApiError(401, "Unauthorised request")
      }
  
      // Decode the token
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
      // Find the election officer using the decoded token's ID (assuming the officer's ID is stored in the token)
      const officer = await ElectionOfficer.findById(decodedToken?._id)
      if (!officer) {
        throw new ApiError(401, "Access Denied: Not an election officer")
      }
  
      // Attach the officer details to the request object
      req.officer = officer
  
      // Proceed to the next middleware or route handler
      next()
    } catch (error) {
      throw new ApiError(401, "Please go to home page and login again")
    }
  })

export {verifyJWT, verifyVoter, verifyElectionOfficer}