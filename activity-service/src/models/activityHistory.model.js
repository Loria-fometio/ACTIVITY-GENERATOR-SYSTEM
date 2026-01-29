// const ActivityHistory = require('../models/activityHistory.model.js');

// module.exports.generateActivity = async (req, res) => {
//   const { energy, goal, time, environment } = req.body;

//   const context = {
//     energy: energy || 'medium',
//     goal: goal || 'Health',
//     time: time ? parseInt(time, 10) : 30,
//     environment: environment || 'any'
//   };

//   const activity = generateActivity(context);

//   //creating mongoose entry
//   await ActivityHistory.create({
//     activity: activity.activity,
//     goal: context.goal,
//     energy: context.energy,
//     environment: context.environment,
//     time: context.time
//   });

//   res.json({
//     activity: activity.activity,
//     details: activity
//   });
// };

const mongoose = require('mongoose');

const activityHistorySchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  activity: String,
  goal: String,
  energy: String,
  environment: String,
  duration: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityHistory', activityHistorySchema);
