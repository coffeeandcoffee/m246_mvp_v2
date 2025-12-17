/**
 * EVENING SEQUENCE SERVER ACTIONS
 * 
 * Handle saving user data during evening reflection:
 * - Commitment choice → metric_responses via RPC
 * - Return date → metric_responses via RPC
 * - Ratings (1-10) → metric_responses via RPC
 * 
 * All evening data is linked to a daily_log for that day.
 * Night owl logic: 00:00-02:59 counts as previous day.
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

// ============================================================================
// HELPER: Get today's daily_log_id (with night owl logic)
// ============================================================================

async function getDailyLogId(supabase: SupabaseClient, userId: string): Promise<string | null> {
    const now = new Date()
    const hour = now.getHours()

    // Night owl logic: 00:00-02:59 counts as previous day's evening
    let logDate = new Date()
    if (hour < 3) {
        logDate.setDate(logDate.getDate() - 1)
    }

    const dateStr = logDate.toISOString().split('T')[0]  // YYYY-MM-DD

    const { data, error } = await supabase.rpc('get_or_create_daily_log', {
        p_user_id: userId,
        p_date: dateStr
    })

    if (error) {
        console.error('Failed to get/create daily log:', error)
        return null
    }

    return data
}

// ============================================================================
// LOG PAGE VISIT - Tracks which pages user has visited (for resume functionality)
// Only logs ONCE per page per day (prevents React StrictMode double-logging)
// ============================================================================

export async function logPageVisit(pageKey: string) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return // Silently fail - logging shouldn't break the app
    }

    const dailyLogId = await getDailyLogId(supabase, user.id)

    // Check if we already logged this page today
    const { data: existing } = await supabase
        .from('page_events')
        .select('id')
        .eq('user_id', user.id)
        .eq('daily_log_id', dailyLogId)
        .eq('page_key', pageKey)
        .eq('event_type', 'page_view')
        .limit(1)

    if (existing && existing.length > 0) {
        return // Already logged this page today
    }

    await supabase.rpc('log_page_event', {
        p_user_id: user.id,
        p_page_key: pageKey,
        p_event_type: 'page_view',
        p_daily_log_id: dailyLogId,
        p_metadata: {}
    })
}

// ============================================================================
// SAVE COMMITMENT RESPONSE (v1-e-2)
// ============================================================================

export async function saveCommitmentResponse(formData: FormData) {
    const choice = formData.get('choice') as string  // 'commit' or 'dayoff'
    const nextPage = formData.get('nextPage') as string

    if (!choice) {
        return { error: 'Invalid choice' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Get today's daily_log_id
    const dailyLogId = await getDailyLogId(supabase, user.id)

    // Save committed_tomorrow as boolean text ('true' or 'false')
    const { error: rpcError1 } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'committed_tomorrow',
        p_daily_log_id: dailyLogId,
        p_value_text: choice === 'commit' ? 'true' : 'false',
        p_value_int: null,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError1) {
        console.error('Failed to save commitment:', rpcError1)
        return { error: 'Failed to save your response' }
    }

    // If day off, also save taking_day_off = true
    if (choice === 'dayoff') {
        const { error: rpcError2 } = await supabase.rpc('save_metric_response', {
            p_user_id: user.id,
            p_metric_key: 'taking_day_off',
            p_daily_log_id: dailyLogId,
            p_value_text: 'true',
            p_value_int: null,
            p_value_date: null,
            p_value_time: null,
            p_value_bool: null
        })

        if (rpcError2) {
            console.error('Failed to save day off status:', rpcError2)
            return { error: 'Failed to save your response' }
        }
    }

    redirect(nextPage)
}

// ============================================================================
// SAVE RETURN DATE (v1-e-5)
// ============================================================================

export async function saveReturnDate(formData: FormData) {
    const dateValue = formData.get('returnDate') as string

    if (!dateValue) {
        return { error: 'Please select a date' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Get today's daily_log_id
    const dailyLogId = await getDailyLogId(supabase, user.id)

    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'return_date',
        p_daily_log_id: dailyLogId,
        p_value_text: null,
        p_value_int: null,
        p_value_date: dateValue,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save return date:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect('/evening/6')
}

// ============================================================================
// SAVE RATING (v1-e-7 through v1-e-13)
// ============================================================================

export async function saveRating(formData: FormData) {
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

    // Get today's daily_log_id
    const dailyLogId = await getDailyLogId(supabase, user.id)

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
        console.error('Failed to save rating:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect(nextPage)
}
