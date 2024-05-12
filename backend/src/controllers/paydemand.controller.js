import {asyncHandler} from "../utils/asynchandler.js"
import {PayDemand} from "../models/paydemand.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const addPayDemand = asyncHandler(async(req, res) => {
    const {type, amount} = req.body
    console.log(type, amount)
    if(!type || !amount)
        throw new ApiError(400, "one or more fields are empty")
    const response = await PayDemand.create({
        type, 
        amount
    })
    if(!response)
        throw new ApiError(500,"something went wrong")
    return res.status(200).json(new ApiResponse(200, {response}, "added successfully"))
})
const getPayDemand = asyncHandler(async(req, res) => {
    const response = await PayDemand.find()
    console.log(response)
    if(!response)
        throw new ApiError(404,"something went wrong")
    return res.status(200).json(new ApiResponse(200, {response}, "found successfuly"))
})
export {addPayDemand, getPayDemand}