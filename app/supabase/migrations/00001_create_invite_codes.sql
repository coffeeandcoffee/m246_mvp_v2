-- Invite codes for gated signup
-- Supports: universal code (M246MVP) with toggle, and one-time user referral codes

CREATE TABLE invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    
    -- Code type and ownership
    is_universal BOOLEAN DEFAULT false,  -- true for M246MVP, false for user referral codes
    owner_user_id UUID,                  -- NULL for universal codes, user_id for referral codes
    
    -- Usage tracking
    active BOOLEAN DEFAULT true,         -- toggleable for universal codes
    used BOOLEAN DEFAULT false,          -- for one-time codes only
    used_by_user_id UUID,                -- who used this code
    used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert the universal invite code (toggleable via admin)
INSERT INTO invite_codes (code, is_universal, active) 
VALUES ('M246MVP', true, true);

-- Function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';  -- Excluding confusing chars: I,O,0,1
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create 4 referral codes for a new user
CREATE OR REPLACE FUNCTION create_user_referral_codes(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    new_code TEXT;
    i INTEGER;
BEGIN
    FOR i IN 1..4 LOOP
        -- Generate unique code
        LOOP
            new_code := generate_referral_code();
            -- Check if code already exists
            EXIT WHEN NOT EXISTS (SELECT 1 FROM invite_codes WHERE code = new_code);
        END LOOP;
        
        -- Insert the new referral code
        INSERT INTO invite_codes (code, is_universal, owner_user_id, active, used)
        VALUES (new_code, false, p_user_id, true, false);
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate an invite code (returns true if valid)
CREATE OR REPLACE FUNCTION validate_invite_code(p_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM invite_codes 
        WHERE code = p_code 
        AND active = true 
        AND (is_universal = true OR used = false)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a code as used (called after successful signup)
CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    code_id UUID;
BEGIN
    -- Get the code ID
    SELECT id INTO code_id FROM invite_codes WHERE code = p_code;
    
    -- If it's a one-time code (not universal), mark it as used
    UPDATE invite_codes 
    SET used = true, used_by_user_id = p_user_id, used_at = now()
    WHERE id = code_id AND is_universal = false;
    
    RETURN code_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for fast code lookups
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_owner ON invite_codes(owner_user_id);
