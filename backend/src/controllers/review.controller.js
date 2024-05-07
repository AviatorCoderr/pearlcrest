import {asyncHandler} from "../utils/asynchandler.js"
import { Review } from "../models/review.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const addReview = asyncHandler(async(req, res) => {
    const {flatnumber, name, review} = req.body;
    const response = Review.create({
        flatnumber, name, review
    })
    return res.status(200).json(new ApiResponse(200, response, "Review Added"))
})
const getReview = asyncHandler(async(req, res) => {
    const response = await Review.find();
    return res.status(200).json(new ApiResponse(200, response, "Review recieved"))
})
export {addReview, getReview}