import { Candidate } from "../models/candidates.model.js";
import { Voter } from "../models/voters.model.js";
import otpelection from "../models/otpelection.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Set up nodemailer transporter
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

// Send OTP Verification Email
const sendOtpVerificationEmail = asyncHandler(async (email, voterId) => {
    const otp = `${Math.floor(Math.random() * 9000 + 1000)}`;
    const mailOptions = {
        from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
        to: [email],
        subject: "Pearl Crest Society Elections 2025 | Voter Registration",
        html: `<h3> On behalf of Pearl Crest Flat Owner's Society Election Council.</h3><p>Enter <b>${otp}</b> in the website to verify your account</p>
        <p>This code <b>expires in 5 minutes</b>.</p>`
    };

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const response = await otpelection.create({
        userId: voterId,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 360000
    });

    const info = await transporter.sendMail(mailOptions);
    return { info, voterId, email };
});

// Generate Access and Refresh Tokens
const generateAccessandRefreshTokens = asyncHandler(async (voterId) => {
    try {
        const flat = await Voter.findById(voterId);
        const accessToken = await flat.generateAccessToken();
        const refreshToken = await flat.generateRefreshToken();
        flat.refreshToken = refreshToken;
        flat.lastLogIn = new Date();
        await flat.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
});

// Register Voter
const registerVoter = asyncHandler(async (req, res) => {
    try {
        const { flatnumber, name, email, mobile } = req.body;

        // Validate all required fields
        if (![flatnumber, name, email, mobile].every(field => field && field.trim() !== "")) {
            throw new ApiError(401, "All fields are required");
        }

        // Check if the flat already exists
        const existingVoterByFlat = await Voter.findOne({ flatnumber });
        if (existingVoterByFlat) {
            throw new ApiError(409, "Voter from this Flat already exists");
        }

        const existingVoterByMail = await Voter.findOne({ email });
        if (existingVoterByMail) {
            throw new ApiError(409, "Voter already exists");
        }

        const existingVoterByMobile = await Voter.findOne({ mobile });
        if (existingVoterByMobile) {
            throw new ApiError(409, "Voter already exists");
        }

        // Create the new flat
        const createdVoter = await Voter.create({
            flatnumber: flatnumber.toUpperCase(),
            name,
            mobile,
            email
        });

        // Check if flat creation was successful
        if (!createdVoter) {
            throw new ApiError(500, "Something went wrong while registering voter");
        }

        // Respond with success
        return res.status(200).json(new ApiResponse(200, "Voter registered successfully"));
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, error.message || "Internal Server Error"));
    }
});

// Vote Login Send OTP
const voteLoginSendOtp = asyncHandler(async (req, res) => {
    const { flatnumber, email } = req.body;

    // Check for missing fields
    if ([flatnumber, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "flatnumber or email is missing");
    }

    const voter = await Voter.findOne({ flatnumber, email });
    if (!voter) {
        throw new ApiError(404, "Invalid Credentials/ Voter not registered");
    }

    const { info, voterId, email: voterEmail } = await sendOtpVerificationEmail(email, voter._id);

    if (!info) {
        throw new ApiError(500, "Error in sending OTP");
    }

    return res.status(200).json(new ApiResponse(200, "OTP sent successfully", { userId: voterId, email: voterEmail }));
});

// Vote Login
const voteLogin = asyncHandler(async (req, res) => {
    const { flatnumber, email, otp } = req.body;

    // Check for missing OTP
    if (!otp || otp.trim() === "") {
        throw new ApiError(400, "OTP is missing");
    }

    const voter = await Voter.findOne({ flatnumber, email });

    if (!voter) {
        throw new ApiError(404, "Voter not found. Please check your details.");
    }

    const voterId = voter?._id;

    // Find the OTP record
    const otpRecord = await otpelection.findOne({ userId: voterId });
    if (!otpRecord) {
        throw new ApiError(401, "Account record doesn't exist or has been verified already. Please login.");
    }

    const { expiresAt, otp: hashedOTP } = otpRecord;

    // Check if OTP has expired
    if (expiresAt < Date.now()) {
        await otpelection.deleteMany({ userId: voterId });
        throw new ApiError(400, "Code has expired. Please request again.");
    }

    // Validate OTP
    const isValidOTP = await bcrypt.compare(otp, hashedOTP);
    if (!isValidOTP) {
        throw new ApiError(401, "Invalid code. Please check your inbox.");
    }

    // Update the voter's login time
    await Voter.updateOne({ flatnumber }, { $set: { lastLogIn: new Date() } });

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(voterId);

    // Delete the OTP record
    await otpelection.deleteMany({ userId: voterId });

    // Set cookie options
    const options = {  
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { votedet: voter, accessToken, refreshToken }, "Voter logged in successfully"));
});

export { voteLogin, registerVoter, voteLoginSendOtp };
