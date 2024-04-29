import mongoose from "mongoose";
const MaintenanceSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    months: [{
        type: String,
        required: true,
        trim: true
    }]
})
const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
export default Maintenance;