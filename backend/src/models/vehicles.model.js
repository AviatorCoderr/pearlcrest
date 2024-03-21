import mongoose from "mongoose";

const fourWheelerSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    reg_no: {
        type: String, 
        required: true,
        trim: true
    },
    colour: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    }
});

const twoWheelerSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    reg_no: {
        type: String, 
        required: true,
        trim: true
    },
    colour: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    }
});

const bicycleSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    colour: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    }
});

const FourWheeler = mongoose.model("FourWheeler", fourWheelerSchema);
const TwoWheeler = mongoose.model("TwoWheeler", twoWheelerSchema);
const Bicycle = mongoose.model("Bicycle", bicycleSchema);

export { FourWheeler, TwoWheeler, Bicycle};
