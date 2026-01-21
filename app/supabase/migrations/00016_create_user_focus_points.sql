-- User Focus Points table
-- Stores personalized focus points per user, displayed on the "Where Do We Go" tab
CREATE TABLE user_focus_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    focus_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by user
CREATE INDEX idx_user_focus_points_user_id ON user_focus_points(user_id);

-- RLS policies for user access
ALTER TABLE user_focus_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own focus points"
    ON user_focus_points FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus points"
    ON user_focus_points FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus points"
    ON user_focus_points FOR DELETE
    USING (auth.uid() = user_id);
