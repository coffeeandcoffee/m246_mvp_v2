-- Fix: Allow the trigger function to insert user profiles
-- The SECURITY DEFINER on the trigger function bypasses RLS,
-- but we also need policies for the invite_codes table updates

-- Allow service role (triggers) to insert into user_profiles
-- Since the trigger runs as SECURITY DEFINER, it actually bypasses RLS.
-- But just in case, let's also add the insert policy.
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow the trigger to insert referral codes for new users
-- The trigger needs to be able to insert codes owned by the new user
CREATE POLICY "Allow insert referral codes" ON invite_codes
    FOR INSERT WITH CHECK (true);

-- Allow the trigger to update invite codes when marking as used
CREATE POLICY "Allow update invite codes" ON invite_codes
    FOR UPDATE USING (true);
