/**
 * ROUTING LOGIC
 * 
 * Centralized routing logic implementing the HARD RULES:
 * 
 * Rule 1: Morning Priority
 * - When: Time >= 3am AND today's morning not started
 * - Action: ALWAYS redirect to /morning/1
 * 
 * Rule 2: Evening Priority
 * - When: Time >= evening_reflection_time AND < 3am next day AND evening not started
 * - Action: ALWAYS redirect to /evening/1
 * 
 * Rule 3: Night Owl
 * - Midnight-3am = previous day's evening window
 * - BUT if 3am comes, Rule 1 kicks in for new day
 */

import { createClient } from '@/utils/supabase/server'

export interface RoutingResult {
    redirect: string | null
    reason: string
}

/**
 * Get the logical "today" date accounting for night owl logic
 * Midnight-3am counts as previous day
 */
export function getLogicalDate(userTimezone: string): { date: string; isNightOwl: boolean } {
    const now = new Date()
    // Convert to user's timezone
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))
    const hour = userTime.getHours()

    const isNightOwl = hour < 3

    // If night owl (before 3am), use yesterday's date
    if (isNightOwl) {
        userTime.setDate(userTime.getDate() - 1)
    }

    return {
        date: userTime.toISOString().split('T')[0],
        isNightOwl
    }
}

/**
 * Server-side routing check - determines where user should go
 */
export async function checkRouting(): Promise<RoutingResult> {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { redirect: '/login', reason: 'not_authenticated' }
    }

    // Get user profile (onboarded status, timezone, created_at for onboarding day check)
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('onboarded, timezone, created_at')
        .eq('user_id', user.id)
        .single()

    if (profileError || !profile) {
        return { redirect: '/onboarding/UX_v3_o_1', reason: 'no_profile' }
    }

    // Rule: Not onboarded -> onboarding
    if (!profile.onboarded) {
        return { redirect: '/onboarding/UX_v3_o_1', reason: 'not_onboarded' }
    }

    const timezone = profile.timezone || 'UTC'
    const { date: logicalToday, isNightOwl } = getLogicalDate(timezone)

    // Check if today is the onboarding day (skip morning redirect on onboarding day)
    const onboardingDate = profile.created_at ? profile.created_at.split('T')[0] : null
    const isOnboardingDay = onboardingDate === logicalToday

    // Get today's daily_log_id (needed for completion checks)
    const { data: dailyLogId } = await supabase.rpc('get_or_create_daily_log', {
        p_user_id: user.id,
        p_date: logicalToday
    })

    // Get current time in user's timezone
    const now = new Date()
    const userTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    const hour = userTime.getHours()
    const minute = userTime.getMinutes()
    const currentTimeMinutes = hour * 60 + minute

    // Check if user ever completed evening (for first-time users)
    const { data: anyEveningPage } = await supabase
        .from('page_events')
        .select('id')
        .eq('user_id', user.id)
        .like('page_key', 'v1-e-%')
        .limit(1)

    if (!anyEveningPage || anyEveningPage.length === 0) {
        return { redirect: '/evening/1', reason: 'never_completed_evening' }
    }

    // SPECIAL CASE: On onboarding day, user completed evening during onboarding
    // They should stay on evening/14 until next day's morning
    // NOTE: This check comes AFTER never_completed_evening to allow first-time evening flow
    if (isOnboardingDay) {
        return { redirect: '/evening/14', reason: 'onboarding_day_complete' }
    }

    // Check morning completion for today
    const { data: morningPages } = await supabase
        .from('page_events')
        .select('page_key')
        .eq('user_id', user.id)
        .eq('daily_log_id', dailyLogId)
        .like('page_key', 'v1-m-%')

    const morningStarted = morningPages && morningPages.length > 0
    const morningComplete = morningPages?.some(p => p.page_key === 'v1-m-18')

    // Check evening completion for today  
    const { data: eveningPages } = await supabase
        .from('page_events')
        .select('page_key')
        .eq('user_id', user.id)
        .eq('daily_log_id', dailyLogId)
        .like('page_key', 'v1-e-%')

    const eveningStarted = eveningPages && eveningPages.length > 0
    const eveningComplete = eveningPages?.some(p => p.page_key === 'v1-e-14')

    // DAY OFF CHECK: Only applies if NO work has started today
    // If user already started morning or evening, they've implicitly overridden the day off
    if (!morningStarted && !eveningStarted) {
        // Check if today is a scheduled day off
        // A day off is when: most recent return_date > today AND no day_off_override for today
        const { data: scheduledDayOff } = await supabase
            .from('metric_responses')
            .select('value_date, metrics!inner(key)')
            .eq('user_id', user.id)
            .eq('metrics.key', 'return_date')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (scheduledDayOff?.value_date && scheduledDayOff.value_date > logicalToday) {
            // Check for explicit override
            const { data: override } = await supabase
                .from('metric_responses')
                .select('id, metrics!inner(key)')
                .eq('user_id', user.id)
                .eq('daily_log_id', dailyLogId)
                .eq('metrics.key', 'day_off_override')
                .limit(1)
                .single()

            if (!override) {
                return { redirect: '/dayoff', reason: 'scheduled_day_off' }
            }
        }
    }

    // Get today's evening reflection time
    const { data: reflectionData } = await supabase
        .from('metric_responses')
        .select('value_time, metrics!inner(key)')
        .eq('user_id', user.id)
        .eq('daily_log_id', dailyLogId)
        .eq('metrics.key', 'evening_reflection_time')
        .limit(1)
        .single()

    let reflectionTimeMinutes = 18 * 60 // default 6pm
    if (reflectionData?.value_time) {
        const [h, m] = reflectionData.value_time.split(':').map(Number)
        reflectionTimeMinutes = h * 60 + m
    }

    // HARD RULE 1: After 3am, before reflection time -> Morning
    // (Night owl is handled by logicalToday already counting as previous day)
    if (!isNightOwl && hour >= 3 && currentTimeMinutes < reflectionTimeMinutes) {
        if (!morningStarted) {
            return { redirect: '/morning/1', reason: 'morning_not_started' }
        }
        if (morningComplete) {
            // Morning complete - now check evening status (simplified flow goes directly to evening)
            if (eveningComplete) {
                return { redirect: '/evening/14', reason: 'morning_and_evening_complete' }
            }
            if (eveningStarted) {
                // Evening in progress - resume at last visited page
                const lastEveningPage = eveningPages?.reduce((max, p) => {
                    const num = parseInt(p.page_key.replace('v1-e-', ''))
                    return num > max ? num : max
                }, 0) || 2
                return { redirect: `/evening/${lastEveningPage}`, reason: 'evening_in_progress_after_morning' }
            }
            // Morning done but evening not started - go to evening/2 (simplified flow skips evening/1)
            return { redirect: '/evening/2', reason: 'morning_complete_start_evening' }
        }
        // Morning in progress - resume at last visited page
        const lastMorningPage = morningPages?.reduce((max, p) => {
            const num = parseInt(p.page_key.replace('v1-m-', ''))
            return num > max ? num : max
        }, 0) || 1
        return { redirect: `/morning/${lastMorningPage}`, reason: 'morning_in_progress' }
    }

    // HARD RULE 2: After reflection time (or night owl) -> Evening
    if (!isNightOwl && currentTimeMinutes >= reflectionTimeMinutes) {
        if (!eveningStarted) {
            return { redirect: '/evening/1', reason: 'evening_not_started' }
        }
        if (eveningComplete) {
            return { redirect: '/evening/14', reason: 'evening_complete_waiting' }
        }
        // Evening in progress - resume at last visited page
        const lastEveningPage = eveningPages?.reduce((max, p) => {
            const num = parseInt(p.page_key.replace('v1-e-', ''))
            return num > max ? num : max
        }, 0) || 1
        return { redirect: `/evening/${lastEveningPage}`, reason: 'evening_in_progress' }
    }

    // Night owl (midnight to 3am) - counts as yesterday's evening window
    if (isNightOwl) {
        if (!eveningStarted) {
            return { redirect: '/evening/1', reason: 'night_owl_evening_not_started' }
        }
        if (eveningComplete) {
            return { redirect: '/evening/14', reason: 'night_owl_evening_complete' }
        }
        // Night owl evening in progress - resume at last visited page
        const lastNightOwlPage = eveningPages?.reduce((max, p) => {
            const num = parseInt(p.page_key.replace('v1-e-', ''))
            return num > max ? num : max
        }, 0) || 1
        return { redirect: `/evening/${lastNightOwlPage}`, reason: 'night_owl_evening_in_progress' }
    }

    // Fallback - shouldn't reach here, but safe default to login
    return { redirect: '/login', reason: 'fallback' }
}

/**
 * Client-side API route for polling
 * Returns JSON with redirect URL if needed
 */
export async function getRoutingRedirect(): Promise<string | null> {
    const result = await checkRouting()
    return result.redirect
}
