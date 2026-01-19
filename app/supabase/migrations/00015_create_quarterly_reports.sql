-- Quarterly reflection reports per user
-- Answers stored as JSONB keyed by question index

CREATE TABLE quarterly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
    answers JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, year, quarter)
);

-- Trigger for updated_at
CREATE TRIGGER update_quarterly_reports_updated_at
    BEFORE UPDATE ON quarterly_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_quarterly_reports_user ON quarterly_reports(user_id);
CREATE INDEX idx_quarterly_reports_year_quarter ON quarterly_reports(year, quarter);

-- RLS policies
ALTER TABLE quarterly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quarterly reports"
    ON quarterly_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quarterly reports"
    ON quarterly_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quarterly reports"
    ON quarterly_reports FOR UPDATE
    USING (auth.uid() = user_id);
