import {asyncHandler} from "../utils/asynchandler.js"
import {PayDemand} from "../models/paydemand.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const addPayDemand = asyncHandler(async(req, res) => {
    const {type, amount} = req.body
    const response = await PayDemand.create({
        type, 
        amount
    })
    if(!response)
        throw new ApiError(500,"something went wrong")
    return res.status(200, new ApiResponse(200, {response}, "added successfully"))
})
const getPayDemand = asyncHandler(async(req, res) => {
    const response = await PayDemand.find()
    if(!response)
        throw new ApiError(500,"something went wrong")
    return res.status(200, new ApiResponse(200, {response}, "added successfuly"))
})
export {addPayDemand, getPayDemand}