import {asyncHandler} from "../utils/asynchandler.js"
import {Flat} from "../models/flats.model.js"
import otpverification from "../models/otpverification.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Owner} from "../models/owners.model.js"
import {Renter} from "../models/renters.model.js"
import {ApiError} from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
// for admin to create flat database
// nodemailer stuff

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});
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
    console.log("hello")
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
    const setLoginTime = await Flat.updateOne(
        {flatnumber},
        {$set: { $lastLogIn: new Date() }}
    )
    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(flat._id)
    const loggedInFlat = await Flat.findById(flat._id).select("-password -refreshToken")
    const options= {  
        httpOnly:true,
        secure: true,
        sameSite: 'none' 
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
    const flatid = req?.flat?._id
    if(!flatid) throw new ApiError(401, "User not logged in")
    // console.log(flatid)
    const flat = await Flat.findById({_id: flatid})
    return res
    .status(200)
    .json(
        new ApiResponse(200, flat, "current user fetched successfully")
    )
})
// logout user
const logoutUser = asyncHandler( async(req, res) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json(new ApiResponse(200, "user logged out successfully"))
})

const sendOtpVerificationEmail = asyncHandler(async(req, res) => {
    const {flatnumber, oldpassword} = req.body;
    const flat = await Flat.findOne({flatnumber});
    if(!flat){
        throw new ApiError(404, "Flat Number is invalid")
    }
    const isPasswordCorrect = await bcrypt.compare(oldpassword, flat?.password)
    console.log(isPasswordCorrect)
    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect password")
    }
    const flatid = flat?._id;
    const owner = await Owner.findOne({flat: {$in: flatid}})
    const renter = await Renter.findOne({flat: {$in: flatid}})
    const otp = `${Math.floor(Math.random()*9000+1000)}`
    const owneremail = owner?.email
    const renteremail = renter?.email
    const mailOptions = {
        from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
        to: [owneremail, renteremail],
        subject: "Verify Your Account",
        html: `<h3>From Mr. Manish, The Treasurer on behalf of Pearl Crest Flat Owner's Society.</h3><p>Thank you for trusting Pearl Crest Society. Enter <b>${otp}</b> in the website to verify your account</p>
        <p>This code <b>expires in 5 minutes</b>.</p>`
    }
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds)
    const response = await otpverification.create({
        userId: flatid,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 360000
    })
    const info = await transporter.sendMail(mailOptions)
    return res.status(200).json({
        status: "PENDING",
        info,
        message: "Verification otp email sent",
        data: {
            userId: flatid,
            owneremail
        }
    })
})
const changepassword = asyncHandler(async(req, res) => {
    try {
        const {flatnumber, otp, newpassword} = req.body
        if(!flatnumber || !otp || !newpassword)
            throw new ApiError(400, "enter all fields")
        const flat = await Flat.findOne({flatnumber})
        console.log(flat)
        const flatid = flat?._id
        const otpverify = await otpverification.find({
            userId: flatid,
        })
        console.log(otpverify)
        if(otpverify.length<=0){
            throw new ApiError(401, "Account record doesn't exist or has been verified already. please login")
        }
        const {expiresAt} = otpverify[0]
        const hashedOTP = otpverify[0].otp
        if(expiresAt < Date.now()){
            await otpverification.deleteMany({userId: flatid})
            throw new ApiError(400, "Code has expired. Please request again")
        }
        else{
            const validOTP= bcrypt.compare(otp, hashedOTP)
            console.log(validOTP)
            if(!validOTP){
                throw new ApiError("Invalid code. Check your Inbox")
            }
            else {
                const savepass = await bcrypt.hash(newpassword, 10);
                const response = await Flat.updateOne({_id: flatid}, {$set: {password: savepass}})
                await otpverification.deleteMany({userId: flatid})
                return res.json({
                    status: "Verified",
                    message: "user email verified successfully",
                    response
                })
            }
        }
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message
        })
    }
})
export {registerFlat, adminresetpassword, loginFlat, displayFlats, getCurrentUser, logoutUser, sendOtpVerificationEmail, changepassword}