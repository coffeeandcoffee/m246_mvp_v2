-- Add UPDATE policy for focus points (was missing - needed for marking complete)
CREATE POLICY "Users can update own focus points"
    ON user_focus_points FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
