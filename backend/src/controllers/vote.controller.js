import { asyncHandler } from "../utils/asynchandler.js";
import { Vote } from "../models/voting.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const closeVoting = async (req, res) => {
    const { questionid } = req.body;
    const vote = await Vote.findById(questionid);

    if (!vote) {
        throw new ApiError(404, 'Question not found');
    }

    vote.closed = true;
    await vote.save();

    res.status(200).json(new ApiResponse(200, 'Voting closed successfully'));
};
const yesvote = async (req, res) => {
    const userId = req?.flat?._id;
    const questionId = req.body.questionid;
    const vote = await Vote.findById(questionId);

    if (!vote) {
        throw new ApiError(404, 'Question not found');
    }

    if (vote.yes.includes(userId) || vote.no.includes(userId)) {
        console.log("voted before")
        throw new ApiError(400, 'You have already voted on this question');
    }

    vote.yes.push(userId);
    await vote.save();
    res.status(200).json(new ApiResponse(200, 'Vote Yes recorded successfully'));
};
const novote = async (req, res) => {
    const userId = req?.flat?._id;
    const questionId = req.body.questionid;
    const vote = await Vote.findById(questionId);

    if (!vote) {
        throw new ApiError(404, 'Question not found');
    }

    if (vote.yes.includes(userId) || vote.no.includes(userId)) {
        throw new ApiError(400, 'You have already voted on this question');
    }

    vote.no.push(userId);
    await vote.save();

    res.status(200).json(new ApiResponse(200, 'Vote No recorded successfully'));
};
const addquestion = asyncHandler(async(req, res) => {
    const {question} = req.body
    const vote = await Vote.create({
        question
    })
    if(!vote) throw new ApiError(500, "Something went wrong")
    return res.status(200).json(new ApiResponse(200, "Question raised"))
})
const getquestions = asyncHandler(async (req, res) => {
    const questions = await Vote.find()
    return res.status(200).json(new ApiResponse(200, questions, "All questions fetched"))
})

export {yesvote, novote, addquestion, getquestions, closeVoting}
