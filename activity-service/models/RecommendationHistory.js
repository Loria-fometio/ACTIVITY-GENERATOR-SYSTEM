import mongoose from "mongoose";

const RecommendationHistorySchema = new mongoose.Schema({
  preferences: [String],
  goal: String,
  maxActivities: Number,
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  rawResponse: Object,
  source: {
    type: String,
    enum: ["database", "fallback", "mixed"], // ✅ allow mixed
    required: true
  }
}, { timestamps: true });

export default mongoose.model("RecommendationHistory", RecommendationHistorySchema);
