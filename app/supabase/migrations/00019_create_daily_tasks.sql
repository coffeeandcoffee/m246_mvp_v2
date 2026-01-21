-- Track daily task completions per user
-- e.g. mantra played, first victory set

CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    task_key TEXT NOT NULL,  -- e.g. 'mantra', 'first_victory'
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, task_date, task_key)
);

-- Indexes
CREATE INDEX idx_daily_tasks_user ON daily_tasks(user_id);
CREATE INDEX idx_daily_tasks_date ON daily_tasks(task_date);
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);

-- RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily tasks" ON daily_tasks
    FOR ALL USING (auth.uid() = user_id);
