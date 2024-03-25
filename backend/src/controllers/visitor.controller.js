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
        const checkin = new Date();
        const visitor = await Visitor.create({
            flatid,
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

export {addvisitor}