import mongoose from "mongoose";
const MaintenanceSchema = new mongoose.Schema({
    flat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    },
    months: [{
        type: String,
        trim: true
    }]
})
const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);
export default Maintenance;