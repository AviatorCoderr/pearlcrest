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
const getvisitor = asyncHandler(async( req, res) => {
    try {
        const flatid = req?.flat._id
        console.log(flatid)
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        const visitors = await Visitor.find({flat: flatid, $and: [
            { checkin: { $gte: startOfToday.toISOString() }, checkin: { $lt: endOfToday/toISOString() } }
        ]});
        res
        .status(200)
        .json(new ApiResponse(200, {visitors}, "all visitors data returned"))
    } catch (error) {
        console.log(error)
    }
})
const getAllVisitor = asyncHandler(async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

        console.log(`Start of Today: ${startOfToday}`);
        console.log(`End of Today: ${endOfToday}`);

        // Fetch today's visitors and populate the 'flat' field
        const visitors = await Visitor.find({
            checkin: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        }).populate('flat');

        console.log(`Today's visitors found: ${visitors.length}`);

        // Map through the visitors to include the flatnumber
        const visitorData = visitors.map(record => {
            const flatnumber = record.flat.flatnumber;
            return { ...record._doc, flatnumber };
        });

        // Return the formatted visitor data
        res.status(200).json(new ApiResponse(200, { visitorData }, "Today's visitors data returned"));
    } catch (error) {
        console.error('Error fetching today\'s visitors:', error);
        res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});


export {addvisitor, getvisitor, messageToAll, getAllVisitor}