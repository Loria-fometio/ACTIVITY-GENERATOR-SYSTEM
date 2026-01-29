// src/utils/helpers.js

// Activity categories
export const ACTIVITY_CATEGORIES = [
  'fitness', 'education', 'wellness', 'skill', 'creative',
  'social', 'productivity', 'leisure', 'chore', 'other'
];

// Generation methods
export const GENERATION_METHODS = [
  'random', 'balanced', 'smart', 'focused'
];

// Generate unique activity ID
export const generateActivityId = () => {
  return `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate timetable ID
export const generateTimetableId = () => {
  return `tt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format duration from minutes to readable format
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get day name from index
export const getDayName = (index) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[index] || 'Unknown';
};

// Get current week number
export const getCurrentWeek = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((now.getDay() + 1 + days) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
};