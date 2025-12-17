/**
 * MORNING SEQUENCE SERVER ACTIONS
 * 
 * Handle saving user data during morning sequence:
 * - Magic task → metric_responses via RPC
 * - Magic task completion → metric_responses via RPC  
 * - Evening reflection time → metric_responses via RPC
 * - Feature suggestions → feature_suggestions table
 * 
 * All morning data is linked to a daily_log for that day.
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

    // Night owl logic: 00:00-02:59 counts as previous day
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
// SAVE MAGIC TASK (v1-m-16)
// ============================================================================

export async function saveMagicTask(formData: FormData) {
    const task = formData.get('magicTask') as string

    if (!task || task.trim() === '') {
        return { error: 'Please enter your magic task' }
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
        p_metric_key: 'magic_task',
        p_daily_log_id: dailyLogId,
        p_value_text: task.trim(),
        p_value_int: null,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save magic task:', rpcError)
        return { error: 'Failed to save your task' }
    }

    redirect('/morning/17')
}

// ============================================================================
// GET MAGIC TASK (v1-m-17) - Fetch the task user just entered
// ============================================================================

export async function getMagicTask(): Promise<{ task: string | null; error: string | null }> {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { task: null, error: 'Not authenticated' }
    }

    // Get the most recent magic_task for this user
    const { data, error } = await supabase
        .from('metric_responses')
        .select(`
            value_text,
            metrics!inner(key)
        `)
        .eq('user_id', user.id)
        .eq('metrics.key', 'magic_task')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error) {
        console.error('Failed to get magic task:', error)
        return { task: null, error: 'Could not load your task' }
    }

    return { task: data?.value_text || null, error: null }
}

// ============================================================================
// COMPLETE MAGIC TASK (v1-m-17)
// ============================================================================

export async function completeMagicTask() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Get today's daily_log_id
    const dailyLogId = await getDailyLogId(supabase, user.id)

    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'magic_task_completed',
        p_daily_log_id: dailyLogId,
        p_value_text: 'true',
        p_value_int: null,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save task completion:', rpcError)
        return { error: 'Failed to save' }
    }

    redirect('/morning/18')
}

// ============================================================================
// SAVE EVENING REFLECTION TIME (v1-m-19)
// ============================================================================

export async function saveReflectionTime(formData: FormData) {
    const timeValue = formData.get('reflectionTime') as string

    if (!timeValue) {
        return { error: 'Please select a time' }
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
        p_metric_key: 'evening_reflection_time',
        p_daily_log_id: dailyLogId,
        p_value_text: null,
        p_value_int: null,
        p_value_date: null,
        p_value_time: timeValue,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save reflection time:', rpcError)
        return { error: 'Failed to save your response' }
    }

    redirect('/morning/20')
}

// ============================================================================
// GET PREVIOUS REFLECTION TIME (for prefill on v1-m-19)
// ============================================================================

export async function getPreviousReflectionTime(): Promise<string | null> {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return null
    }

    const { data, error } = await supabase
        .from('metric_responses')
        .select(`
            value_time,
            metrics!inner(key)
        `)
        .eq('user_id', user.id)
        .eq('metrics.key', 'evening_reflection_time')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        return null
    }

    return data.value_time
}

// ============================================================================
// SAVE FEATURE SUGGESTION (v1-m-22 feature pages)
// ============================================================================

export async function saveFeatureSuggestion(formData: FormData) {
    const featureName = formData.get('featureName') as string
    const suggestion = formData.get('suggestion') as string

    if (!suggestion || suggestion.trim() === '') {
        return { error: 'Please enter your suggestion' }
    }

    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    // Column names match the actual table schema:
    // link_key (not feature_name)
    // suggestion_text (not suggestion)
    const { error: insertError } = await supabase
        .from('feature_suggestions')
        .insert({
            user_id: user.id,
            link_key: featureName,
            suggestion_text: suggestion.trim()
        })

    if (insertError) {
        console.error('Failed to save suggestion:', insertError)
        return { error: 'Failed to save your suggestion' }
    }

    return { success: true }
}

// ============================================================================
// GET USER NAME (for personalized pages)
// ============================================================================

export async function getUserName(): Promise<string | null> {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return null
    }

    const { data, error } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single()

    if (error || !data) {
        return null
    }

    return data.name
}
