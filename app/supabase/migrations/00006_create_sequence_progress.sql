-- Tracks where user is in each sequence
-- Enables "pick up where you left off" functionality

CREATE TYPE progress_status AS ENUM (
    'not_started',
    'in_progress',
    'completed'
);

CREATE TABLE sequence_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- For onboarding: daily_log_id is NULL
    -- For morning/evening: daily_log_id links to that day's log
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    
    sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
    
    -- Current position
    current_page_id UUID REFERENCES pages(id),
    current_page_key TEXT,              -- Denormalized for easier access
    
    -- Status
    status progress_status DEFAULT 'not_started',
    
    -- Path choices for branching (e.g., {"v1-o-3": "yes", "v1-e-2": "commit"})
    path_choices JSONB DEFAULT '{}',
    
    -- Timestamps
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER update_sequence_progress_updated_at
    BEFORE UPDATE ON sequence_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get or create sequence progress
CREATE OR REPLACE FUNCTION get_or_create_sequence_progress(
    p_user_id UUID, 
    p_sequence_key TEXT,
    p_daily_log_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    progress_id UUID;
    seq_id UUID;
BEGIN
    -- Get sequence ID
    SELECT id INTO seq_id FROM sequences WHERE key = p_sequence_key AND active = true;
    
    IF seq_id IS NULL THEN
        RAISE EXCEPTION 'Sequence not found: %', p_sequence_key;
    END IF;
    
    -- Try to get existing progress
    SELECT id INTO progress_id FROM sequence_progress 
    WHERE user_id = p_user_id 
    AND sequence_id = seq_id
    AND (daily_log_id = p_daily_log_id OR (daily_log_id IS NULL AND p_daily_log_id IS NULL));
    
    -- Create if doesn't exist
    IF progress_id IS NULL THEN
        INSERT INTO sequence_progress (user_id, sequence_id, daily_log_id, status)
        VALUES (p_user_id, seq_id, p_daily_log_id, 'not_started')
        RETURNING id INTO progress_id;
    END IF;
    
    RETURN progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX idx_sequence_progress_user ON sequence_progress(user_id);
CREATE INDEX idx_sequence_progress_daily ON sequence_progress(daily_log_id);
CREATE INDEX idx_sequence_progress_sequence ON sequence_progress(sequence_id);
CREATE INDEX idx_sequence_progress_status ON sequence_progress(status);
