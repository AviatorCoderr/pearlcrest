import mongoose from "mongoose";

const servantSchema = new mongoose.Schema({
    flat: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    name: {
        type: String,
        required: [true, "Servant's Name is required"],
        trim: true
    },
    mobile: {
        type: String,
        required: [true, "Servant's Mobile is required"],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['driver', 'bodyguard']
    },
    aadhar: {
        type: String,
        trim: true
    }
});

const Servant = mongoose.model("Servant", servantSchema);

export default Servant;
