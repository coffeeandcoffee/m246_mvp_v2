-- One row per user per day
-- Central table linking all daily activities

CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    
    -- Track which UX version was active this day (for analytics)
    ux_version TEXT DEFAULT 'v1',
    
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure one log per user per day
    UNIQUE(user_id, log_date)
);

-- Function to get or create today's log for a user
-- Handles timezone: caller provides the date based on user's timezone
CREATE OR REPLACE FUNCTION get_or_create_daily_log(p_user_id UUID, p_date DATE)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    -- Try to get existing log
    SELECT id INTO log_id FROM daily_logs 
    WHERE user_id = p_user_id AND log_date = p_date;
    
    -- Create if doesn't exist
    IF log_id IS NULL THEN
        INSERT INTO daily_logs (user_id, log_date) 
        VALUES (p_user_id, p_date)
        RETURNING id INTO log_id;
    END IF;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX idx_daily_logs_user ON daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date);
