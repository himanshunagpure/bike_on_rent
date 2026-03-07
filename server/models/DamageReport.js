import mongoose from "mongoose";


const DamageReportSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    description: String,
    damagePhotos: [String],
    estimatedRepairCost: Number,
    status: {
        type: String,
        enum: ["reported", "under_review", "resolved"],
        default: "reported"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("DamageReport", DamageReportSchema);