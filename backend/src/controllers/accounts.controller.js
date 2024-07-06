import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Transaction from "../models/transactions.model.js";
import UnTransaction from "../models/transactionUnverified.models.js"
import Income from "../models/income.model.js";
import Maintenance from "../models/maintenance.model.js"
import mongoose from "mongoose";
import {Flat} from "../models/flats.model.js"
import Expenditure from "../models/expenditures.model.js";
import { Owner } from "../models/owners.model.js";
import { Renter } from "../models/renters.model.js";
import nodemailer from "nodemailer"
import QRcode from "qrcode"
import { sendPushNotificationToDevice } from "../pushnotification.js";

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
const sendEmail = asyncHandler(async(req, res) => {
  try {
    const {flatnumber, trans_id} = req.body;
    const file = req?.file?.path
    if(!file)
      throw new ApiError(400, "Receipt is not generated");
    const flat = await Flat.findOne({flatnumber});
    if(!flat){
        throw new ApiError(404, "Flat Number is invalid")
    }
    const flatid = flat?._id
    const owner = await Owner.findOne({flat: {$in: flatid}})
    const renter = await Renter.findOne({flat: {$in: flatid}})
    const owneremail = owner?.email
    const renteremail = renter?.email
    const validEmails = [owneremail, renteremail].filter(email => email); // Filter out null or undefined emails
    if(validEmails.length === 0)
      throw new ApiError(400, "No valid email addresses found");

    const mailOptions = {
        from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
        to: validEmails,
        subject: "Payment Successful",
        html: 
        `<h3>From Mr. Manish, The Treasurer on behalf of Pearl Crest Flat Owner's Society.
        </h3><p>Thank you for trusting the committee flat ${flatnumber}. We have received your payment. Here is the receipt attached</p>
        <p>Warm regards,</p>
        <p>Pearl Crest Flat Owner's Society</p>
        <p>Mr. Manish, Treasurer</p>`,
        attachments: [{
          filename: `${flatnumber, trans_id}.pdf`,
          path: file
        }]
    }
    
    const info = await transporter.sendMail(mailOptions)
    return res.status(200).json({
        status: "success",
        info,
        message: "email sent",
    })
  } catch (error) {
    throw new ApiError(500, error)
  }
})

const sendFailureEmail = asyncHandler(async(trans) => {
  const flatid = trans?.flat;
  const owner = await Owner.findOne({flat: {$in: flatid}});
  const renter = await Renter.findOne({flat: {$in: flatid}});
  const owneremail = owner?.email;
  const renteremail = renter?.email;
  const transactionId = trans?.transactionId;
  const date = (trans?.createdAt)?.toLocaleString("en-IN", {
      weekday: "long", 
      year: "numeric", 
      month: "long",
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit"
  });
  const amount = trans?.amount;
  
  try {
    const validEmails = [owneremail, renteremail].filter(email => email); // Filter out null or undefined emails
    if(validEmails.length === 0)
      throw new ApiError(400, "No valid email addresses found");
      
    const mailOptions = {
        from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
        to: validEmails,
        subject: "Payment Failed",
        html: `
            <h3>Notification from Mr. Manish, Treasurer of Pearl Crest Flat Owner's Society</h3>
            <p>Dear Resident,</p>
            <p>We extend our gratitude for your trust in the committee.</p>
            <p>It is with regret that we inform you that your recent payment with transaction Id ${transactionId} on ${date} of amount ${amount} has been cancelled due to non-receipt of payment.</p>
            <p>If your payment was successfully processed, we kindly request you to revisit the society payments section on our website and resubmit the necessary details, including your transaction ID.</p>
            <h2>Note:</h2>
            <p>Providing the correct Transaction ID is crucial to avoid cancellation of your request.</p>
            <p>Any attempt to provide false payment data will be considered a serious offense by the committee.</p>
            <p>We appreciate your understanding and cooperation in this matter.</p>
            <p>Warm regards,</p>
            <p>Pearl Crest Flat Owner's Society</p>
            <p>Mr. Manish, Treasurer</p>
        `
    };
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, error);
  }
});

const generatedQr = asyncHandler(async(req, res) => {
  try {
    const {amount} = req.body
    const qrcodeUrl = `${process.env.QRCODE}${amount}`
    const qrCodeDataUri = await QRcode.toDataURL(qrcodeUrl)
    res.send({qrCodeDataUri, qrcodeUrl})
  } catch (error) {
    throw new ApiError(500, "error generating qr code")
  }
})

// generation of reports
const getTransaction = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id
  const data = await Transaction.find({flat: flatid})
  res.status(200)
  .json(new ApiResponse(200, {data}, "transaction data fetched"))
})
const getAllTransaction = asyncHandler(async(req, res) => {
  const data = await Transaction.find().populate('flat')
  res.status(200)
  .json(new ApiResponse(200, {data}, "transaction data fetched"))
})
const getTotalIncome = asyncHandler(async (req, res) => {
  const totalIncomeCash = await Income.aggregate([
    {
      $match: {
        mode: "CASH"
      }
    }, 
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" }
      }
    }
  ])
  const totalIncomeBank = await Income.aggregate([
    {
      $match: {
        mode: "BANK"
      }
    }, 
    {
      $group: {
        _id: null,
        totalIncome: {$sum: "$amount"}
      }
    }
  ])
  const cash = (totalIncomeCash[0])?totalIncomeCash[0].totalIncome : 0
  const bank = (totalIncomeBank[0])?totalIncomeBank[0].totalIncome : 0
  res.status(200)
  .json(new ApiResponse(200, [cash, bank], "Income total return"))
})
const getTotalExpenditure = asyncHandler(async (req, res) => {
  const totalExpenditureCash = await Expenditure.aggregate([
    {
      $match: {
        mode: "CASH"
      }
    },
    {
      $group: {
        _id: null,
        totalExp: { $sum: "$amount" }
      }
    }
  ])
  const totalExpenditureBank = await Expenditure.aggregate([
    {
      $match: {
        mode: "BANK"
      }
    },
    {
      $group: {
        _id: null,
        totalExp: { $sum: "$amount" }
      }
    }
  ])
  const cash =  (totalExpenditureCash[0])?totalExpenditureCash[0].totalExp : 0
  const bank =  (totalExpenditureBank[0])?totalExpenditureBank[0].totalExp : 0
  res.status(200)
  .json(new ApiResponse(200, [cash, bank], "Income total return"))
})
const getCashBalance = asyncHandler(async (req, res) => {
})
const getTransaction5 = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id;
  const data = await Transaction.find({ flat: flatid }).limit(5);
  res.status(200).json(new ApiResponse(200, data, "Top 5 transaction data fetched"));
});
const getMaintenanceRecord = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id;
  let record = await Maintenance.findOne({flat: flatid});
  if(!record) throw new ApiError(404, "No records found")
  res.status(200)
  .json(new ApiResponse(200, record?.months, "Data fetched successfully"))
})
const getAllMaintenanceRecord = asyncHandler(async(req, res) => {
  const mainrecord = await Maintenance.find().populate("flat");
  res.status(200).json(new ApiResponse(200, {mainrecord}, "Data fetched successfully"))
})
const getMaintenanceRecordByFlat = asyncHandler(async(req, res) => {
  const { flatnumber } = req.body;
  console.log(flatnumber)
  const flat = await Flat.findOne({ flatnumber });
  if (!flat) {
    return res.status(404).json(new ApiResponse(404, {}, "Flat not found"));
  }
  const mainrecord = await Maintenance.findOne({ flat: flat._id });
  res.status(200).json(new ApiResponse(200, mainrecord?.months, "Data fetched successfully"));
});

const getIncomeStatements = asyncHandler(async (req, res) => {
  const { purpose, flatnumber, start_date, end_date } = req.body;
  let query = {};
  if (start_date && end_date) {
    query.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
  }
  if (flatnumber) {
    query.flat = await Flat.findOne({ flatnumber });
  }
  if (purpose) {
    query.purpose = purpose;
  }
  const IncomeHeads = await Income.distinct('purpose');
  const incomeRecords = await Income.find(query).populate('flat');

  const incomeStatements = incomeRecords.map(record => ({
    ...record._doc,
    flatnumber: record.flat.flatnumber
  }));
  res.status(200).json(new ApiResponse(200, { incomeStatements, IncomeHeads }, "Income statements returned"));
});

const getExpenditureStatements = asyncHandler(async (req, res) => {
  try {
    const { department, executive_name, mode, start_date, end_date } = req.body;
    let query = {};
    if (department) {
      query.department = department;
    }
    if (executive_name) {
      query.executive_name = executive_name;
    }
    if (mode) {
      query.mode = mode;
    }
    if (start_date && end_date) {
      query.createdAt = { $gte: new Date(start_date), $lte: new Date(end_date) };
    }
    const ExpHeads = await Expenditure.distinct('department');
    const ExpRecords = await Expenditure.find(query);
    res.status(200).json(new ApiResponse(200, { ExpRecords, ExpHeads }, "Exp statements returned"));
  } catch (error) {
    console.error("Error fetching expenditure statements:", error);
    throw new ApiError(500, error)
  }
});

const incomeexpaccount = asyncHandler(async(req, res) => {
  const recordincome = await Income.aggregate([
    {
        $group: {
            _id: "$purpose",
            totalAmount: { $sum: "$amount" }
        }
    }
  ]);
  const recordexp = await Expenditure.aggregate([
    {
        $group: {
            _id: "$department",
            totalAmount: { $sum: "$amount" }
        }
    }
  ]);
  res.status(200).json(new ApiResponse(200, {recordexp, recordincome}, "Income records fetched"))
})
const cashbook = asyncHandler(async(req, res) => {
  const {mode} = req.body
  const cashincome = await Income.find({mode}).populate('flat');
  const cashexpense = await Expenditure.find({mode});
  const cashincomeState = cashincome.map(record => {
    const flatnumber = record.flat.flatnumber;
    return { ...record._doc, flatnumber };
  });
  res.status(200).json(new ApiResponse(200, {cashincomeState, cashexpense}, "cashbook data received"))
})
const getUnTrans = asyncHandler(async(req, res) => {
  const response = await UnTransaction.find({ purpose: {$ne: "FACILITY RESERVATION"}}).populate('flat')
  if(!response) throw new ApiError(404, "All transactions are either verified or not exists")
  res.status(200).json(new ApiResponse(200, response, "all unverified trans returned"))
})
// add into accounts
const addTransaction = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { mode, purpose, amount, months, transactionId } = req.body;
    if(!mode || !purpose || !amount || !months || !transactionId) 
      throw new ApiError(400, "One or More fields are missing")
    const flatid = req?.flat._id.toString();
    const trans = await Transaction.create(
      [{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date(),
        date: new Date(),
        months,
        transactionId
      },],
      { session: session }
    );
    const incomerecord = await Income.create(
      [{
        flat: flatid,
        transaction: trans?._id,
        mode,
        purpose,
        amount,
        createdAt: new Date(),
      },],
      { session: session }
    );
    if(purpose==="MAINTENANCE"){
      const maintenanceRecord = await Maintenance.findOne(flatid);
      const monthsPaid = maintenanceRecord.months
      months.forEach(newmonth => {
        monthsPaid.push(newmonth)
      });
      const maintenance = await Maintenance.create(
        [{
          flat: flatid,
          months: monthsPaid
        },],
        { session: session}
      )
    }
    await session.commitTransaction();
    res.status(201).json(
      new ApiResponse(200, { trans, incomerecord }, "transaction and income added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, error.message);
  } finally {
    session.endSession();
  }
});
const addTransactionByAdmin = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { flatnumber, mode, purpose, amount, months, transactionId, date } = req.body;
    if (!mode || !purpose || !amount || !months)
      throw new ApiError(400, "One or more fields are missing");

    const flat = await Flat.findOne({ flatnumber });
    if (!flat)
      throw new ApiError(404, "Invalid Flat number / Flat does not exist");

    const flatid = flat._id;

    const trans = await Transaction.create(
      [{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date(),
        months,
        transactionId,
        date
      }],
      { session: session }
    );

    const incomerecord = await Income.create(
      [{
        flat: flatid,
        transaction: trans._id,
        mode,
        purpose,
        amount,
        createdAt: date,
      }],
      { session: session }
    );

    if (purpose === "MAINTENANCE") {
      const maintenanceRecord = await Maintenance.findOne({ flat: flatid });

      if (!maintenanceRecord) {
        await Maintenance.create(
          [{
            flat: flatid,
            months
          }],
          { session: session }
        );
      } else {
        const existingMonths = new Set(maintenanceRecord.months);
        const duplicateMonths = months.filter(month => existingMonths.has(month));

        if (duplicateMonths.length > 0) {
          throw new ApiError(400, `The following months are already present: ${duplicateMonths.join(', ')}`);
        }

        const updatedMonths = [...maintenanceRecord.months, ...months];
        await Maintenance.updateOne(
          { flat: flatid },
          { $set: { months: updatedMonths } },
          { session: session }
        );
      }
    }

    await session.commitTransaction();
    res.status(201).json(
      new ApiResponse(200, { trans, incomerecord }, "Transaction and income added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new ApiError(error.statusCode, error.message);
  } finally {
    session.endSession();
  }
});

const addIncomeByAdmin = asyncHandler(async (req, res) => {
  const { mode, purpose, amount, date } = req.body;
  const flatnumber = "PCS";
  const flat = await Flat.findOne({ flatnumber });
  const flatid = flat._id;
  const newdate = (date!=null)? date: (new Date())
  if (purpose === "CASH WITHDRAWAL" || purpose === "CASH DEPOSIT") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const incomeMode = purpose === "CASH WITHDRAWAL" ? "cash" : "bank";
      const expenseMode = purpose === "CASH WITHDRAWAL" ? "bank" : "cash";
      const income = await Income.create([{
        flat: flatid,
        mode: incomeMode,
        purpose,
        amount,
        createdAt: newdate
      }],
        { session: session }
      );

      const expense = await Expenditure.create([{
        mode: expenseMode,
        amount,
        department: "Contra Entry",
        createdAt: newdate,
      }],
        { session: session }
      );

      await session.commitTransaction();
      res.status(201).json(
        new ApiResponse(200, { expense, income }, "Income and expense added successfully")
      );
    } catch (error) {
      session.abortTransaction();
      console.error(error);
      res.status(500).json(new ApiResponse(500, null, "Failed to add income and expense"));
    } finally {
      session.endSession();
    }
  } else {
    try {
      const income = await Income.create({
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: newdate
      });
      res.status(201).json(new ApiResponse(200, { income }, "Income added successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json(new ApiResponse(500, null, "Failed to add income"));
    }
  }
});
const addExpenditure = asyncHandler(async(req, res) => {
  try {
    const { mode, amount, executive_name, department, partyname, partycontact, description, date } = req.body;
    const newdate = (date!=null) ? date: (new Date())
    const expense = await Expenditure.create(
      {
        mode,
        amount,
        executive_name,
        department,
        partyname,
        partycontact,
        description,
        createdAt: newdate,
      }
    );
    res.status(201).json(
      new ApiResponse(200, { expense }, "expense added successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
})
const addUnVerfiedTransaction = asyncHandler(async(req, res) => {
  const {transactionId, amount, months, purpose} = req.body
  if(!transactionId || !amount || !purpose) throw new ApiError(400, "One or more fields are missing")
  const flatid = req?.flat?._id
  if(!flatid) throw new ApiError(400, "Unauthorised access. Please login")
  const response = await UnTransaction.create({
    flat: flatid,
    purpose,
    amount,
    mode: "BANK",
    months,
    transactionId,
    date: new Date()
  })
  res.status(200).json(new ApiResponse(201, response, "Transaction unverified added"))
})
const Approvepayment = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { flatnumber, mode, purpose, amount, months, transactionId, date, untransid } = req.body;
    
    // Check for missing fields
    if(!mode || !purpose || !amount || !months) 
      throw new ApiError(400, "One or More fields are missing");

    // Find the flat by flatnumber
    const flat = await Flat.findOne({ flatnumber });
    if(!flat)
      throw new ApiError(404, "Invalid Flatnumber/ Flat not exists");
      
    const flatid = flat._id;

    // Check for an existing transaction with the same transactionId
    const existingTransaction = await Transaction.findOne({ transactionId });
    if (existingTransaction) {
      throw new ApiError(400, "Transaction with this ID already exists");
    }

    // Create the transaction
    const trans = await Transaction.create(
      [{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date(),
        months,
        transactionId,
        date
      }],
      { session: session }
    );

    // Create the income record
    const incomerecord = await Income.create(
      [{
        flat: flatid,
        transaction: trans._id,
        mode,
        purpose,
        amount,
        createdAt: date,
      }],
      { session: session }
    );

    // Handle maintenance records
    if (purpose === "MAINTENANCE") {
      const maintenanceRecord = await Maintenance.findOne({ flat: flatid });
      let maintenance;
      if (!maintenanceRecord) {
        maintenance = await Maintenance.create(
          [{
            flat: flatid,
            months
          }],
          { session: session }
        );
      } else {
        const monthsPaid = [...maintenanceRecord.months, ...months];
        maintenance = await Maintenance.updateOne(
          { flat: flatid },
          {
            $set: { months: monthsPaid }
          },
          { session: session }
        );
      }
    }

    // Delete the unapproved transaction
    await UnTransaction.deleteOne({_id: untransid});

    // Send push notification if deviceToken exists
    if (flat.deviceToken && flat.deviceToken.length > 0) {
      const title = "Payment successful";
      const body = `Your payment with transaction ID ${transactionId} is successful. You can download the receipt from payment history.`;
      for (const token of flat.deviceToken) {
        await sendPushNotificationToDevice(token, flat._id, title, body);
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    res.status(201).json(
      new ApiResponse(200, { trans, incomerecord }, "Transaction and income added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new ApiError(error.statusCode, error.message);
  } finally {
    session.endSession();
  }
});

const denyPayment = asyncHandler(async(req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const {untransid} = req.body
    const trans = await UnTransaction.findByIdAndDelete({_id: untransid}, {session: session})
    await sendFailureEmail(trans)
    const flatid = trans.flat
    const flat = await Flat.findById(flatid)
    if (flat.deviceToken && flat.deviceToken.length > 0) {
      const title = "Pearl Crest Society - Payment Denied";
      const body = `Your payment with transaction ID ${trans.transactionId} is failed due to non-matching of Transaction Id with bank. Kindly re-enter it on the website.`;
      for (const token of flat.deviceToken) {
        await sendPushNotificationToDevice(token, flat._id, title, body);
      }
    }
    await session.commitTransaction()
    res.status(200).json(new ApiResponse(200, "Denied successfully"))
  } catch (error) {
    await session.abortTransaction()
    throw new ApiError(500, "Something went wrong")
  } finally {
    await session.endSession()
  }
})
const updateMainbyloop = asyncHandler(async(req, res) => {
  const maindet = req.body
  for(const maint of maindet){
    const {flatnumber, months} = maint
    console.log(flatnumber)
    if(!flatnumber || !months) throw new ApiError(500, "data missing")
    const flat = await Flat.findOne({flatnumber})
    console.log(flat)
    if(!flat) throw new ApiError(404, "Flat not exists")
    const flatid = flat._id
    const exisiting = await Maintenance.findOne({flat: flatid})
    console.log(flatid)
    if(exisiting){
      const array = exisiting.months
      const newarray = [...array, ...months]
      await Maintenance.updateOne({flat: flatid}, {$set: {months: newarray}})
    }
    else{
      await Maintenance.create({
        flat: flatid,
        months
      })
    }
  }
  return res.status(200).json(new ApiResponse(200, "All maintenance updated"))
})
// exports
export { addTransaction, addTransactionByAdmin, addIncomeByAdmin, 
  addExpenditure, getTransaction, getTotalIncome, getTotalExpenditure,
getCashBalance, getTransaction5, getMaintenanceRecord, getAllTransaction, getIncomeStatements, getAllMaintenanceRecord, getExpenditureStatements, incomeexpaccount, cashbook, sendEmail
, generatedQr, addUnVerfiedTransaction, getUnTrans, Approvepayment, denyPayment, updateMainbyloop, getMaintenanceRecordByFlat};