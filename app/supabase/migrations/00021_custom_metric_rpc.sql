-- Add RPC function to save custom metric responses (auto-creates metric if needed)
-- This is SECURITY DEFINER so it can bypass RLS on metrics table

CREATE OR REPLACE FUNCTION save_custom_metric_response(
    p_user_id UUID,
    p_question_id UUID,
    p_daily_log_id UUID,
    p_rating INTEGER
)
RETURNS UUID AS $$
DECLARE
    metric_key TEXT;
    metric_uuid UUID;
    response_id UUID;
BEGIN
    metric_key := 'custom_metric_' || p_question_id::TEXT;
    
    -- Get or create metric
    SELECT id INTO metric_uuid FROM metrics WHERE key = metric_key AND active = true;
    
    IF metric_uuid IS NULL THEN
        -- Create the metric (bypasses RLS due to SECURITY DEFINER)
        INSERT INTO metrics (key, label, type, day_specific, sequence_key)
        VALUES (metric_key, 'Custom Metric', 'scale_1_10', true, 'custom')
        RETURNING id INTO metric_uuid;
    END IF;
    
    -- Upsert the response
    INSERT INTO metric_responses (
        user_id, daily_log_id, metric_id, value_int
    )
    VALUES (
        p_user_id, p_daily_log_id, metric_uuid, p_rating
    )
    ON CONFLICT (user_id, COALESCE(daily_log_id, '00000000-0000-0000-0000-000000000000'::UUID), metric_id)
    DO UPDATE SET
        value_int = p_rating,
        updated_at = now()
    RETURNING id INTO response_id;
    
    RETURN response_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
