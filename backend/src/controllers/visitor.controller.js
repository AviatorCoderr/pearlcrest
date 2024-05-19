import { asyncHandler } from "../utils/asynchandler.js";
import {Visitor} from "../models/visitors.model.js"
import {Flat} from "../models/flats.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//visitor to be added by security guard
const addvisitor = asyncHandler(async (req, res) => {
    try {
        const { flatnumber, name, mobile, purpose } = req.body;
        const flat = await Flat.findOne({flatnumber });
        if (!flat) {
            throw new Error("Flat not found"); 
        }
        const flatid = flat._id;
        console.log(flatid)
        const datetime = new Date()
        const visitor = await Visitor.create({
            flat: flatid,
            name,
            mobile,
            purpose,
            checkin: datetime
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
const getvisitor = asyncHandler(async (req, res) => {
    try {
        // Ensure req.flat and req.flat._id exist
        if (!req.flat || !req.flat._id) {
            return res.status(400).json(new ApiResponse(400, null, "Flat ID is required"));
        }

        const flatid = req.flat._id;
        console.log(`Flat ID: ${flatid}`);

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        console.log(`Start of Today: ${startOfToday}`);
        console.log(`End of Today: ${endOfToday}`);

        const visitors = await Visitor.find({
            flat: flatid,
            checkin: {
                $gte: startOfToday.toISOString(),
                $lt: endOfToday.toISOString()
            }
        });

        console.log(`Visitors found: ${visitors.length}`);

        return res.status(200).json(new ApiResponse(200, { visitors }, "All visitors data returned"));
    } catch (error) {
        console.error('Error fetching visitors:', error);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});

const getAllVisitor = asyncHandler(async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        const visitors = await Visitor.find({
            checkin: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        }).populate('flat');
        const visitorData = visitors.map(record => {
            const flatnumber = record.flat.flatnumber;
            return { ...record._doc, flatnumber };
        });
        res.status(200).json(new ApiResponse(200, { visitorData }, "Today's visitors data returned"));
    } catch (error) {
        console.error('Error fetching today\'s visitors:', error);
        res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});


export {addvisitor, getvisitor, messageToAll, getAllVisitor}