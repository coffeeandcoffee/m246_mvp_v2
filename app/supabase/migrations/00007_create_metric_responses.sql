-- Individual responses to metrics
-- This is the core data collection table

CREATE TABLE metric_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- For onboarding metrics: daily_log_id is NULL
    -- For daily metrics: daily_log_id links to that day
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    
    metric_id UUID NOT NULL REFERENCES metrics(id) ON DELETE CASCADE,
    
    -- Flexible value storage (use appropriate column based on metric type)
    value_text TEXT,
    value_int INTEGER,
    value_date DATE,
    value_time TIME,
    value_bool BOOLEAN,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for updated_at
CREATE TRIGGER update_metric_responses_updated_at
    BEFORE UPDATE ON metric_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prevent duplicate responses for same metric on same day (or for onboarding)
-- Uses COALESCE to handle NULL daily_log_id for onboarding metrics
CREATE UNIQUE INDEX idx_metric_response_unique 
    ON metric_responses(
        user_id, 
        COALESCE(daily_log_id, '00000000-0000-0000-0000-000000000000'::UUID), 
        metric_id
    );

-- Function to upsert a metric response
CREATE OR REPLACE FUNCTION save_metric_response(
    p_user_id UUID,
    p_metric_key TEXT,
    p_daily_log_id UUID DEFAULT NULL,
    p_value_text TEXT DEFAULT NULL,
    p_value_int INTEGER DEFAULT NULL,
    p_value_date DATE DEFAULT NULL,
    p_value_time TIME DEFAULT NULL,
    p_value_bool BOOLEAN DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    metric_uuid UUID;
    response_id UUID;
BEGIN
    -- Get metric ID from key
    SELECT id INTO metric_uuid FROM metrics WHERE key = p_metric_key AND active = true;
    
    IF metric_uuid IS NULL THEN
        RAISE EXCEPTION 'Metric not found: %', p_metric_key;
    END IF;
    
    -- Upsert the response
    INSERT INTO metric_responses (
        user_id, daily_log_id, metric_id,
        value_text, value_int, value_date, value_time, value_bool
    )
    VALUES (
        p_user_id, p_daily_log_id, metric_uuid,
        p_value_text, p_value_int, p_value_date, p_value_time, p_value_bool
    )
    ON CONFLICT (user_id, COALESCE(daily_log_id, '00000000-0000-0000-0000-000000000000'::UUID), metric_id)
    DO UPDATE SET
        value_text = COALESCE(p_value_text, metric_responses.value_text),
        value_int = COALESCE(p_value_int, metric_responses.value_int),
        value_date = COALESCE(p_value_date, metric_responses.value_date),
        value_time = COALESCE(p_value_time, metric_responses.value_time),
        value_bool = COALESCE(p_value_bool, metric_responses.value_bool),
        updated_at = now()
    RETURNING id INTO response_id;
    
    RETURN response_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX idx_metric_responses_user ON metric_responses(user_id);
CREATE INDEX idx_metric_responses_daily ON metric_responses(daily_log_id);
CREATE INDEX idx_metric_responses_metric ON metric_responses(metric_id);
