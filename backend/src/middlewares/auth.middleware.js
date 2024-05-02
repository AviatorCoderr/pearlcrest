import { ApiError } from "../utils/ApiError.js"
import jwt, { decode } from "jsonwebtoken"
import { Flat } from "../models/flats.model.js"
import { asyncHandler } from "../utils/asynchandler.js"

export const verifyJWT = asyncHandler(async(req, res, next) =>{
    try {
        console.log("hello i am inside error page")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        console.log("token recieved")
        if(!token){
            throw new ApiError(401, "Unauthorised request")
        }
        console.log("debugging")
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("jwt verified")
        const flat = await Flat.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("flat receieved")
        if(!flat){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.flat = flat
        console.log("flat assigned")
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})