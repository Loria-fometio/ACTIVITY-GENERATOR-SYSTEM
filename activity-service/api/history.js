import express from "express";
import RecommendationHistory from "../models/RecommendationHistory.js";

const router = express.Router();

// Get recent recommendation history (duplicates eliminated)
router.get("/", async (req, res) => {
  try {
    const histories = await RecommendationHistory.find()
      .populate("activities")
      .sort({ createdAt: -1 })
      .limit(50);

    // Remove duplicate activities by title in each history entry
    const cleanedHistories = histories.map(history => {
      const seenTitles = new Set();
      const uniqueActivities = history.activities.filter(act => {
        if (!seenTitles.has(act.title)) {
          seenTitles.add(act.title);
          return true;
        }
        return false;
      });
      return {
        ...history.toObject(),
        activities: uniqueActivities
      };
    });

    res.json(cleanedHistories);
  } catch (err) {
    console.error("❌ Error in /api/history:", err);
    res.status(500).json({ error: "Failed to fetch histories" });
  }
});

export default router;
