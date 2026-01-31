import mongoose from "mongoose";

const ActivitySelectionSchema = new mongoose.Schema({
  sessionId: String,
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }
}, { timestamps: true });

export default mongoose.model("ActivitySelection", ActivitySelectionSchema);
