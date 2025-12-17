/**
 * BACKFILL SEQUENCE SERVER ACTIONS
 * 
 * Handle saving user data during backfill (yesterday's missed evening reflection).
 * 
 * KEY DIFFERENCE FROM EVENING ACTIONS:
 * - This collects data for YESTERDAY (missed evening)
 * - For now, we use NULL daily_log_id (same as evening)
 * - Later, we'll add proper date-specific daily_log linking
 * 
 * FLOW: Only ratings (7 pages) - no commitment/day-off branching
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ============================================================================
// SAVE BACKFILL RATING (pages 2-8)
// ============================================================================

export async function saveBackfillRating(formData: FormData) {
    const metricKey = formData.get('metricKey') as string
    const rating = formData.get('rating') as string
    const nextPage = formData.get('nextPage') as string

    if (!metricKey || !rating) {
        return { error: 'Invalid data' }
    }

    const ratingInt = parseInt(rating, 10)
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 10) {
        return { error: 'Rating must be between 1 and 10' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Save the rating
    // NOTE: Using NULL for daily_log_id for now (same as evening sequence)
    // Later we'll add proper yesterday's daily_log linking
    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: metricKey,
        p_daily_log_id: null,
        p_value_text: null,
        p_value_int: ratingInt,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save backfill rating:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect(nextPage)
}
