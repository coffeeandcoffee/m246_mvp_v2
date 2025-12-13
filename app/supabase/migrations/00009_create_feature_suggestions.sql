-- User suggestions from feature links on morning sequence last page
-- Separate table for easy analysis of feature demand

CREATE TABLE feature_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Which link was clicked
    link_key TEXT NOT NULL,             -- 'scientific_background', 'community_call', etc.
    
    -- User's text suggestion (optional)
    suggestion_text TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to log a feature suggestion
CREATE OR REPLACE FUNCTION log_feature_suggestion(
    p_user_id UUID,
    p_link_key TEXT,
    p_suggestion_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    suggestion_id UUID;
BEGIN
    INSERT INTO feature_suggestions (user_id, link_key, suggestion_text)
    VALUES (p_user_id, p_link_key, p_suggestion_text)
    RETURNING id INTO suggestion_id;
    
    RETURN suggestion_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX idx_feature_suggestions_user ON feature_suggestions(user_id);
CREATE INDEX idx_feature_suggestions_link ON feature_suggestions(link_key);
CREATE INDEX idx_feature_suggestions_date ON feature_suggestions(created_at);
