import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    type: {
        type: String,
        trim: true
    },
    reg_no: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    }
});

const ChallanSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
const Challan = mongoose.model("Challan", ChallanSchema);

export { Vehicle, Challan };
