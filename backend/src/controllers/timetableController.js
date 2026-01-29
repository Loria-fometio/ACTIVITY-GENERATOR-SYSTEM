const Timetable = require('../models/Timetable');
const TimetableGenerator = require('../services/timetableGenerator');
const helpers = require('../utils/helpers');

class TimetableController {
  // Generate new timetable
  static async generate(req, res) {
    try {
      const { userId, generationMethod = 'random', activities = [] } = req.body;
      
      // Validate
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }
      
      if (activities.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one activity is required'
        });
      }
      
      // Generate timetable ID
      const timetableId = helpers.generateTimetableId();
      
      // Get week dates
      const weekDates = helpers.getWeekDates();
      
      // Generate activities based on method
      let dailyActivities;
      switch (generationMethod) {
        case 'balanced':
          dailyActivities = TimetableGenerator.generateBalanced(activities);
          break;
        case 'smart':
          dailyActivities = TimetableGenerator.generateSmart(activities);
          break;
        case 'random':
        default:
          dailyActivities = TimetableGenerator.generateRandom(activities);
      }
      
      // Create timetable in database
      const timetable = await Timetable.create({
        timetableId,
        userId,
        title: `Weekly Plan - Week ${weekDates.weekNumber}`,
        weekStartDate: weekDates.weekStartDate,
        weekEndDate: weekDates.weekEndDate,
        isGenerated: true,
        generationMethod
      });
      
      // Add activities to timetable
      const addedActivities = [];
      for (const activity of dailyActivities) {
        if (activity.activityId) {
          const added = await Timetable.addActivity(timetableId, activity);
          addedActivities.push(added);
        }
      }
      
      // Get complete timetable with activities
      const completeTimetable = await Timetable.findById(timetableId);
      
      res.status(201).json({
        success: true,
        message: 'Timetable generated successfully',
        data: completeTimetable,
        generationInfo: {
          method: generationMethod,
          activitiesCount: addedActivities.length,
          week: weekDates.weekNumber
        }
      });
      
    } catch (error) {
      console.error('Generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate timetable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  // Get timetable by ID
  static async getById(req, res) {
    try {
      const { timetableId } = req.params;
      
      const timetable = await Timetable.findById(timetableId);
      
      if (!timetable) {
        return res.status(404).json({
          success: false,
          error: 'Timetable not found'
        });
      }
      
      res.json({
        success: true,
        data: timetable
      });
      
    } catch (error) {
      console.error('Get timetable error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get timetable'
      });
    }
  }
  
  // Get user's timetables
  static async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;
      
      const timetables = await Timetable.findByUser(userId, parseInt(limit));
      
      res.json({
        success: true,
        data: timetables,
        count: timetables.length
      });
      
    } catch (error) {
      console.error('Get user timetables error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user timetables'
      });
    }
  }
  
  // Get current week's timetable
  static async getCurrentWeek(req, res) {
    try {
      const { userId } = req.params;
      
      const timetable = await Timetable.getCurrentWeek(userId);
      
      if (!timetable) {
        return res.status(404).json({
          success: false,
          error: 'No timetable found for current week',
          suggestion: 'Generate a new timetable'
        });
      }
      
      res.json({
        success: true,
        data: timetable
      });
      
    } catch (error) {
      console.error('Get current week error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get current week timetable'
      });
    }
  }
  
  // Mark activity as completed
  static async completeActivity(req, res) {
    try {
      const { activityId } = req.params;
      const { rating, notes } = req.body;
      
      const activity = await Timetable.completeActivity(activityId, rating, notes);
      
      if (!activity) {
        return res.status(404).json({
          success: false,
          error: 'Activity not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Activity marked as completed',
        data: activity
      });
      
    } catch (error) {
      console.error('Complete activity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete activity'
      });
    }
  }
  
  // Delete timetable
  static async delete(req, res) {
    try {
      const { timetableId } = req.params;
      
      const deleted = await Timetable.delete(timetableId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Timetable not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Timetable deleted successfully',
        data: deleted
      });
      
    } catch (error) {
      console.error('Delete timetable error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete timetable'
      });
    }
  }
}

module.exports = TimetableController;