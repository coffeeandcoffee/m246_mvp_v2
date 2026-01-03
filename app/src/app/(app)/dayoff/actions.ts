/**
 * DAY OFF SERVER ACTIONS
 * 
 * Handle day off override when user chooses to work on a scheduled day off.
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get today's daily_log_id (with night owl logic)
 */
async function getDailyLogId(userId: string): Promise<string | null> {
    const supabase = await createClient()
    const now = new Date()
    const hour = now.getHours()

    // Night owl logic: 00:00-02:59 counts as previous day
    let logDate = new Date()
    if (hour < 3) {
        logDate.setDate(logDate.getDate() - 1)
    }

    const dateStr = logDate.toISOString().split('T')[0]

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

/**
 * Override today's day off - mark this day as a work day
 * Saves day_off_override = true to metric_responses for today's daily_log
 */
export async function overrideDayOff() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: 'Not authenticated' }
    }

    const dailyLogId = await getDailyLogId(user.id)

    if (!dailyLogId) {
        return { error: 'Failed to get daily log' }
    }

    const { error: rpcError } = await supabase.rpc('save_metric_response', {
        p_user_id: user.id,
        p_metric_key: 'day_off_override',
        p_daily_log_id: dailyLogId,
        p_value_text: 'true',
        p_value_int: null,
        p_value_date: null,
        p_value_time: null,
        p_value_bool: null
    })

    if (rpcError) {
        console.error('Failed to save day off override:', rpcError)
        return { error: 'Failed to save override' }
    }

    redirect('/router')
}
