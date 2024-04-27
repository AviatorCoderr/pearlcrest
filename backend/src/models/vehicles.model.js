import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    type: {
        type: String, 
        required: true,
        trim: true
    },
    reg_no: {
        type: String,
        trim: true
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

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export { Vehicle};
