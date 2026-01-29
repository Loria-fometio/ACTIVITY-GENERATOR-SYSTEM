const express = require('express');
const router = express.Router();

// Store timetables in memory (temporary)
let timetablesStorage = [];

// GET all timetables
router.get('/', (req, res) => {
  console.log('📡 GET / - Timetables in storage:', timetablesStorage.length);
  res.json({
    success: true,
    message: 'All timetables',
    data: timetablesStorage
  });
});

// GET timetable by ID
router.get('/:id', (req, res) => {
  const timetableId = req.params.id;
  console.log('📡 GET /:id - Looking for:', timetableId);
  
  // Find the timetable in storage
  const timetable = timetablesStorage.find(tt => tt.timetable_id === timetableId);
  
  if (timetable) {
    res.json({
      success: true,
      message: `Timetable found`,
      data: timetable
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Timetable not found'
    });
  }
});

// POST generate timetable
router.post('/generate', (req, res) => {
  const { 
    userId = 'demo_user',
    title = 'My Timetable', 
    activities = [],
    generationMethod = 'balanced'
  } = req.body;
  
  console.log('📡 POST /generate - Request:', { title, activitiesCount: activities.length });
  
  if (!activities || activities.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one activity is required'
    });
  }
  
  // Simple generation
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const generatedActivities = [];
  
  for (let i = 0; i < days.length; i++) {
    const activity = activities[i % activities.length] || activities[0];
    
    generatedActivities.push({
      day: days[i],
      activityId: `act_${i}`,
      activityName: activity.name || `Activity ${i}`,
      category: activity.category || 'general',
      durationMinutes: activity.duration || 60,
      startTime: '09:00:00'
    });
  }
  
  const timetableId = `tt_${Date.now()}`;
  const timetable = {
    timetable_id: timetableId,
    userId: userId,
    title: title,
    week_start_date: new Date().toISOString().split('T')[0],
    week_end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    generation_method: generationMethod,
    generatedAt: new Date().toISOString(),
    activities: generatedActivities,
    status: 'active',
    icon: 'general'
  };
  
  // STORE THE TIMETABLE IN MEMORY
  timetablesStorage.push(timetable);
  console.log('✅ Timetable stored. Total:', timetablesStorage.length);
  
  res.status(201).json({
    success: true,
    message: 'Timetable generated successfully',
    data: timetable
  });
});

// PATCH complete activity
router.patch('/activity/:id/complete', (req, res) => {
  const activityId = req.params.id;
  const { rating, notes } = req.body;
  
  console.log('📡 PATCH /activity/:id/complete - Activity:', activityId);
  
  res.json({
    success: true,
    message: `Activity ${activityId} marked as completed`,
    data: {
      activityId: activityId,
      completed: true,
      completedAt: new Date().toISOString(),
      rating: rating || 5,
      notes: notes || ''
    }
  });
});

// DELETE timetable
router.delete('/:id', (req, res) => {
  const timetableId = req.params.id;
  console.log('📡 DELETE /:id - Deleting:', timetableId);
  
  // Remove from storage
  const initialLength = timetablesStorage.length;
  timetablesStorage = timetablesStorage.filter(tt => tt.timetable_id !== timetableId);
  
  if (timetablesStorage.length < initialLength) {
    res.json({
      success: true,
      message: `Timetable ${timetableId} deleted successfully`,
      deletedId: timetableId
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Timetable not found'
    });
  }
});

// Make sure you export the router
module.exports = router;