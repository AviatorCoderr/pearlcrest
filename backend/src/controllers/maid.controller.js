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
    try {
        const { flatnumber, name, mobile, aadhar } = req.body;
        const existingMaid = await Maid.find({ mobile });
        if (existingMaid.length > 0) {
            throw new ApiError(400, "Maid already exists");
        }
        console.log(flatnumber)
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
    } catch (error) {
        console.log(error.message)
    }
});
const getAllMaid = asyncHandler(async (req, res) => {
    try {
        const response = await Maid.find().populate('flat');
        const Maidlist = await Promise.all(response.map(async (record) => {
            const flatnumber = record.flat.flatnumber;
            const isCheckin = await isMaidCheckedIn(record._id);
            return { ...record._doc, flatnumber, checkedin: isCheckin };
        }));
        res.status(200).json(new ApiResponse(200, { Maidlist }, "Maid data received"));
    } catch (error) {
        console.log(error.message);
        throw new ApiError('something went wrong')
    }
});
const getAllMaidByFlat = asyncHandler(async (req, res) => {
    try {
        const {_id} =  req.body
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        const response = await Maid.find({flat: _id, $and: [
            { checkin: { $gte: startOfToday }, checkin: { $lt: endOfToday } }
        ]});
        console.log(response)
        res.status(200).json(new ApiResponse(200, { response }, "Maid data received"));
    } catch (error) {
        console.log(error.message);
        throw new ApiError(500, "something went wrong")
    }
});

const isMaidCheckedIn = async (maidId) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

        const maid = await Maid.findOne({
            _id: maidId,
            $and: [
                { checkin: { $gte: startOfToday }, checkin: { $lt: endOfToday } }
            ]
        });

        return maid ? true : false;
    } catch (error) {
        console.log(error.message);
        return false;
    }
};
const checkin = asyncHandler(async(req, res) => {
    const {_id} = req.body;
    const currentTime = new Date();
    const isoTime = currentTime.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}); 
    const response = await Maid.updateOne({_id}, {$set: {checkin: isoTime}});
    res.status(200).json(new ApiResponse(200, {response}, "Check in time updated"));
});

const checkout = asyncHandler(async(req, res) => {
    const {_id} = req.body;
    const currentTime = new Date();
    const isoTime = currentTime.toLocaleString(); // Convert date to ISO 8601 format
    const response = await Maid.updateOne({_id}, {$set: {checkout: isoTime}});
    res.status(200).json(new ApiResponse(200, {response}, "Check out time updated"));
});
export {addMaidByFlat, addMaid, getAllMaid, checkin, checkout, getAllMaidByFlat}