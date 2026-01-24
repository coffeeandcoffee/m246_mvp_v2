-- Success metric questions and daily learnings
-- Users can define up to 3 custom questions for daily reflection
-- Responses are saved in existing metric_responses table

-- User-defined success metric questions (max 3 per user)
CREATE TABLE success_metric_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,  -- 0, 1, or 2 for ordering
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Daily learning entries (one per day)
CREATE TABLE daily_learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    learning_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_success_metric_questions_user ON success_metric_questions(user_id);
CREATE INDEX idx_daily_learnings_user ON daily_learnings(user_id);
CREATE INDEX idx_daily_learnings_daily_log ON daily_learnings(daily_log_id);

-- Unique constraint: one learning per day per user
CREATE UNIQUE INDEX idx_daily_learnings_unique 
    ON daily_learnings(user_id, COALESCE(daily_log_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- RLS Policies
ALTER TABLE success_metric_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own success metrics" ON success_metric_questions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily learnings" ON daily_learnings
    FOR ALL USING (auth.uid() = user_id);
