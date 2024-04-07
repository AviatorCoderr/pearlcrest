import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Transaction from "../models/transactions.model.js";
import Income from "../models/income.model.js";
import mongoose from "mongoose";
import {Flat} from "../models/flats.model.js"
import Expenditure from "../models/expenditures.model.js";

const addTransaction = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { mode, purpose, amount, months, transactionId } = req.body;
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
    console.log(months)
    const flat = await Flat.findOne({flatnumber})
    const flatid = flat._id
    console.log(flatid)
    // add transaction date
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
      },],
      { session: session }
    );
    const incomerecord = await Income.create(
      [{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: date,
      },],
      { session: session }
    );
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
const addIncomeByAdmin = asyncHandler(async(req, res) => {
  const { mode, purpose, amount } = req.body;
  const flatnumber = "ADMIN"
  const flat = await Flat.findOne({flatnumber})
  const flatid = flat._id
  if(mode==="cash" && purpose==="Cash withdrawal"){
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const income = await Income.create([{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date()
      },],
      { session: session })
      const expense = await Expenditure.create([{
        mode: "bank",
        amount,
        department: "Contra Entry",
        createdAt: new Date(),
      },],
      { session: session })
      await session.commitTransaction()
      res.status(201).json(
        new ApiResponse(200, { expense, income }, "income and expense added successfully")
      );
    } catch (error) {
      session.abortTransaction()
      throw new ApiError(500, error.message);
    } finally {
      session.endSession()
    }
  }
  else if(mode==="online" && purpose==="Cash Deposit"){
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const income = await Income.create([{
        flat: flatid,
        mode,
        purpose,
        amount,
        createdAt: new Date()
      },],
      { session: session })
      const expense = await Expenditure.create([{
        mode: "cash",
        amount,
        department: "Contra Entry",
        createdAt: new Date(),
      },],
      { session: session })
      await session.commitTransaction()
      res.status(201).json(
        new ApiResponse(200, { expense, income }, "income and expense added successfully")
      );
    } catch (error) {
      session.abortTransaction()
      throw new ApiError(500, error.message);
    } finally {
      session.endSession()
    }
  }
  else{
    const income = await Income.create({
      flat: "admin",
      mode,
      purpose,
      amount,
      createdAt: new Date()
    })
    res.status(201)
    .json(new ApiResponse(200, {income}, "income added successfully"))
  }
  // mode is cash and purpose is cash withdrawal 
  // add record in income money received in cash
  // add record in expenditure money debited from bank

  // if mode is online and purpose is cash to bank
  // add record in income money recieved in bank
  // add record in expenditure money debited from cash
})
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
  const totalIncomeAggregate = await Income.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" }
      }
    }
  ])
  const totalIncome = totalIncomeAggregate.length > 0 ? totalIncomeAggregate[0].totalIncome : 0;
  res.status(200)
  .json(new ApiResponse(200, {totalIncome}, "Income total return"))
})
const getTotalExpenditure = asyncHandler(async (req, res) => {
  const totalExpenditureAggregate = await Expenditure.aggregate([
    {
      $group: {
        _id: null,
        totalExp: { $sum: "$amount" }
      }
    }
  ])
  const totalExpenditure = totalExpenditureAggregate.length > 0 ? totalExpenditureAggregate[0].totalExp : 0;
  res.status(200)
  .json(new ApiResponse(200, {totalExpenditure}, "Income total return"))
})
const getCashBalance = asyncHandler(async (req, res) => {
})
const getTransaction5 = asyncHandler(async(req, res) => {
  const flatid = req?.flat._id;
  const data = await Transaction.find({ flat: flatid }).limit(5);
  console.log(data);
  res.status(200).json(new ApiResponse(200, data, "Top 5 transaction data fetched"));
});
export { addTransaction, addTransactionByAdmin, addIncomeByAdmin, 
  addExpenditure, getTransaction, getTotalIncome, getTotalExpenditure,
getCashBalance, getTransaction5};