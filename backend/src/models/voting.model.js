import mongoose, { mongo } from "mongoose";
const voteSchema = new mongoose.Schema({
    question: {
        type: String
    },
    yes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    no: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }]
});

export const Vote = mongoose.model("Vote", voteSchema);
