const db = require('../config/database');

class Timetable {
  // Create a new timetable
  static async create(data) {
    const {
      timetableId,
      userId,
      title = 'My Weekly Plan',
      weekStartDate,
      weekEndDate,
      isGenerated = false,
      generationMethod = 'random'
    } = data;
    
    const query = `
      INSERT INTO timetables 
      (timetable_id, user_id, title, week_start_date, week_end_date, is_generated, generation_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      timetableId, 
      userId, 
      title, 
      weekStartDate, 
      weekEndDate, 
      isGenerated, 
      generationMethod
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating timetable:', error);
      throw error;
    }
  }
  
  // Get timetable by ID
  static async findById(timetableId) {
    const query = `
      SELECT t.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', ta.id,
                   'day_number', ta.day_number,
                   'day_name', ta.day_name,
                   'activity_id', ta.activity_id,
                   'activity_name', ta.activity_name,
                   'category', ta.category,
                   'duration_minutes', ta.duration_minutes,
                   'start_time', ta.start_time,
                   'is_completed', ta.is_completed,
                   'user_rating', ta.user_rating,
                   'user_notes', ta.user_notes
                 ) ORDER BY ta.day_number
               ) FILTER (WHERE ta.id IS NOT NULL), 
               '[]'::json
             ) as activities
      FROM timetables t
      LEFT JOIN timetable_activities ta ON t.timetable_id = ta.timetable_id
      WHERE t.timetable_id = $1
      GROUP BY t.id
    `;
    
    try {
      const result = await db.query(query, [timetableId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding timetable:', error);
      throw error;
    }
  }
  
  // Get user's timetables
  static async findByUser(userId, limit = 10) {
    const query = `
      SELECT * FROM timetables 
      WHERE user_id = $1 
      ORDER BY week_start_date DESC 
      LIMIT $2
    `;
    
    try {
      const result = await db.query(query, [userId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error finding user timetables:', error);
      throw error;
    }
  }
  
  // Get current week's timetable
  static async getCurrentWeek(userId) {
    const query = `
      SELECT * FROM timetables 
      WHERE user_id = $1 
        AND week_start_date <= CURRENT_DATE 
        AND week_end_date >= CURRENT_DATE
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting current week:', error);
      throw error;
    }
  }
  
  // Add activity to timetable
  static async addActivity(timetableId, activityData) {
    const {
      dayNumber,
      dayName,
      activityId,
      activityName,
      category,
      durationMinutes = 30,
      startTime = null
    } = activityData;
    
    const query = `
      INSERT INTO timetable_activities 
      (timetable_id, day_number, day_name, activity_id, activity_name, category, duration_minutes, start_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      timetableId, 
      dayNumber, 
      dayName, 
      activityId, 
      activityName, 
      category, 
      durationMinutes, 
      startTime
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }
  
  // Mark activity as completed
  static async completeActivity(activityId, rating = null, notes = null) {
    const query = `
      UPDATE timetable_activities 
      SET is_completed = TRUE, 
          completion_date = CURRENT_TIMESTAMP,
          user_rating = COALESCE($2, user_rating),
          user_notes = COALESCE($3, user_notes)
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [activityId, rating, notes]);
      return result.rows[0];
    } catch (error) {
      console.error('Error completing activity:', error);
      throw error;
    }
  }
  
  // Delete timetable
  static async delete(timetableId) {
    const query = 'DELETE FROM timetables WHERE timetable_id = $1 RETURNING *';
    
    try {
      const result = await db.query(query, [timetableId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting timetable:', error);
      throw error;
    }
  }
}

module.exports = Timetable;