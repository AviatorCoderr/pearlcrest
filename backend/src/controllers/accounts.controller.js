import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Transaction from "../models/transactions.model.js";
import Income from "../models/income.model.js";
import Maintenance from "../models/maintenance.model.js"
import mongoose from "mongoose";
import {Flat} from "../models/flats.model.js"
import Expenditure from "../models/expenditures.model.js";
import { Owner } from "../models/owners.model.js";
import { Renter } from "../models/renters.model.js";
import nodemailer from "nodemailer"
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
    console.log(file)
    if(!file)
      throw new ApiError(400, "Receipt is not generated");
    const flat = await Flat.findOne({flatnumber});
    if(!flat){
        throw new ApiError(404, "Flat Number is invalid")
    }
    const flatid = flat?._id;
    const owner = await Owner.findOne({flat: {$in: flatid}})
    const renter = await Renter.findOne({flat: {$in: flatid}})
    const owneremail = owner?.email
    const renteremail = renter?.email
    const mailOptions = {
        from: '"Pearl Crest Society" <pearlcrestsociety@gmail.com>',
        to: [owneremail, renteremail],
        subject: "Payment Successful",
        html: 
        `<h3>From Mr. Manish, The Treasurer on behalf of Pearl Crest Flat Owner's Society.
        </h3><p>Thank you for trusting the commitee. We have recived your payment. Here is the receipt attached</p>`,
        attachments: [{
          filename: `${flatnumber, trans_id}.pdf`,
          path: file
        }]
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log(info)
    return res.status(200).json({
        status: "success",
        info,
        message: "email sent",
    })
  } catch (error) {
    console.log(error)
  }
})
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
        mode,
        purpose,
        amount,
        createdAt: new Date(),
      },],
      { session: session }
    );
    if(purpose==="Maintenance"){
      const maintenanceRecord = await Maintenance.findOne(flatid);
      const monthsPaid = maintenanceRecord.months
      console.log(monthsPaid)
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
    if(!mode || !purpose || !amount || !months) 
      throw new ApiError(400, "One or More fields are missing")
    const flat = await Flat.findOne({ flatnumber });
    if(!flat)
      throw new ApiError(404, "Invalid Flatnumber/ Flat not exists")
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
        mode,
        purpose,
        amount,
        createdAt: date,
      }],
      { session: session }
    );
    if (purpose === "Maintenance") {
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
    await session.commitTransaction();
    res.status(201).json(
      new ApiResponse(200, { trans, incomerecord }, "Transaction and income added successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    throw new ApiError(error.statusCode, error.message)
  } finally {
    session.endSession();
  }
});
const addIncomeByAdmin = asyncHandler(async (req, res) => {
  const { mode, purpose, amount } = req.body;
  const flatnumber = "PCS";
  const flat = await Flat.findOne({ flatnumber });
  const flatid = flat._id;

  if (purpose === "Cash withdrawal" || purpose === "Cash Deposit") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const incomeMode = purpose === "Cash withdrawal" ? "cash" : "bank";
      const expenseMode = purpose === "Cash withdrawal" ? "bank" : "cash";

      const income = await Income.create([{
        flat: flatid,
        mode: incomeMode,
        purpose,
        amount,
        createdAt: new Date() 
      }],
        { session: session }
      );

      const expense = await Expenditure.create([{
        mode: expenseMode,
        amount,
        department: "Contra Entry",
        createdAt: new Date(),
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
        flat: "admin",
        mode,
        purpose,
        amount,
        createdAt: new Date()
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
    const { mode, amount, executive_name, department, partyname, partycontact, description } = req.body;
    const expense = await Expenditure.create(
      {
        mode,
        amount,
        executive_name,
        department,
        partyname,
        partycontact,
        description,
        createdAt: new Date(),
      }
    );
    res.status(201).json(
      new ApiResponse(200, { expense }, "expense added successfully")
    );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
})
const getTransaction = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id
  const data = await Transaction.find({flat: flatid})
  console.log(data)
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
  console.log(totalIncomeBank)
  const cash = (totalIncomeCash[0])?totalIncomeCash[0].totalIncome : 0
  const bank = (totalIncomeBank[0])?totalIncomeBank[0].totalIncome : 0
  console.log("cash", cash)
  console.log("bank", bank)
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
  console.log("hello i am in transaction")
  const flatid = req?.flat._id;
  console.log("hello i am kush")
  const data = await Transaction.find({ flat: flatid }).limit(5);
  console.log(data);
  res.status(200).json(new ApiResponse(200, data, "Top 5 transaction data fetched"));
});
const getMaintenanceRecord = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id;
  const record = await Maintenance.findOne({flat: flatid});
  res.status(200)
  .json(new ApiResponse(200, record.months, "Data fetched successfully"))
})
const getAllMaintenanceRecord = asyncHandler(async(req, res) => {
  const mainrecord = await Maintenance.find().populate("flat");
  console.log(mainrecord)
  res.status(200).json(new ApiResponse(200, {mainrecord}, "Data fetched successfully"))
})
const getIncomeStatements = asyncHandler(async (req, res) => {
  const { purpose, flatnumber, start_date, end_date } = req.body;
  let query = {};

  if (flatnumber && purpose && start_date && end_date) {
    const flat = await Flat.findOne({ flatnumber });
    if (flat) {
        query = { flat, purpose, created_At: { $gte: start_date, $lte: end_date } };
    }
} else if (flatnumber && purpose) {
    const flat = await Flat.findOne({ flatnumber });
    if (flat) {
        query = { flat, purpose };
    }
} else if (flatnumber) {
    const flat = await Flat.findOne({ flatnumber });
    if (flat) {
        query = { flat };
    }
} else if (purpose) {
    query = { purpose };
} else if (start_date && end_date) {
    query = { created_At: { $gte: start_date, $lte: end_date } };
}

  let IncomeHeads = [];
    // Fetch distinct income heads
    IncomeHeads = await Income.distinct('purpose');
    // Fetch income records based on the query
    const incomeRecords = await Income.find(query).populate('flat');
    // Extract flat numbers from populated flats
    const incomeStatements = incomeRecords.map(record => {
      const flatnumber = record.flat.flatnumber;
      return { ...record._doc, flatnumber };
    });
    console.log(incomeStatements)

    res.status(200).json(new ApiResponse(200, { incomeStatements, IncomeHeads }, "Income statements returned"));
});
const getExpenditureStatements = asyncHandler(async (req, res) => {
  const { department, executive_name, mode, start_date, end_date } = req.body;
  const query = {};

  // Adding non-null fields to the query object
  if (department !== null && department !== undefined) {
    query.department = department;
  }
  if (executive_name !== null && executive_name !== undefined) {
    query.executive_name = executive_name;
  }
  if (mode !== null && mode !== undefined) {
    query.mode = mode;
  }
  if (start_date !== null && start_date !== undefined && end_date !== null && end_date !== undefined) {
    query.date = { $gte: start_date, $lte: end_date };
  }

  // Performing the query
  const ExpHeads = await Expenditure.distinct('department');
  const ExpRecords = await Expenditure.find(query);
    
  res.status(200).json(new ApiResponse(200, { ExpRecords, ExpHeads }, "Exp statements returned"));
});
const incomeexpaccount = asyncHandler(async(req, res) => {
  console.log("hello")
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
  const cashincome = await Income.find({mode, purpose: { $nin: ["Cash withdrawal", "Cash Deposit"] }}).populate('flat');
  const cashexpense = await Expenditure.find({mode, department: { $ne: "Contra Entry" } });
  const cashincomeState = cashincome.map(record => {
    const flatnumber = record.flat.flatnumber;
    return { ...record._doc, flatnumber };
  });
  console.log(cashincome)
  console.log(cashexpense)
  res.status(200).json(new ApiResponse(200, {cashincomeState, cashexpense}, "cashbook data received"))
})
export { addTransaction, addTransactionByAdmin, addIncomeByAdmin, 
  addExpenditure, getTransaction, getTotalIncome, getTotalExpenditure,
getCashBalance, getTransaction5, getMaintenanceRecord, getIncomeStatements, getAllMaintenanceRecord, getExpenditureStatements, incomeexpaccount, cashbook, sendEmail};