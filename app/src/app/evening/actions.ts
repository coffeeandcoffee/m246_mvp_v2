/**
 * EVENING SEQUENCE SERVER ACTIONS
 * 
 * Handle saving user data during evening reflection:
 * - Commitment choice → metric_responses via RPC
 * - Return date → metric_responses via RPC
 * - Ratings (1-10) → metric_responses via RPC
 * 
 * KEY DIFFERENCE FROM ONBOARDING:
 * - Evening data is day-specific, so we need a daily_log_id
 * - For now (Step 1), we'll pass NULL to keep it simple like onboarding
 * - Later we'll add proper daily_log creation
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

    // Save committed_tomorrow as boolean text ('true' or 'false')
    const { error: rpcError1 } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'committed_tomorrow',
        p_daily_log_id: null,  // We'll add proper daily_log later
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
            p_daily_log_id: null,
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

    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'return_date',
        p_daily_log_id: null,
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
        console.error('Failed to save rating:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect(nextPage)
}
