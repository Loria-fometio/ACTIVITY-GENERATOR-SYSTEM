import express from "express";
import Activity from "../models/Activity.js";
import RecommendationHistory from "../models/RecommendationHistory.js";
import fs from "fs";

const router = express.Router();

// Load fallback activities from activities.json
const fallbackLibrary = JSON.parse(fs.readFileSync("activities.json", "utf-8"));

// Utility: pick random item
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ✅ Fallback generator restricted to user preferences, duration calculated dynamically, duplicates eliminated
function dynamicFallback(preferences, availableTime, goal, maxActivities) {
  const durationPerActivity = Math.floor(availableTime / maxActivities);
  const generated = [];
  const categories = preferences.length > 0 ? preferences : [];

  const usedTitles = new Set();

  while (generated.length < maxActivities) {
    const pref = randomChoice(categories);
    const library = fallbackLibrary.filter(
      a => a.preference === pref && a.goal === goal
    );
    const activity = randomChoice(library.length > 0 ? library : fallbackLibrary);

    if (!usedTitles.has(activity.title)) {
      generated.push({
        title: activity.title,
        description: activity.description,
        preference: pref,
        goal,
        duration: durationPerActivity
      });
      usedTitles.add(activity.title);
    }
    // Prevent infinite loop if library runs out of unique activities
    if (usedTitles.size === fallbackLibrary.length) break;
  }

  return generated;
}

// 🟢 Hybrid Recommend Route
router.post("/", async (req, res) => {
  try {
    const { preferences, availableTime, goal, maxActivities } = req.body;
    const requested = maxActivities || 6;

    // Step 1: Query DB — all matches
    let activities = await Activity.find({
      preference: { $in: preferences },
      goal
    });

    let source = "database";
    let fallbackActivities = [];

    // Step 2: Fill with fallback if DB has fewer than requested
    if (activities.length < requested) {
      const needed = requested - activities.length;
      fallbackActivities = dynamicFallback(preferences, availableTime, goal, needed);
      const insertedFallback = await Activity.insertMany(fallbackActivities);
      activities = [...activities, ...insertedFallback];
      source = activities.length === 0 ? "fallback" : "mixed";
    }

    // Step 3: Assign dynamic duration to all activities
    const durationPerActivity = Math.floor(availableTime / requested);
    activities = activities.map(a => ({
      ...a.toObject(),
      duration: durationPerActivity
    }));

    // Step 4: Remove duplicates by title across DB + fallback
    const uniqueActivities = [];
    const seenTitles = new Set();

    for (const act of activities) {
      if (!seenTitles.has(act.title)) {
        uniqueActivities.push(act);
        seenTitles.add(act.title);
      }
    }

    // Step 5: Save history
    const history = await RecommendationHistory.create({
      preferences,
      goal,
      maxActivities: requested,
      activities: uniqueActivities.map(a => a._id),
      rawResponse: {},
      source
    });

    // Step 6: Respond with breakdown
    res.json({
      source,
      databaseActivities: uniqueActivities.filter(
        a => !fallbackActivities.find(f => f.title === a.title)
      ),
      fallbackActivities,
      allActivities: await history.populate("activities")
    });
  } catch (err) {
    console.error("❌ Error in /api/recommend:", err);
    res.status(500).json({ error: "Failed to generate activities" });
  }
});

export default router;
