/**
 * Audio utility functions for fetching user-specific or default audio files.
 * 
 * Audio storage structure:
 * audio/
 * ├── default/
 * │   └── default_grounding_audio.mp3   ← Fallback for all users
 * └── {user_id}/
 *     └── *.mp3                          ← User-specific audio files
 * 
 * Logic: Get the latest uploaded audio from user's folder, fallback to default.
 */

import { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_AUDIO_PATH = 'default/default_grounding_audio.mp3'

/**
 * Fetches a signed URL for the user's audio file.
 * Prioritizes the latest uploaded file in the user's folder.
 * Falls back to default audio if user folder doesn't exist or is empty.
 * 
 * @param supabase - Supabase client instance
 * @param userId - User's UUID
 * @returns Object with signedUrl or error message
 */
export async function getUserAudioUrl(
    supabase: SupabaseClient,
    userId: string
): Promise<{ signedUrl: string | null; error: string | null }> {
    try {
        // First, try to list files in user's folder
        const { data: userFiles, error: listError } = await supabase.storage
            .from('audio')
            .list(userId, {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        // If user folder exists and has files, use the latest one
        if (!listError && userFiles && userFiles.length > 0) {
            // Filter for audio files only (exclude folders and non-audio)
            const audioFiles = userFiles.filter(
                file => file.name.endsWith('.mp3') ||
                    file.name.endsWith('.m4a') ||
                    file.name.endsWith('.wav')
            )

            if (audioFiles.length > 0) {
                // Get the most recently uploaded audio file
                const latestAudio = audioFiles[0]
                const userAudioPath = `${userId}/${latestAudio.name}`

                const { data, error } = await supabase.storage
                    .from('audio')
                    .createSignedUrl(userAudioPath, 3600) // 1 hour expiry

                if (!error && data) {
                    console.log('Using user-specific audio:', userAudioPath)
                    return { signedUrl: data.signedUrl, error: null }
                }
            }
        }

        // Fallback to default audio
        const { data, error } = await supabase.storage
            .from('audio')
            .createSignedUrl(DEFAULT_AUDIO_PATH, 3600)

        if (error) {
            console.error('Failed to get default audio URL:', error)
            return { signedUrl: null, error: 'Failed to load audio' }
        }

        console.log('Using default audio')
        return { signedUrl: data.signedUrl, error: null }
    } catch (err) {
        console.error('Error in getUserAudioUrl:', err)
        return { signedUrl: null, error: 'Failed to load audio' }
    }
}
