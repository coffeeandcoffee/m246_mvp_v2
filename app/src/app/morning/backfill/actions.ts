/**
 * BACKFILL SEQUENCE SERVER ACTIONS
 * 
 * Handle saving user data during backfill (yesterday's missed evening reflection).
 * 
 * KEY DIFFERENCE FROM EVENING ACTIONS:
 * - Backfill ALWAYS saves to YESTERDAY's daily_log
 * - This is used when morning sequence detects yesterday's evening was missed
 * 
 * FLOW: Only ratings (7 pages) - no commitment/day-off branching
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

// ============================================================================
// HELPER: Get YESTERDAY's daily_log_id (for backfill)
// ============================================================================

async function getYesterdayDailyLogId(supabase: SupabaseClient, userId: string): Promise<string | null> {
    // Always use yesterday's date for backfill
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const dateStr = yesterday.toISOString().split('T')[0]  // YYYY-MM-DD

    const { data, error } = await supabase.rpc('get_or_create_daily_log', {
        p_user_id: userId,
        p_date: dateStr
    })

    if (error) {
        console.error('Failed to get/create yesterday daily log:', error)
        return null
    }

    return data
}

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

    // Get YESTERDAY's daily_log_id (this is backfill!)
    const dailyLogId = await getYesterdayDailyLogId(supabase, user.id)

    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: metricKey,
        p_daily_log_id: dailyLogId,
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

