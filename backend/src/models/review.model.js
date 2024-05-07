import mongoose, {Schema} from "mongoose";

const reviewSchema = new mongoose.Schema({
    flatnumber: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    review: {
        type: String,
        trim: true
    }
});

export const Review = mongoose.model("Review", reviewSchema);

