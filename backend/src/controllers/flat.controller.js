import {asyncHandler} from "../utils/asynchandler.js"
import {Flat} from "../models/flats.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import bcrypt from "bcrypt"
// for admin to create flat database
const registerFlat = asyncHandler(async (req, res) => {
    try {
        const flatdet = req.body;
        for (const flat of flatdet) {
            const { flatnumber, currentstay, password, position } = flat;
            console.log(flatnumber, " ", currentstay, " ", password, " ", position);
            if ([flatnumber, currentstay, password, position].some((field) => !field || field.trim() === "")) {
                throw new ApiError(401, "All fields are required");
            }
            const existingFlat = await Flat.findOne({flatnumber});
            console.log(existingFlat);
            if (existingFlat) {
                throw new ApiError(409, "Flat already exists");
            }
            const createdFlat = await Flat.create({
                flatnumber: flatnumber.toUpperCase(),
                password,
                currentstay,
                position
            });
            console.log(createdFlat);
            if (!createdFlat) {
                throw new ApiError(500, "Something went wrong while registering flat");
            }
        }
        return res.status(200).json(new ApiResponse(200, "Flats registered successfully"));
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, error.message || "Internal Server Error"));
    }
});

// for flatier if forgot password
const changePassword = asyncHandler(async (req, res) => {
    try {
        const {flatnumber, oldpassword, newpassword} = req.body
        if([flatnumber, oldpassword, newpassword].some((field) => field?.trim() === "")){
            throw new ApiError(400, "some field is missing")
        }
        const flat = await Flat.findOne({flatnumber})
        if(!flat){
            throw new ApiError(409, "Flatnumber is wrong or Flat not exists")
        }
        const isPasswordCorrect = await bcrypt.compare(oldpassword, flat.password)
        if(!isPasswordCorrect){
            throw new ApiError(400, "Invalid password")
        }
        flat.password = newpassword
        await flat.save({validateBeforeSave: false})
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Succesfully"))
    } catch (error) {
        console.log(error.message)
    }
})
// for admin to reset password with a click if owner changes
const adminresetpassword = asyncHandler(async(req, res) => {
    const {flatnumber} = req.body
    // pass flatnumber as value selection from frontend
    const flat = await Flat.findOne({flatnumber})
    if(!flat){
        throw new ApiError(409, "Flatnumber is wrong or Flat not exists")
    }
    flat.password = flatnumber
    await flat.save({validateBeforeSave: false})
    res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset done"))
})
//to generate tokens
const generateAccessandRefreshTokens = asyncHandler(async(flatId) => {
    try {
        const flat = await Flat.findById(flatId)
        const accessToken = await flat.generateAccessToken()
        const refreshToken = await flat.generateRefreshToken()
        flat.refreshToken = refreshToken
        flat.lastLogIn = new Date()
        await flat.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
})
// for log in of flatier
const loginFlat = asyncHandler(async (req, res) => {
    const {flatnumber, password} = req.body
    if([flatnumber, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "flatnumber or password is missing")
    }
    const flat = await Flat.findOne({flatnumber})
    if(!flat){
        throw new ApiError(404, "flatnumber is invalid or not exists")
    }
    console.log(flat.password)
    const isPasswordCorrect = await bcrypt.compare(password, flat.password)
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid Password")
    }
    const setLoginTime = Flat.updateOne(
        {flatnumber},
        {$set: { $lastLogIn: new Date() }}
    )
    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(flat._id)
    const loggedInFlat = await Flat.findById(flat._id).select("-password -refreshToken")
    const options= {  
        httpOnly: true,
        secure: false
    }
    return res
    .status(200)  
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                flat: loggedInFlat, accessToken, refreshToken
            },
            "Flat logged in successfully"
        )
    )
})
// to display all flat data with last login details and password reset button
const displayFlats = asyncHandler(async (req, res) => {
    const flats = await Flat.find().select("-password -_id -refreshToken")
    res
    .status(200)
    .json(new ApiResponse(200, {flats}, "Flats details displayed"))
})
//to get current user
const getCurrentUser = asyncHandler(async(req, res) => {
    console.log(req.flat)
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.flat, "current user fetched successfully")
    )
})
// logout user
const logoutUser = asyncHandler( async(req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json(new ApiResponse(200, "user logged out successfully"))
})
export {registerFlat, changePassword, adminresetpassword, loginFlat, displayFlats, getCurrentUser, logoutUser}