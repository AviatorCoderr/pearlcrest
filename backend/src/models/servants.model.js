import mongoose from "mongoose";

const servantSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    name: {
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        trim: true
    },
    aadhar: {
        type: String,
        trim: true
    },
    checkin: {
        type: Date,
        trim: true
    },
    checkout: {
       type: Date,
       trim: true 
    }
});

const Servant = mongoose.model("Servant", servantSchema);

export default Servant;
