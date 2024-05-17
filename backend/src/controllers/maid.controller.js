import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Maid from "../models/maids.model.js";
import {Flat} from "../models/flats.model.js"

const addMaidByFlat = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    const flatId = req?.flat?._id;

    const existingMaid = await Maid.findById(_id);

    if (!existingMaid) {
        throw new ApiError(404, "Maid not found");
    }

    const flatWorking = existingMaid.flat || [];
    if (flatWorking.includes(flatId)) {
        return res.status(400).json({ statusCode: 400, message: "Maid already linked" });
    }

    const newFlatWorking = [...flatWorking, flatId];

    await Maid.findByIdAndUpdate(_id, { flat: newFlatWorking });
    return res.status(200).json(new ApiResponse(200, null, "Maid added to flat"));
});
const addMaid = asyncHandler(async (req, res) => {
    const { flatnumber, name, mobile, aadhar } = req.body;
    const existingMaid = await Maid.findOne({
        $or: [{ mobile: mobile }, { aadhar: aadhar }]
        });
    if (existingMaid) {
        throw new ApiError(400, "Maid already exists. Check Mobile or Aadhar number again");
    }
    let flatidList = [];
    for (const element of flatnumber) {
        const flat = await Flat.findOne({ flatnumber: element });
        const flatid = flat?._id;
        flatidList.push(flatid);
    }
    const response = await Maid.create({
        flat: flatidList,
        name,
        mobile,
        aadhar
    });

    return res.status(200).json(new ApiResponse(200, { response }, "Maid added"));
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
        throw new ApiError('something went wrong')
    }
});
const getAllMaidByFlat = asyncHandler(async (req, res) => {
    try {
        const {_id} =  req.body
        const response = await Maid.find({flat: _id});
        res.status(200).json(new ApiResponse(200, { response }, "Maid data received"));
    } catch (error) {
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
        throw new ApiError(500, error)
    }
};
const checkin = asyncHandler(async(req, res) => {
    const {_id} = req.body;
    const currentTime = new Date();
    const existingMaid = await Maid.findById({_id})
    const datetimearray = existingMaid.checkin
    const newarray = [...datetimearray, currentTime]
    const response = await Maid.updateOne({_id}, {$set: {checkin: newarray}});
    res.status(200).json(new ApiResponse(200, {response}, "Check in time added"));
});

const checkout = asyncHandler(async(req, res) => {
    const {_id} = req.body;
    const currentTime = new Date();
    const isoTime = currentTime.toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}); // Convert date to ISO 8601 format
    const response = await Maid.updateOne({_id}, {$set: {checkout: isoTime}});
    res.status(200).json(new ApiResponse(200, {response}, "Check out time updated"));
});
const deleteMaidbyFlat = asyncHandler(async(req, res) => {
    const {maidid, flatid} = req.body
    console.log(maidid, flatid)
    const exisitingmaid = await Maid.findById({_id: maidid})
    if(!exisitingmaid) throw new ApiError(404, "Maid not found")
    const flatarray = exisitingmaid.flat
    const newflatarray = flatarray.filter((ele) => ele===flatid)
    console.log(flatarray)
    console.log(newflatarray)
    await Maid.updateOne({_id: maidid}, {$set: {flat: newflatarray}})
    return res.status(200).json(new ApiResponse(200, "maid removed"))
})
const addMaidbyloop = asyncHandler(async(req, res) => {
    const maiddet = req.body
    try {
        for(const maid of maiddet){
            const {name, mobile} = maid;
            const maidcreated = await Maid.create({
                name,
                mobile
            })
            if(!maidcreated) throw new ApiError(500, "Something went wrong")
        }
        return res.status(200).json(new ApiResponse(200, "all data added"))
    } catch (error) {
        console.log(error)
        throw new ApiError(500, error)
    }
})
export {addMaidByFlat, addMaid, getAllMaid, checkin, checkout, getAllMaidByFlat, deleteMaidbyFlat, addMaidbyloop}