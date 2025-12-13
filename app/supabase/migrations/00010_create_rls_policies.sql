-- Row Level Security (RLS) policies
-- Ensures users can only access their own data

-- Enable RLS on all user-data tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- User Profiles: users can only access their own
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Daily Logs: users can only access their own
CREATE POLICY "Users can manage own daily logs" ON daily_logs
    FOR ALL USING (auth.uid() = user_id);

-- Sequence Progress: users can only access their own
CREATE POLICY "Users can manage own sequence progress" ON sequence_progress
    FOR ALL USING (auth.uid() = user_id);

-- Metric Responses: users can only access their own
CREATE POLICY "Users can manage own metric responses" ON metric_responses
    FOR ALL USING (auth.uid() = user_id);

-- Page Events: users can only insert their own events
CREATE POLICY "Users can insert own page events" ON page_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own page events" ON page_events
    FOR SELECT USING (auth.uid() = user_id);

-- Feature Suggestions: users can only insert their own
CREATE POLICY "Users can insert own suggestions" ON feature_suggestions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own suggestions" ON feature_suggestions
    FOR SELECT USING (auth.uid() = user_id);

-- Invite Codes: special policies
-- Anyone can read (for validation during signup)
CREATE POLICY "Anyone can check invite codes" ON invite_codes
    FOR SELECT USING (true);

-- Users can view their own referral codes
CREATE POLICY "Users can view own referral codes" ON invite_codes
    FOR SELECT USING (owner_user_id = auth.uid());

-- Content tables (sequences, pages, metrics) are publicly readable
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read sequences" ON sequences FOR SELECT USING (true);
CREATE POLICY "Anyone can read pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Anyone can read metrics" ON metrics FOR SELECT USING (true);
