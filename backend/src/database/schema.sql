-- Create timetables table
CREATE TABLE timetables (
    id SERIAL PRIMARY KEY,
	timetable_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    week_start_date DATE NOT NULL,
	week_end_date DATE NOT NULL,
    title VARCHAR(200) DEFAULT 'My Weekly Plan',
    is_generated BOOLEAN DEFAULT false,
	generation_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create timetable_activities table
CREATE TABLE timetable_activities (
    id SERIAL PRIMARY KEY,
    timetable_id VARCHAR(50) REFERENCES timetables(timetable_id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL, -- 0=Monday, 1=Tuesday, ..., 6=Sunday
	day_name VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
	duration_minutes INTEGER DEFAULT 30,
	start_time TIME,
	is_completed BOOLEAN DEFAULT FALSE,
	completion_date TIMESTAMP,
	user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
	user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- generation_logs (track when timetables are generated)
CREATE TABLE generation_logs (
    id SERIAL PRIMARY KEY,
    timetable_id VARCHAR(50),
    user_id VARCHAR(100) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferences_used JSONB,                    -- Store what preferences were used
    activities_count INTEGER,
    generation_duration_ms INTEGER,
    status VARCHAR(20) DEFAULT 'success'       -- 'success', 'partial', 'failed'
);

-- Create indexes for faster queries
CREATE INDEX idx_timetables_user_id ON timetables(user_id);
CREATE INDEX idx_timetables_week_start ON timetables(week_start_date);
CREATE INDEX idx_activities_timetable_id ON timetable_activities(timetable_id);
CREATE INDEX idx_activities_day ON timetable_activities(day_number);