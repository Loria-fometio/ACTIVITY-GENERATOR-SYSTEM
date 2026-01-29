const { generateActivity } = require('../services/activity.generator');
const ActivityHistory = require('../models/activityHistory.model'); // Correct casing
const activities = require('../../data/activities_1000.json');

// POST /api/activity/generate
module.exports.generateActivity = async (req, res) => {
  try {
    const { energy, goal, time, environment, userId } = req.body;

    const context = {
      energy: energy || 'medium',
      goal: goal || 'Health',
      time: time ? parseInt(time, 10) : 30,
      environment: environment || 'any'
    };

    const activity = generateActivity(context);

    // Log activity to MongoDB
    const history = new ActivityHistory({
      userId: userId || 'anonymous',
      activity: activity.activity,
      goal: activity.goal,
      energy: activity.energy,
      environment: activity.environment,
      duration: activity.duration
    });

    await history.save();

    res.json({
      activity: activity.activity,
      details: activity
    });
  } catch (err) {
    console.error('Failed to generate activity:', err);
    res.status(500).json({ error: 'Failed to generate activity' });
  }
};

// GET /api/activity/history
module.exports.getHistory = async (req, res) => {
  try {
    const history = await ActivityHistory.find().sort({ timestamp: -1 });
    res.json({ count: history.length, history });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch activity history' });
  }
};

// GET /api/activity/stats
module.exports.getStats = async (req, res) => {
  try {
    const topActivities = await ActivityHistory.aggregate([
      { $group: { _id: "$activity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const goalStats = await ActivityHistory.aggregate([
      { $group: { _id: "$goal", count: { $sum: 1 } } }
    ]);

    const environmentStats = await ActivityHistory.aggregate([
      { $group: { _id: "$environment", count: { $sum: 1 } } }
    ]);

    res.json({ topActivities, goalStats, environmentStats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Example GET endpoint
module.exports.exampleFunction = (req, res) => {
  res.send("Activity service is working!");
};
