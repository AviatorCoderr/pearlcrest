import { asyncHandler } from "../utils/asynchandler.js";
import { Vehicle } from "../models/vehicles.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Owner} from "../models/owners.model.js"
import {Renter} from "../models/renters.model.js"
import { ApiError } from "../utils/ApiError.js";
const AddVehicle = asyncHandler(async(req, res) => {
    const {type, reg_no, colour, model} = req.body
    const flatid = req?.flat._id
    const vehicle = await Vehicle.create({
        flat: flatid,
        type,
        reg_no,
        colour,
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
    const {reg_no} = req.body
    console.log(reg_no)
    const vehicle = await Vehicle.findOne({reg_no});
    const flatid = vehicle?.flat
    const owner = await Owner.findOne({flat: {$in : flatid}})
    const renter = await Renter.findOne({flat: flatid})
    if(!vehicle)
    throw new ApiError(501, "not found")
    res.status(200).json(new ApiResponse(200, {vehicle, owner, renter}, "Vehicle found"))
})
export {AddVehicle, getVehicles, getVehiclebyNumber}