import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import Facility from "../models/facilityreservations.model.js";
import UnTransaction from "../models/transactionUnverified.models.js";
import nodemailer from "nodemailer"
import { Flat } from "../models/flats.model.js";
import Transaction from "../models/transactions.model.js";
import Income from "../models/income.model.js";
import { Owner } from "../models/owners.model.js";
import { Renter } from "../models/renters.model.js";
//utilities like send mail, generate qr etc
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
const sendFailureEmail = asyncHandler(async(trans) => {
    const flatid = trans?.flat
    const owner = await Owner.findOne({flat: {$in: flatid}})
    const renter = await Renter.findOne({flat: {$in: flatid}})
    const owneremail = owner?.email
    const renteremail = renter?.email
    const transactionId = trans?.transactionId
    const date = (trans?.createdAt)?.toLocaleString("en-IN", {
        weekday: "long", 
        year: "numeric", 
        month: "long",
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit"
    });
    const amount = trans?.amount
    try {
        const mailOptions = {
            from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
            to: [owneremail, renteremail],
            subject: "Payment Notification: Booking failed",
            html: `
                <h3>Notification from Mr. Manish, Treasurer of Pearl Crest Flat Owner's Society</h3>
                <p>Dear Resident,</p>
                <p>We extend our gratitude for your trust in the committee.</p>
                <p>It is with regret that we inform you that your recent booking with transaction Id ${transactionId} on ${date} of amount ${amount} has been cancelled due to non-receipt of payment.</p>
                <p>If your payment was successfully processed, we kindly request you to revisit the hall booking section on our website and resubmit the necessary details, including your transaction ID.</p>
                <h2>Note:</h2>
                <p>Providing the correct Transaction ID is crucial to avoid cancellation of your request.</p>
                <p>Any attempt to provide false payment data will be considered a serious offense by the committee.</p>
                <p>We appreciate your understanding and cooperation in this matter.</p>
                <p>Warm regards,</p>
                <p>Pearl Crest Flat Owner's Society</p>
                <p>Mr. Manish, Treasurer</p>
            `
        };
      const info = await transporter.sendMail(mailOptions)
      console.log(info)
    } catch (error) {
      console.log(error)
    }
})
const sendSuccessEmail = asyncHandler(async(trans, facility) => {
    const flatid = trans?.flat;
    const owner = await Owner.findOne({ flat: { $in: flatid } });
    const renter = await Renter.findOne({ flat: flatid });
    const owneremail = owner?.email;
    const renteremail = renter?.email;
    const date = (trans?.createdAt)?.toLocaleString("en-IN", {
        weekday: "long", 
        year: "numeric", 
        month: "long",
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit"
    });

    try {
        // Format booking dates
        const formattedDates = facility.dates.map(date => new Date(date).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "long", 
            year: "numeric", 
            month: "long",
            day: "numeric"
        })).join(', ');

        const mailOptions = {
            from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
            to: [owneremail, renteremail],
            subject: "Payment Notification: Booking Confirmed",
            html: `
            <h3>Notification from Mr. Manish, Treasurer of Pearl Crest Flat Owner's Society</h3>
            <p>Dear Resident,</p>
            <p>We are pleased to inform you that your recent booking for a <strong>${facility.type}</strong> for the purpose of <strong>${facility.purpose}</strong> has been successfully confirmed.</p>
            <p>Your booking details are as follows:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${trans._id}</li>
                <li><strong>Facility:</strong> ${facility.type}</li>
                <li><strong>Purpose:</strong> ${facility.purpose}</li>
                <li><strong>Booking Dates:</strong> ${formattedDates}</li>
                <li><strong>Amount Paid:</strong> ${trans.amount}</li>
                <li><strong>Transaction ID:</strong> ${trans.transactionId}</li>
            </ul>
            <p>Thank you for your prompt payment. Your receipt is available at your website's dashboard. We appreciate your cooperation.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <p>Warm regards,</p>
            <p>Pearl Crest Flat Owner's Society</p>
            <p>Mr. Manish, Treasurer</p>
            `
        };
      
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(error);
    }
});

const sendCancelEmail = asyncHandler(async (facility, trans) => {
    console.log(trans);
    const flatid = trans?.flat;
    const owner = await Owner.findOne({ flat: { $in: flatid } });
    const renter = await Renter.findOne({ flat: flatid });
    const owneremail = owner?.email;
    const renteremail = renter?.email;
    try {
        // Format booking dates
        const formattedDates = facility.dates.map(date => new Date(date).toLocaleDateString("en-IN")).join(", ");

        const mailOptions = {
            from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
            to: [owneremail, renteremail],
            subject: "Booking Cancellation Notification",
            html: `
            <h3>Notification from Pearl Crest Society</h3>
            <p>Dear Resident,</p>
            <p>This is to inform you that your booking for a <strong>${facility.type}</strong> for the purpose of <strong>${facility.purpose}</strong> has been cancelled as per your request.</p>
            <p>Your booking details are as follows:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${facility.transaction}</li>
                <li><strong>Facility:</strong> ${facility.type}</li>
                <li><strong>Purpose:</strong> ${facility.purpose}</li>
                <li><strong>Dates:</strong> ${formattedDates}</li>
                <li><strong>Amount Paid:</strong> ${trans.amount}</li>
                <li><strong>Transaction ID:</strong> ${trans.transactionId}</li>
            </ul>
            <p>The refund of ${trans.amount} will be issued soon.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <p>Warm regards,</p>
            <p>Pearl Crest Society</p>
            <p>Mr. Manish, Treasurer</p>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(error);
    }
});



const addresbyFlat = asyncHandler(async(req, res) => {
    const {purpose, type, amount, dates, transid} = req.body
    const flatid = req?.flat?._id;
    if(!flatid || !transid || !purpose || !type || !dates || !amount)
        throw new ApiError(400, "One or more fields are missing")
    const existing = await UnTransaction.findOne({
        transactionId: transid
    })
    if(existing){
        throw new ApiError(400, "Transaction with this ID already exist. Please wait for approval. You will be mailed once approved. Also you can check your payment history.")
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const transaction = await UnTransaction.create([{
            flat: flatid,
            mode: "BANK",
            purpose: "Facility Reservation",
            amount,
            createdAt: new Date(),
            transactionId: transid,
            date: new Date()
        }],
        {session: session})
        if(!transaction)
            throw new ApiError(500, "Don't worry something went wrong while verifying transaction, retry adding your details and your transaction Id")
        const reservation = await Facility.create([{
            flat: flatid,
            transactionUn: transaction[0]?._id,
            purpose,
            type,
            dates
        }],
        {session: session})
        if(!reservation)
            throw new ApiError(500, "Don't worry something went wrong while reserving, retry adding your details and your transaction Id")
        await session.commitTransaction();
        res.status(200).json(new ApiResponse(200, {reservation, transaction}, `Booking received and sent for approval. It will reflect in your payment history if approved. Note your payment Id is ${transaction[0]?._id} for future references`))
    } catch (error) {
        await session.abortTransaction()
        throw new ApiError(500, error.message)
    }
    finally{
        session.endSession()
    }

})
const deleteres = asyncHandler(async (req, res) => {
    const { resid, transid } = req.body;
    if (!resid || !transid)
        throw new ApiError(400, "One or more fields are missing");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const reservation = await Facility.deleteOne({ _id: resid }, { session: session });
        if (!reservation)
            throw new ApiError(500, "Error occurred while deleting reservation. Try again!!");
        const transaction = await UnTransaction.findByIdAndDelete({_id: transid}, { session: session });
        if (!transaction)
            throw new ApiError(500, "Error occurred while deleting transaction. Try again!!");
        console.log(transaction)
        const mailresponse = await sendFailureEmail(transaction);

        await session.commitTransaction();
        res.status(200).json(new ApiResponse(200, { reservation, transaction }, "Transaction disapproved"));
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, error.message);
    } finally {
        session.endSession();
    }
});

//approve res
const updateres  = asyncHandler(async(req, res) => {
    const {resid, transid} = req.body
    const session = await mongoose.startSession();
    session.startTransaction();
  try {
    const untrans = await UnTransaction.findById({_id: transid});
    await UnTransaction.deleteOne({_id: transid})
    if(!untrans) throw new ApiError(404, "transaction does not exist or has been verified")
    const flatid = untrans?.flat
    const mode = untrans?.mode
    const purpose = untrans?.purpose
    const amount = untrans?.amount
    const transactionId = untrans?.transactionId
    const date = untrans?.date
    const trans = await Transaction.create(
      [{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date(),
        transactionId,
        date
      }],
      { session: session }
    );
    const incomerecord = await Income.create(
      [{
        flat: flatid,
        transaction: trans[0]?._id,
        mode,
        purpose,
        amount,
        createdAt: date,
      }],
      { session: session }
    )
    const response = await Facility.updateOne(
        { _id: resid },
        { $set: { verified: true, transaction: trans[0]._id, transactionUn: null} },
        { session: session }
    );
    const facility = await Facility.findOne({_id: resid})
    const mailresponse = await sendSuccessEmail(trans[0], facility)
    await session.commitTransaction();
    res.status(201).json(
      new ApiResponse(200, { trans, incomerecord }, "Transaction and income added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new ApiError(500, error.message)
  } finally {
    session.endSession();
  }
})
const getres = asyncHandler(async(req, res) => {
    try {
        const facilities = await Facility.find().populate('flat').populate('transactionUn');
        console.log(facilities)
        res.status(200).json(new ApiResponse(200, facilities, "All records fetched"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const getAllBooking = asyncHandler(async(req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const facilities = await Facility.find({
            verified: true,
            dates: { $elemMatch: { $gte: today } }
        }).populate('flat').populate('transaction');

        console.log(facilities);
        res.status(200).json(new ApiResponse(200, facilities, "All records fetched"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const cancelBooking = asyncHandler(async(req, res) => {
    const {resid} = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const rec = await Facility.findById({_id: resid}).session(session);
        const trans = await Transaction.findById({_id: rec.transaction}).session(session);
        await Facility.deleteOne({_id: resid}).session(session);
        console.log(trans)
        const mailresponse = await sendCancelEmail(rec, trans);

        await session.commitTransaction();
        res.status(200).json(new ApiResponse(200, "Booking cancelled"));
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, error.message);
    } finally {
        session.endSession();
    }
});

const trackdates = asyncHandler(async(req, res) => {
    const response = await Facility.find();
    const datesByType = {};

    response.forEach((rec, index) => {
        const { type, dates } = rec;
        if (!datesByType[type]) {
            datesByType[type] = [];
        }
        datesByType[type].push(...dates);
    });

    const groupedDatesArray = Object.keys(datesByType).map(type => {
        return {
            type: type,
            dates: datesByType[type]
        };
    });

    res.status(200).json(new ApiResponse(200, groupedDatesArray, "Dates grouped by type returned"));
});


export {addresbyFlat, deleteres, updateres, getres, cancelBooking, getAllBooking, trackdates}