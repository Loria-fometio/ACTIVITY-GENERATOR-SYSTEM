const express = require('express');
const app = express();
app.use(express.json());

// Routes
const chatbotRoutes = require('./routes/chatbot.routes');
const activityRoutes = require('./routes/activity.routes');

app.use('/api/chatbot', chatbotRoutes);
app.use('/api/activity', activityRoutes);

module.exports = app;
