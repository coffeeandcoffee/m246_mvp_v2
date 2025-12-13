-- Supabase Storage bucket for audio files
-- Note: This must be run via Supabase dashboard or API, not via SQL migration
-- Keeping this file for documentation purposes

-- Create the 'audio' bucket for Reality-Defining Audio files
-- This should be done in Supabase Dashboard > Storage > New Bucket
-- Settings:
--   Name: audio
--   Public: false (files accessed via signed URLs)
--   File size limit: 50MB (audio files)
--   Allowed MIME types: audio/mpeg, audio/mp3, audio/wav, audio/ogg

-- Storage policies (to be added in Dashboard > Storage > Policies):

-- Policy 1: Users can upload their own audio files
-- Name: "Users can upload own audio"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy: (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1])

-- Policy 2: Users can read/download their own audio files  
-- Name: "Users can access own audio"
-- Allowed operation: SELECT
-- Target roles: authenticated
-- Policy: (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1])

-- Policy 3: Users can update their own audio files
-- Name: "Users can update own audio"
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- Policy: (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1])

-- Policy 4: Users can delete their own audio files
-- Name: "Users can delete own audio"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- Policy: (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1])

-- Default audio file path structure:
-- audio/default/default_grounding_audio.mp3  (the fallback audio)
-- audio/{user_id}/custom_audio.mp3           (user's custom audio)

-- To upload default audio via CLI:
-- npx supabase storage cp ./default_audio.mp3 audio/default/default_grounding_audio.mp3

SELECT 'Storage bucket documentation - run these via Supabase Dashboard' as note;
