import { asyncHandler } from "../utils/asynchandler.js";
import { FourWheeler, TwoWheeler, Bicycle } from "../models/vehicles.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const Fourwheeler = asyncHandler(async(req, res) => {
    const {reg_no, colour, brand, model} = req.body
    const flatid = req?.flat._id
    const four = await FourWheeler.create({
        flatid,
        reg_no,
        brand,
        colour,
        model
    })
    res
    .status(200)
    .json(new ApiResponse(200, {four}, "four wheeler added"))
})
const Twowheeler = asyncHandler(async(req, res) => {
    const {reg_no, colour, brand, model} = req.body
    const flatid = req?.flat._id
    const two = await TwoWheeler.create({
        flatid,
        reg_no,
        brand,
        colour,
        model
    })
    res
    .status(200)
    .json(new ApiResponse(200, {two}, "two wheeler added"))
})
const bicycle = asyncHandler(async(req, res) => {
    const {colour, model} = req.body
    const flatid = req?.flat._id
    const bicycle = await FourWheeler.create({
        flatid, 
        colour,
        model
    })
    res
    .status(200)
    .json(new ApiResponse(200, {bicycle}, "bicycle added"))
})
const getVehicles = asyncHandler(async (req, res) => {
    const flatid = req?.flat._id;
    const fourWheelers = await FourWheeler.find({ flatid });
    const twoWheelers = await TwoWheeler.find({ flatid });
    const bicycles = await Bicycle.find({ flatid });
    res.status(200).json(new ApiResponse(200, { fourWheelers, twoWheelers, bicycles }, "Vehicle data received"));
});
export {Fourwheeler, Twowheeler, bicycle, getVehicles}