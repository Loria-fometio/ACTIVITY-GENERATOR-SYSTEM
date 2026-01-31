import Activity from "../models/Activity.js";  // ✅ default import

export async function getRecommendations(req, res) {
  const { preferences, goal, timeAvailable, maxActivities } = req.body;

  try {
    // Normalize inputs
    const normalizedPreferences = preferences
      ? (Array.isArray(preferences) ? preferences : [preferences]).map(p => p.toLowerCase())
      : [];
    const normalizedGoal = goal ? goal.toLowerCase() : null;

    // Build query dynamically
    const query = {};

    // Preferences fuzzy match (case-insensitive)
    if (normalizedPreferences.length > 0) {
      query.preference = { $in: normalizedPreferences.map(p => new RegExp(p, "i")) };
    }

    // Goal fuzzy match (case-insensitive)
    if (normalizedGoal) {
      query.goal = new RegExp(normalizedGoal, "i");
    }

    // Category fuzzy match (case-insensitive, partial match)
    if (normalizedPreferences.length > 0) {
      query.category = { $in: normalizedPreferences.map(c => new RegExp(c, "i")) };
    }

    // Find matching activities
    const activities = await Activity.find(query);

    // Duration logic
    const count = activities.length;
    const duration = count > 1 ? Math.floor(timeAvailable / count) : timeAvailable;

    // Select top N activities
    const selected = activities.slice(0, maxActivities).map((a) => ({
      id: a._id,
      title: a.title,
      description: a.description,
      preference: a.preference,
      goal: a.goal,
      category: a.category,
      duration: duration || a.duration,
    }));

    res.json(selected);
  } catch (err) {
    console.error("❌ Error fetching recommendations:", err);
    res.status(500).json({ error: "Server error" });
  }
}
