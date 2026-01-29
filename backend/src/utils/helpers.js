// Helper functions for YOUR service

// Generate unique timetable ID
function generateTimetableId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `tt_${timestamp}_${random}`;
}

// Calculate week dates (Monday to Sunday)
function getWeekDates(date = new Date()) {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, ...
  
  // Calculate Monday (if Sunday, go back 6 days)
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  
  // Calculate Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    weekStartDate: formatDate(monday),
    weekEndDate: formatDate(sunday),
    weekNumber: getWeekNumber(monday)
  };
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get week number
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);
  return weekNumber;
}

// Days of week
const DAYS_OF_WEEK = [
  { number: 0, name: 'Monday' },
  { number: 1, name: 'Tuesday' },
  { number: 2, name: 'Wednesday' },
  { number: 3, name: 'Thursday' },
  { number: 4, name: 'Friday' },
  { number: 5, name: 'Saturday' },
  { number: 6, name: 'Sunday' }
];

module.exports = {
  generateTimetableId,
  getWeekDates,
  formatDate,
  getWeekNumber,
  DAYS_OF_WEEK
};