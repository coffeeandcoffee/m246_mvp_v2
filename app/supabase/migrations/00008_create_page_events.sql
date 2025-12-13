-- Track all page interactions for analytics
-- Powers the admin KPI dashboard

CREATE TYPE event_type AS ENUM (
    'page_view',        -- User viewed a page
    'page_complete',    -- User completed a page (clicked Next, etc.)
    'page_abandon',     -- User left without completing
    'help_click',       -- Clicked help/error/stuck button
    'error_click',
    'stuck_click',
    'link_click',       -- Clicked a feature link on last morning page
    'audio_play',       -- Started audio
    'audio_pause',      -- Paused audio
    'audio_complete'    -- Finished listening to audio
);

CREATE TABLE page_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Page context
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    page_key TEXT,                      -- Denormalized for when page is deleted
    
    -- Daily context
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    
    -- Event details
    event_type event_type NOT NULL,
    
    -- Additional metadata (flexible JSON)
    -- Examples: {link_key: "community_call"}, {audio_position: 45}, {button: "help"}
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to log a page event (convenience function)
CREATE OR REPLACE FUNCTION log_page_event(
    p_user_id UUID,
    p_page_key TEXT,
    p_event_type event_type,
    p_daily_log_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    page_uuid UUID;
    event_id UUID;
BEGIN
    -- Get page ID from key (optional, page might not exist)
    SELECT id INTO page_uuid FROM pages WHERE key = p_page_key;
    
    INSERT INTO page_events (user_id, page_id, page_key, daily_log_id, event_type, metadata)
    VALUES (p_user_id, page_uuid, p_page_key, p_daily_log_id, p_event_type, p_metadata)
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for analytics queries
CREATE INDEX idx_page_events_user ON page_events(user_id);
CREATE INDEX idx_page_events_type ON page_events(event_type);
CREATE INDEX idx_page_events_date ON page_events(created_at);
CREATE INDEX idx_page_events_page ON page_events(page_key);
