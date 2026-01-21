-- Add entry batch grouping and completion tracking to focus points
-- entry_batch_id groups multiple focus points that were added together
-- completed_at tracks when a focus point was marked as done

ALTER TABLE user_focus_points 
ADD COLUMN entry_batch_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN completed_at TIMESTAMPTZ DEFAULT NULL;

-- Index for efficient batch lookups
CREATE INDEX idx_user_focus_points_batch ON user_focus_points(user_id, entry_batch_id);
