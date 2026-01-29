const { generateActivity } = require('../services/activity.generator');
const activities = require('../../data/activities_1000.json');
const ActivityHistory = require('../models/activityHistory.model');

async function findActivityByMessage(message, context) {
  const lowerMessage = message.toLowerCase();

  const matchedActivities = activities.filter(a => {
    const titleMatch = a.title.toLowerCase().includes(lowerMessage);
    const tagMatch = a.tags && a.tags.some(tag => lowerMessage.includes(tag.toLowerCase()));
    return titleMatch || tagMatch;
  });

  if (matchedActivities.length) {
    const selected = matchedActivities[Math.floor(Math.random() * matchedActivities.length)];
    return {
      activity: selected.title,
      duration: selected.time,
      goal: selected.category,
      energy: selected.energy,
      environment: selected.environment,
      explanation: "Matched based on user message keywords"
    };
  }

  return generateActivity(context);
}

module.exports.chat = async (req, res) => {
  const { userId, message, energy, goal, time, environment } = req.body;

  const context = {
    energy: energy || 'medium',
    goal: goal || 'Health',
    time: time ? parseInt(time, 10) : 30,
    environment: environment || 'any'
  };

  const activity = message
    ? await findActivityByMessage(message, context)
    : generateActivity(context);

  // Log activity to MongoDB
  try {
    const history = new ActivityHistory({
      userId: userId || 'anonymous',
      activity: activity.activity,
      goal: activity.goal,
      energy: activity.energy,
      environment: activity.environment,
      duration: activity.duration
    });
    await history.save();
  } catch (err) {
    console.error('Failed to save activity history:', err);
  }

  res.json({
    reply: activity.activity,
    details: activity
  });
};
