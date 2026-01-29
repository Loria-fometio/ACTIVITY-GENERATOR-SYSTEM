const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

// POST route to generate activity
router.post('/generate', activityController.generateActivity);

// GET route to test server
router.get('/example', activityController.exampleFunction);
router.get('/history', activityController.getHistory);
router.get('/stats', activityController.getStats);

module.exports = router;
