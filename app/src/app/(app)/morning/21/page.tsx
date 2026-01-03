/**
 * MORNING PAGE 21 (v1-m-21)
 * 
 * Backfill decision page - checks if yesterday's evening was missed
 * - If yesterday's evening data exists → redirect to page 22
 * - If yesterday's evening data is empty → redirect to backfill sequence
 * - If it's the first day (onboarding day) → skip backfill, go to page 22
 * 
 * This is a SERVER COMPONENT that checks the database before rendering
 */

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Check if yesterday has any evening ratings
async function hasYesterdayEveningData(userId: string): Promise<boolean> {
    const supabase = await createClient()

    // Get yesterday's date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    // Check if daily_log exists for yesterday with any evening rating
    const { data, error } = await supabase
        .from('daily_logs')
        .select(`
            id,
            metric_responses!inner(
                id,
                metrics!inner(key)
            )
        `)
        .eq('user_id', userId)
        .eq('log_date', yesterdayStr)
        .like('metric_responses.metrics.key', 'rating_%')
        .limit(1)

    if (error) {
        console.error('Error checking yesterday data:', error)
        // On error, skip backfill to avoid blocking user
        return true
    }

    return data && data.length > 0
}

// Check if this is the user's first day (onboarding day)
async function isOnboardingDay(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('user_id', userId)
        .single()

    if (error || !data) {
        return false
    }

    // Check if user was created today
    const createdDate = new Date(data.created_at).toISOString().split('T')[0]
    const todayDate = new Date().toISOString().split('T')[0]

    return createdDate === todayDate
}

export default async function MorningPage21() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        redirect('/login')
    }

    // Check if it's onboarding day (first day) - skip backfill
    const isFirstDay = await isOnboardingDay(user.id)
    if (isFirstDay) {
        redirect('/morning/22')
    }

    // Check if yesterday has evening data
    const hasYesterdayData = await hasYesterdayEveningData(user.id)

    if (hasYesterdayData) {
        // Yesterday's data exists, proceed to final page
        redirect('/morning/22')
    } else {
        // Yesterday's data missing, go to backfill sequence
        redirect('/morning/backfill/1')
    }
}
