import mongoose from "mongoose";

const expenditureSchema = new mongoose.Schema({
    mode: {
        type: String,
        trim: true,
        uppercase: true
    },
    amount: {
        type: Number,
        min: 0
    },
    executive_name: {
        type: String,
        trim: true,
        uppercase: true
    },
    department: {
        type: String,
        trim: true,
        uppercase: true
    },
    partyname: {
        type: String,
        trim: true,
        uppercase: true
    },
    partycontact: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
});

const Expenditure = mongoose.model("Expenditure", expenditureSchema);

export default Expenditure;
