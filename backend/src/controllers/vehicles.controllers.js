import { asyncHandler } from "../utils/asynchandler.js";
import { Vehicle, Challan } from "../models/vehicles.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Owner } from "../models/owners.model.js";
import { Renter } from "../models/renters.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Flat } from "../models/flats.model.js";
import { sendPushNotificationToDevice } from "../pushnotification.js";
const AddVehicle = asyncHandler(async(req, res) => {
    const { type, reg_no, model } = req.body;
    const flatid = req?.flat._id;
    const vehicle = await Vehicle.create({
        flat: flatid,
        type,
        reg_no,
        model
    });
    res.status(200).json(new ApiResponse(200, { vehicle }, "Vehicle added"));
});

const getVehicles = asyncHandler(async (req, res) => {
    const flatid = req?.flat._id;
    const vehicles = await Vehicle.find({ flat: flatid });
    res.status(200).json(new ApiResponse(200, { vehicles }, "Vehicle data received"));
});

const getVehiclebyNumber = asyncHandler(async (req, res) => {
    try {
        const { reg_no } = req.body;
        const vehicle = await Vehicle.findOne({ reg_no });
        const flatid = vehicle?.flat;
        const owner = await Owner.findOne({ flat: flatid });
        const renter = await Renter.findOne({ flat: flatid });
        const flat = await Flat.findOne({ _id: flatid });
        const flatnumber = flat?.flatnumber;
        if (!vehicle) {
            throw new ApiError(501, "not found");
        }
        return res.status(200).json(new ApiResponse(200, { vehicle, owner, renter, flatnumber }, "Vehicle found"));
    } catch (error) {
        throw new ApiError(500, "not found");
    }
});

const updateVehicles = asyncHandler(async (req, res) => {
    const { _id, type, model, reg_no } = req.body;
    const updateFields = {
        ...(type && { type }),
        ...(model && { model }),
        ...(reg_no && { reg_no })
    };
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ success: false, message: "No fields provided for update." });
    }
    await Vehicle.updateOne({ _id }, { $set: updateFields });
    res.status(200).json({ success: true, message: "Vehicle updated successfully." });
});

const generateChallan = asyncHandler(async (req, res) => {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findById(vehicleId).populate('flat');
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const amount = vehicle.type === 'TwoWheeler' ? 200 : 500;
    const challan = await Challan.create({
        flat: vehicle.flat._id,
        vehicle: vehicle._id,
        amount
    });
    const flat = vehicle.flat._id
    if (flat.deviceToken && flat.deviceToken.length > 0) {
        const title = "Wrong Parking!! You have a challan issued.";
        const body = `A challan issued for vehicle ${vehicle.reg_no} of ${amount}. Please check your challan ticket on website.`;
        for (const token of flat.deviceToken) {
          await sendPushNotificationToDevice(token, flat._id, title, body);
        }
      }

    res.status(200).json(new ApiResponse(200, { challan, flat: vehicle.flat }, "Challan generated"));
});
const getChallansByFlat = asyncHandler(async (req, res) => {
    const flatId = req?.flat?._id
    const challans = await Challan.find({ flat: flatId }).populate('flat').populate('vehicle');
    res.status(200).json(new ApiResponse(200, challans, "Challans fetched successfully"));
});

const getChallans = asyncHandler(async (req, res) => {
    const challans = await Challan.find().populate('flat').populate('vehicle');
    res.status(200).json(new ApiResponse(200, challans, "Challans fetched successfully"));
});
export { AddVehicle, getVehicles, getVehiclebyNumber, updateVehicles, generateChallan, getChallansByFlat, getChallans};
