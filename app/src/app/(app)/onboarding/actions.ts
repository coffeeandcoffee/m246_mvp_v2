/**
 * ONBOARDING SERVER ACTIONS
 * 
 * Handle saving user data during onboarding:
 * - Display name → user_profiles table
 * - Timezone → user_profiles table
 * - Metric responses → metric_responses table via RPC
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ============================================================================
// SAVE DISPLAY NAME (v1-o-1)
// ============================================================================

export async function saveDisplayName(formData: FormData) {
    const displayName = formData.get('displayName') as string

    if (!displayName || displayName.trim() === '') {
        return { error: 'Please enter your name' }
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Update user_profiles (column is 'name', match on 'user_id')
    const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ name: displayName.trim() })
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Failed to save display name:', updateError)
        return { error: 'Failed to save your name' }
    }

    redirect('/onboarding/2')
}

// ============================================================================
// SAVE TIMEZONE (v1-o-2)
// ============================================================================

export async function saveTimezone(formData: FormData) {
    const timezone = formData.get('timezone') as string

    if (!timezone) {
        return { error: 'Timezone is required' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ timezone: timezone })
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Failed to save timezone:', updateError)
        return { error: 'Failed to save timezone' }
    }

    redirect('/onboarding/3')
}

// ============================================================================
// SAVE METRIC RESPONSE (v1-o-3 and beyond)
// ============================================================================

export async function saveMetricResponse(formData: FormData) {
    const metricKey = formData.get('metricKey') as string
    const responseValue = formData.get('responseValue') as string
    const nextPage = formData.get('nextPage') as string

    if (!metricKey || !responseValue) {
        return { error: 'Invalid data' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Call the save_metric_response RPC
    // For onboarding, we pass NULL for daily_log_id (not day-specific)
    // Parameters must match the function signature in database
    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: metricKey,
        p_daily_log_id: null,
        p_value_text: responseValue,
        p_value_int: null,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save metric response:', rpcError)
        return { error: 'Failed to save your response' }
    }

    // Redirect to the appropriate next page
    redirect(nextPage)
}

// ============================================================================
// SAVE EFD DATE (v1-o-4)
// ============================================================================

export async function saveEfdDate(formData: FormData) {
    const dateValue = formData.get('efdDate') as string

    if (!dateValue) {
        return { error: 'Please select a date' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Save the date to metric_responses using p_value_date
    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'last_efd_date',
        p_daily_log_id: null,
        p_value_text: null,
        p_value_int: null,
        p_value_date: dateValue,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save EFD date:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect('/onboarding/5')
}

// ============================================================================
// FINISH ONBOARDING (v1-o-11, v1-o-12)
// ============================================================================

export async function finishOnboarding() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Mark user as onboarded
    const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ onboarded: true })
        .eq('user_id', user.id)

    if (updateError) {
        console.error('Failed to complete onboarding:', updateError)
        return { error: 'Failed to complete onboarding' }
    }

    // Redirect to evening sequence
    redirect('/evening/1')
}
