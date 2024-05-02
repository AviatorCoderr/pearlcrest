import { asyncHandler } from "../utils/asynchandler.js";
import {Visitor} from "../models/visitors.model.js"
import {Flat} from "../models/flats.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//visitor to be added by security guard
const addvisitor = asyncHandler(async (req, res) => {
    try {
        const { flatnumber, name, mobile, numofpeople, purpose } = req.body;
        const flat = await Flat.findOne({flatnumber });
        if (!flat) {
            throw new Error("Flat not found"); 
        }
        const flatid = flat._id;
        console.log(flatid)
        const checkin = new Date();
        const visitor = await Visitor.create({
            flat: flatid,
            name,
            mobile,
            numofpeople,
            purpose,
            checkin
        });
        res.status(201).json(new ApiResponse(201, { visitor }, "Visitor created"));
    } catch (error) {
        res.status(400).json(new ApiResponse(400, null, error.message));
    }
});
const messageToAll = asyncHandler(async(req, res) => {
    const { flatnumber, name, mobile, numofpeople, purpose } = req.body;
    if(purpose==="schoolvan"){
        //message all flats
    }
})
const getvisitor = asyncHandler(async( req, res) => {
    try {
        const flatid = req?.flat._id
        console.log(flatid)
        const visitors = await Visitor.find({
            flat: flatid
        })
        res
        .status(200)
        .json(new ApiResponse(200, {visitors}, "all visitors data returned"))
    } catch (error) {
        console.log(error)
    }
})
const getAllVisitor = asyncHandler(async( req, res) => {
    const visitors = await Visitor.find()
    console.log(visitors)
    res
    .status(200)
    .json(new ApiResponse(200, {visitors}, "all visitors data returned"))
})
const visitorCheckin = asyncHandler(async(req, res) => {
    const {visitor_id} = req.body
    const response = await Visitor.updateOne({_id: visitor_id}, {$set: {$checkin: new Date()}})
    res.status(200).json(200, response, "checked in")
})
const visitorCheckOut = asyncHandler(async(req, res) => {
    const {visitor_id} = req.body
    const response = await Visitor.updateOne({_id: visitor_id}, {$set: {$checkout: new Date()}})
    res.status(200).json(200, response, "checked out")
})
//checkout function

export {addvisitor, getvisitor, messageToAll, getAllVisitor, visitorCheckin, visitorCheckOut}