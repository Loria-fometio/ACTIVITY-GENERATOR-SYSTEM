const helpers = require('../utils/helpers');

class TimetableGenerator {
  // Generate random timetable
  static generateRandom(activities, preferences = null) {
    const { DAYS_OF_WEEK } = helpers;
    const timetable = [];
    
    for (const day of DAYS_OF_WEEK) {
      // If no activities, skip
      if (!activities || activities.length === 0) {
        timetable.push({
          dayNumber: day.number,
          dayName: day.name,
          activity: null,
          isEmpty: true
        });
        continue;
      }
      
      // Pick random activity
      const randomIndex = Math.floor(Math.random() * activities.length);
      const activity = activities[randomIndex];
      
      timetable.push({
        dayNumber: day.number,
        dayName: day.name,
        activityId: activity.id,
        activityName: activity.name,
        category: activity.category,
        durationMinutes: activity.duration || 30,
        startTime: this.suggestStartTime(day.number)
      });
    }
    
    return timetable;
  }
  
  // Generate balanced timetable (spreads categories)
  static generateBalanced(activities, preferences) {
    const { DAYS_OF_WEEK } = helpers;
    const timetable = [];
    
    // Group activities by category
    const activitiesByCategory = {};
    activities.forEach(activity => {
      if (!activitiesByCategory[activity.category]) {
        activitiesByCategory[activity.category] = [];
      }
      activitiesByCategory[activity.category].push(activity);
    });
    
    // Get list of categories
    const categories = Object.keys(activitiesByCategory);
    
    // If no categories, return random
    if (categories.length === 0) {
      return this.generateRandom(activities);
    }
    
    // Assign categories to days
    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      const day = DAYS_OF_WEEK[i];
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      const categoryActivities = activitiesByCategory[category];
      
      if (categoryActivities && categoryActivities.length > 0) {
        const activity = categoryActivities[
          Math.floor(Math.random() * categoryActivities.length)
        ];
        
        timetable.push({
          dayNumber: day.number,
          dayName: day.name,
          activityId: activity.id,
          activityName: activity.name,
          category: activity.category,
          durationMinutes: activity.duration || 30,
          startTime: this.suggestStartTime(day.number)
        });
      }
    }
    
    return timetable;
  }
  
  // Generate smart timetable (more complex logic)
  static generateSmart(activities, preferences, userHistory = null) {
    const { DAYS_OF_WEEK } = helpers;
    const timetable = [];
    
    // Simple smart rules:
    // 1. Avoid same category two days in a row
    // 2. Shorter activities on weekdays
    // 3. Mix categories throughout week
    
    let lastCategory = null;
    
    for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
      const day = DAYS_OF_WEEK[i];
      const isWeekday = i < 5; // Monday-Friday
      
      // Filter activities
      let availableActivities = activities.filter(activity => {
        // Rule 1: Don't repeat same category
        if (lastCategory && activity.category === lastCategory) {
          return false;
        }
        
        // Rule 2: Weekdays prefer shorter activities
        if (isWeekday) {
          const duration = activity.duration || 30;
          return duration <= 60; // Max 1 hour on weekdays
        }
        
        return true;
      });
      
      // If no activities available, use all
      if (availableActivities.length === 0) {
        availableActivities = activities;
      }
      
      // Pick random from available
      const randomIndex = Math.floor(Math.random() * availableActivities.length);
      const activity = availableActivities[randomIndex];
      
      // Update last category
      lastCategory = activity.category;
      
      timetable.push({
        dayNumber: day.number,
        dayName: day.name,
        activityId: activity.id,
        activityName: activity.name,
        category: activity.category,
        durationMinutes: activity.duration || 30,
        startTime: this.suggestStartTime(day.number)
      });
    }
    
    return timetable;
  }
  
  // Suggest start time based on day
  static suggestStartTime(dayNumber) {
    // Monday-Thursday: Evening (after work/school)
    if (dayNumber >= 0 && dayNumber <= 3) {
      return '18:00:00';
    }
    // Friday: Later evening
    else if (dayNumber === 4) {
      return '19:00:00';
    }
    // Saturday: Afternoon
    else if (dayNumber === 5) {
      return '15:00:00';
    }
    // Sunday: Morning
    else {
      return '10:00:00';
    }
  }
}

module.exports = TimetableGenerator;