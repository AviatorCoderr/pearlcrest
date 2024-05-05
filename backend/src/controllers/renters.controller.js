import {asyncHandler} from "../utils/asynchandler.js"
import { Renter } from "../models/renters.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
// add renter details
const addRenter = asyncHandler(async (req, res) => {
    const data = req.body
    for(const renterData of data){
        const { name, mobile, aadhar, email, spouse_name, spouse_mobile, flat } = renterData;
        // if ([name, mobile, aadhar, email, spouse_name, spouse_mobile].some((field) => !field || field.trim() === "")){
        //     throw new ApiError(401, "All fields are required");
        // }
        if (!flat || !Array.isArray(flat) || flat.length === 0) {
            throw new ApiError(401, "Flat field is required and should be a non-empty array of strings");
        }
        const existingRenter = await Renter.findOne({ name })
        if(existingRenter){
            throw new ApiError(409, "Renter already exists")
        }
        // Check if any owner already has the provided flat ID
        const flattaken = await Renter.findOne({ flat: { $in: flat } });
        if (flattaken) {
            throw new ApiError(409, "Flat is already associated with another owner");
        }

        const renter = await Renter.create({
            name,
            mobile,
            aadhar,
            email,
            spouse_name,
            spouse_mobile,
            flat
        })
        if (!renter) {
            throw new ApiError();
        }
    }
})
//update renter details by admin
const updateAdminRenter = asyncHandler(async (req, res) => {
    const { name, mobile, aadhar, email, spouse_name, spouse_mobile} = req.body
    const renter = await Renter.findOne({mobile})
    console.log(renter)
    if(!renter){
        throw new ApiError(401, "Renter for this flat not exists")
    }
    renter.name = name
    renter.mobile = mobile
    renter.aadhar = aadhar
    renter.email = email
    renter.spouse_name = spouse_name
    renter.spouse_mobile = spouse_mobile
    await renter.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new ApiResponse(200, {renter}, "Owner details updated"))
})
//update renter if logged in
const updateRenter = asyncHandler(async (req, res) => {
    try {
        const { _id, name, mobile, aadhar, email, spouse_name, spouse_mobile } = req.body;
        const flatid = req?.flat._id
        console.log(_id)
        let renter
        if(!_id){
            renter = await Renter.create({
                flat: flatid,
                name, 
                mobile, 
                aadhar, 
                email,
                spouse_name,
                spouse_mobile
            })
        }
        else{
            renter = await Renter.findOne({_id})
            console.log(renter)
            if(!renter){
                throw new ApiError(401, "Renter for this flat not exists")
            }
            console.log(renter)
            renter.name = name
            renter.mobile = mobile
            renter.aadhar = aadhar
            renter.email = email
            renter.spouse_name = spouse_name
            renter.spouse_mobile = spouse_mobile
            await renter.save({validateBeforeSave: false})
        }
        return res
        .status(200)
        .json(new ApiResponse(200, {renter}, "Owner details updated"))
    } catch (error) {
        console.log(error.message)
    }
})
const getRenter = asyncHandler(async (req, res) => {
    const loggedIn = req?.flat._id.toString()
    const renter = await Renter.findOne({flat: {$in: loggedIn}})
    res.status(200)
    .json(new ApiResponse(200, renter, "Renter data recieved"))
})


export {addRenter, updateRenter, updateAdminRenter, getRenter}