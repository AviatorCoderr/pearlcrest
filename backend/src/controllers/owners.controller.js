import {asyncHandler} from "../utils/asynchandler.js"
import { Owner } from "../models/owners.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import bcrypt from "bcrypt"
// add owner details
const addOwner = asyncHandler(async (req, res) => {
    const data = req.body
    for(const ownerData of data){
        const { name, mobile, aadhar, email, spouse_name, spouse_mobile, flat } = ownerData;
        // if ([name, mobile, aadhar, email, spouse_name, spouse_mobile].some((field) => !field || field.trim() === "")){
        //     throw new ApiError(401, "All fields are required");
        // }
        if (!flat || !Array.isArray(flat) || flat.length === 0) {
            throw new ApiError(401, "Flat field is required and should be a non-empty array of strings");
        }
        const existingOwner = await Owner.findOne({ mobile: {$eq: mobile}})
        if(existingOwner){
            throw new ApiError(409, "Owner already exists")
        }
        // Check if any owner already has the provided flat ID
        const flattaken = await Owner.findOne({ flat: { $in: flat } });
        if (flattaken) {
            throw new ApiError(409, "Flat is already associated with another owner");
        }

        const owner = await Owner.create({
            name,
            mobile,
            aadhar,
            email,
            spouse_name,
            spouse_mobile,
            flat
        });
        if (!owner) {
            throw new ApiError();
        }
    }
})
//update owner details by admin
const updateAdminOwner = asyncHandler(async (req, res) => {
    const { name, mobile, aadhar, email, spouse_name, spouse_mobile} = req.body
    const owner = await Owner.findOne({mobile})
    console.log(owner)
    if(!owner){
        throw new ApiError(401, "Owner for this flat not exists")
    }
    owner.name = name
    owner.mobile = mobile
    owner.aadhar = aadhar
    owner.email = email
    owner.spouse_name = spouse_name
    owner.spouse_mobile = spouse_mobile
    await owner.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new ApiResponse(200, {owner}, "Owner details updated"))
})
//update owner if logged in
const updateOwner = asyncHandler(async (req, res) => {
    const { name, mobile, aadhar, email, spouse_name, spouse_mobile } = req.body;
    const loggedInFlat = req?.flat._id.toString()
    console.log(loggedInFlat)
    const owner = await Owner.findOne({flat: {$in: loggedInFlat}})
    console.log(owner)
    if(!owner){
        throw new ApiError(401, "Owner for this flat not exists")
    }
    console.log(owner)
    owner.name = name
    owner.mobile = mobile
    owner.aadhar = aadhar
    owner.email = email
    owner.spouse_name = spouse_name
    owner.spouse_mobile = spouse_mobile
    await owner.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new ApiResponse(200, {owner}, "Owner details updated"))
})

export {addOwner, updateOwner, updateAdminOwner}