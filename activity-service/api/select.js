import express from "express";
import ActivitySelection from "../models/ActivitySelection.js";

const router = express.Router();

// Save selected activities for a session
router.post("/", async (req, res) => {
  try {
    const { sessionId, activityIds } = req.body;

    await ActivitySelection.insertMany(
      activityIds.map(id => ({ sessionId, activityId: id }))
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in /api/select:", err);
    res.status(500).json({ error: "Failed to save selections" });
  }
});

export default router;
