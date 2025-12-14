-- Fix: Make the trigger function properly bypass RLS
-- The issue is that during auth signup, RLS context prevents inserts
-- Solution: Recreate the function with SET search_path and explicit role

-- Drop and recreate the function with proper RLS bypass
CREATE OR REPLACE FUNCTION create_user_profile_and_codes()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create the user profile (bypasses RLS due to SECURITY DEFINER + search_path)
    INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    
    -- Create 4 referral codes for this new user
    PERFORM create_user_referral_codes(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Also fix the referral codes function
CREATE OR REPLACE FUNCTION create_user_referral_codes(p_user_id UUID)
RETURNS VOID 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$ LANGUAGE plpgsql;

-- Also update validate and use functions
CREATE OR REPLACE FUNCTION validate_invite_code(p_code TEXT)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM invite_codes 
        WHERE code = p_code 
        AND active = true 
        AND (is_universal = true OR used = false)
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION use_invite_code(p_code TEXT, p_user_id UUID)
RETURNS UUID 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$ LANGUAGE plpgsql;
