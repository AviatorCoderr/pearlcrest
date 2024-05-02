import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Maid from "../models/maids.model.js";
import {Flat} from "../models/flats.model.js"
import mongoose from "mongoose";

const addMaidByFlat = asyncHandler(async(req, res) =>  {
    const {flatnumber, name, mobile, aadhar} = req.body
    const flat = await Flat.findOne({flatnumber})
    const flatid = flat._id
    const existingMaid = await Maid.find({mobile})
    let response
    if(existingMaid){
        const flatworking = existingMaid.flatid
        const newflatworking = [...flatworking, flatid]
        const maidId = existingMaid._id
        response = await Maid.updateOne({maidId}, {$set: {flat: newflatworking}})
    }
    else{
        const newflatworking = [flatid]
        response = await Maid.create({
            flat: newflatworking,
            name, 
            mobile,
            aadhar
        })
    }
    res.status(200).json(new ApiResponse(200, {response}, "Maid data updated"))
})
const addMaid = asyncHandler(async (req, res) => {
    const { flatnumber, name, mobile, aadhar } = req.body;
    const existingMaid = await Maid.find({ mobile });
    if (existingMaid.length > 0) {
        throw new ApiError(400, "Maid already exists");
    }
    let flatidList = [];
    for (const element of flatnumber) {
        const flat = await Flat.findOne({ flatnumber: element });
        const flatid = flat._id;
        flatidList.push(flatid);
    }
    const response = await Maid.create({
        flat: flatidList,
        name,
        mobile,
        aadhar
    });

    res.status(200).json(new ApiResponse(200, { response }, "Maid added"));
});
const getAllMaid = asyncHandler(async (req, res) => {
    const response = await Maid.find().populate('flat')
    const Maidlist = response.map((record) => {
        const flatnumber = record.flat
        console.log(flatnumber)
        Maidlist = [...record._doc, flatnumber]
    })
    res.status(200).json(new ApiResponse(200, { Maidlist }, "Maid added"));
});
export {addMaidByFlat, addMaid, getAllMaid}