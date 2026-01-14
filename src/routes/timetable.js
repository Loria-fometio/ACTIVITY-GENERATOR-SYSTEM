const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { body, validationResult, query } = require('express-validator');
const moment = require('moment');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get weekly timetable for user
router.get('/weekly', [
  query('userId').isInt().withMessage('User ID must be an integer'),
  query('weekStart').optional().isISO8601().withMessage('Week start must be valid date')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { userId, weekStart } = req.query;
    const startDate = weekStart ? moment(weekStart).startOf('week') : moment().startOf('week');
    const endDate = moment(startDate).add(6, 'days');

    const timetable = await pool.query(
      `SELECT t.*,
        json_agg(
          json_build_object(
            'id', ts.id,
            'activity_id', ts.activity_id,
            'activity_name', a.name,
            'activity_category', a.category,
            'day_of_week', ts.day_of_week,
            'start_time', ts.start_time,
            'end_time', ts.end_time,
            'is_completed', ts.is_completed,
            'notes', ts.notes
          ) ORDER BY ts.day_of_week, ts.start_time
        ) as slots
       FROM timetables t
       LEFT JOIN timetable_slots ts ON t.id = ts.timetable_id
       LEFT JOIN activities a ON ts.activity_id = a.id
       WHERE t.user_id = $1 
         AND t.week_start_date = $2
         AND t.week_end_date = $3
       GROUP BY t.id
       ORDER BY t.week_start_date DESC`,
      [userId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
    );

    res.json({
      success: true,
      data: timetable.rows[0] || null,
      weekInfo: {
        weekStart: startDate.format('YYYY-MM-DD'),
        weekEnd: endDate.format('YYYY-MM-DD')
      }
    });
  } catch (err) {
    next(err);
  }
});

// Generate new weekly timetable
router.post('/generate', [
  body('userId').isInt().withMessage('User ID is required'),
  body('preferences').isArray().withMessage('Preferences must be an array'),
  body('preferences.*.category').isString().notEmpty(),
  body('preferences.*.timeSlots').isArray(),
  body('weekStart').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { userId, preferences, weekStart } = req.body;
    
    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const startDate = weekStart ? moment(weekStart).startOf('week') : moment().startOf('week');
      const endDate = moment(startDate).add(6, 'days');

      // Check if timetable exists for this week
      const existingTimetable = await client.query(
        'SELECT id FROM timetables WHERE user_id = $1 AND week_start_date = $2',
        [userId, startDate.format('YYYY-MM-DD')]
      );

      let timetableId;
      
      if (existingTimetable.rows.length > 0) {
        // Update existing timetable
        timetableId = existingTimetable.rows[0].id;
        await client.query(
          'DELETE FROM timetable_slots WHERE timetable_id = $1',
          [timetableId]
        );
      } else {
        // Create new timetable
        const newTimetable = await client.query(
          `INSERT INTO timetables (user_id, week_start_date, week_end_date)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [userId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
        );
        timetableId = newTimetable.rows[0].id;
      }

      // Generate timetable slots based on preferences
      const slots = [];
      
      // Sample algorithm: Distribute activities across the week
      preferences.forEach(pref => {
        pref.timeSlots.forEach(timeSlot => {
          for (let day = 0; day < 7; day++) {
            // Add some randomization
            if (Math.random() > 0.7) { // 30% chance to add activity on this day
              // Get random activity from this category
              // In real app, you'd fetch from activity service
              const activityDuration = 60; // minutes
              
              slots.push({
                timetable_id: timetableId,
                activity_id: null, // Would come from activity service
                day_of_week: day,
                start_time: timeSlot.start,
                end_time: moment(timeSlot.start, 'HH:mm').add(activityDuration, 'minutes').format('HH:mm'),
                notes: `Auto-generated ${pref.category} activity`
              });
            }
          }
        });
      });

      // Insert slots
      for (const slot of slots) {
        await client.query(
          `INSERT INTO timetable_slots 
           (timetable_id, activity_id, day_of_week, start_time, end_time, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [slot.timetable_id, slot.activity_id, slot.day_of_week, 
           slot.start_time, slot.end_time, slot.notes]
        );
      }

      await client.query('COMMIT');

      // Fetch complete timetable
      const timetable = await client.query(
        `SELECT * FROM timetables WHERE id = $1`,
        [timetableId]
      );

      res.status(201).json({
        success: true,
        message: 'Timetable generated successfully',
        data: timetable.rows[0],
        weekInfo: {
          weekStart: startDate.format('YYYY-MM-DD'),
          weekEnd: endDate.format('YYYY-MM-DD')
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

// Update timetable slot
router.patch('/slots/:slotId', [
  body('is_completed').optional().isBoolean(),
  body('notes').optional().isString(),
  body('start_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('end_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
], async (req, res, next) => {
  try {
    const { slotId } = req.params;
    const updates = req.body;

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [slotId, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE timetable_slots 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Timetable slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Slot updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// Publish timetable
router.post('/:timetableId/publish', async (req, res, next) => {
  try {
    const { timetableId } = req.params;

    const result = await pool.query(
      `UPDATE timetables 
       SET is_published = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [timetableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Timetable not found'
      });
    }

    res.json({
      success: true,
      message: 'Timetable published successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// Get user's timetable history
router.get('/history/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT t.*,
        COUNT(ts.id) as total_activities,
        COUNT(ts.id) FILTER (WHERE ts.is_completed = true) as completed_activities
       FROM timetables t
       LEFT JOIN timetable_slots ts ON t.id = ts.timetable_id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.week_start_date DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM timetables WHERE user_id = $1',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;