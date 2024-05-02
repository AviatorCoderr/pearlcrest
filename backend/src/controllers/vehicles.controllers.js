import { asyncHandler } from "../utils/asynchandler.js";
import { Vehicle } from "../models/vehicles.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Owner} from "../models/owners.model.js"
import {Renter} from "../models/renters.model.js"
import { ApiError } from "../utils/ApiError.js";
import { Flat } from "../models/flats.model.js";
const AddVehicle = asyncHandler(async(req, res) => {
    const {type, reg_no, colour, model} = req.body
    const flatid = req?.flat._id
    const vehicle = await Vehicle.create({
        flat: flatid,
        type,
        reg_no,
        model
    })
    res
    .status(200)
    .json(new ApiResponse(200, {vehicle}, "vehicle added"))
})
const getVehicles = asyncHandler(async (req, res) => {
    const flatid = req?.flat._id;
    const vehicles = await Vehicle.find({ flatid });
    res.status(200).json(new ApiResponse(200, { vehicles }, "Vehicle data received"));
});
const getVehiclebyNumber = asyncHandler(async (req, res) => {
    try {
        const {reg_no} = req.body
        console.log("hello", reg_no)
        const vehicle = await Vehicle.findOne({reg_no: reg_no});
        console.log(vehicle)
        const flatid = vehicle?.flat
        const owner = await Owner.findOne({flat: flatid})
        const renter = await Renter.findOne({flat: flatid})
        const flat = await Flat.findOne({_id: flatid})
        const flatnumber = flat?.flatnumber
        console.log(flat)
        if(!vehicle)
        throw new ApiError(501, "not found")
        res.status(200).json(new ApiResponse(200, {vehicle, owner, renter, flatnumber}, "Vehicle found"))
    } catch (error) {
        console.log(error.message)
    }
})
export {AddVehicle, getVehicles, getVehiclebyNumber}