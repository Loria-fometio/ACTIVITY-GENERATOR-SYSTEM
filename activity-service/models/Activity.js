import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  preference: { type: String, required: true },
  goal: { type: String, required: true },
  category: { type: [String], required: true },
  duration: { type: Number, required: true }
});

// ✅ Default export
export default mongoose.model("Activity", activitySchema);
