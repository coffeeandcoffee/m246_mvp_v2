-- Extended user profile data (separate from Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Profile info
    name TEXT,
    timezone TEXT DEFAULT 'UTC',
    
    -- Onboarding status
    onboarded BOOLEAN DEFAULT false,
    last_execution_flow_day DATE,
    
    -- Invite tracking
    invite_code_id UUID REFERENCES invite_codes(id),
    
    -- Audio preferences (placeholder for future)
    audio_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile AND 4 referral codes on user signup
CREATE OR REPLACE FUNCTION create_user_profile_and_codes()
RETURNS TRIGGER AS $$
BEGIN
    -- Create the user profile
    INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    
    -- Create 4 referral codes for this new user
    PERFORM create_user_referral_codes(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile_and_codes();

-- Index for fast lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
