import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

interface UserState {
    userId: string
    onboarded: boolean
    name: string | null
    timezone: string
    hasCompletedAnyEvening: boolean
    todaysMorningComplete: boolean
    todaysEveningComplete: boolean
    eveningReflectionTime: string | null
}

async function getUserState(): Promise<UserState | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get user profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('name, timezone, onboarded')
        .eq('user_id', user.id)
        .single()

    // Check if user has ever completed an evening sequence
    const { data: anyEvening } = await supabase
        .from('sequence_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1)

    // Get today's date in user timezone
    const timezone = profile?.timezone || 'UTC'
    const now = new Date()
    const userLocalDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    const userHour = userLocalDate.getHours()

    // Night owl logic: before 3am counts as yesterday
    const isNightOwl = userHour < 3
    const effectiveDate = isNightOwl
        ? new Date(userLocalDate.getTime() - 24 * 60 * 60 * 1000)
        : userLocalDate
    const dateStr = effectiveDate.toISOString().split('T')[0]

    // Get today's daily log
    const { data: todaysLog } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', dateStr)
        .single()

    let todaysMorningComplete = false
    let todaysEveningComplete = false
    let eveningReflectionTime: string | null = null

    if (todaysLog) {
        // Check morning progress
        const { data: morningProgress } = await supabase
            .from('sequence_progress')
            .select('status')
            .eq('daily_log_id', todaysLog.id)
            .eq('user_id', user.id)
            .single()

        todaysMorningComplete = morningProgress?.status === 'completed'

        // Check evening progress
        const { data: eveningProgress } = await supabase
            .from('sequence_progress')
            .select('status')
            .eq('daily_log_id', todaysLog.id)
            .eq('user_id', user.id)
            .single()

        todaysEveningComplete = eveningProgress?.status === 'completed'

        // Get evening reflection time from morning responses
        const { data: timeResponse } = await supabase
            .from('metric_responses')
            .select('value_time')
            .eq('daily_log_id', todaysLog.id)
            .eq('user_id', user.id)
            .single()

        eveningReflectionTime = timeResponse?.value_time || null
    }

    return {
        userId: user.id,
        onboarded: profile?.onboarded || false,
        name: profile?.name || null,
        timezone,
        hasCompletedAnyEvening: (anyEvening?.length || 0) > 0,
        todaysMorningComplete,
        todaysEveningComplete,
        eveningReflectionTime,
    }
}

function determineSequence(state: UserState): 'onboarding' | 'morning' | 'evening' | 'waiting' {
    // 1. Not onboarded -> onboarding
    if (!state.onboarded) {
        return 'onboarding'
    }

    // 2. Onboarded but never completed evening -> evening first
    if (!state.hasCompletedAnyEvening) {
        return 'evening'
    }

    // 3. Check time-based routing
    const now = new Date()
    const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: state.timezone }))
    const currentHour = userLocalTime.getHours()
    const currentMinutes = userLocalTime.getMinutes()
    const currentTimeMinutes = currentHour * 60 + currentMinutes

    // Before 3am -> yesterday's evening (if incomplete)
    if (currentHour < 3) {
        return state.todaysEveningComplete ? 'waiting' : 'evening'
    }

    // After 3am, check if morning is complete
    if (!state.todaysMorningComplete) {
        return 'morning'
    }

    // Morning complete, check if it's time for evening
    if (state.eveningReflectionTime) {
        const [hours, minutes] = state.eveningReflectionTime.split(':').map(Number)
        const reflectionTimeMinutes = hours * 60 + minutes

        if (currentTimeMinutes >= reflectionTimeMinutes) {
            return state.todaysEveningComplete ? 'waiting' : 'evening'
        }
    }

    // Waiting for evening reflection time
    return 'waiting'
}

export default async function AppLayout({ children }: { children: ReactNode }) {
    const state = await getUserState()

    if (!state) {
        redirect('/login')
    }

    const sequence = determineSequence(state)

    // Route to correct sequence
    // For now, we pass state as a cookie/context
    // The sequence pages will handle their own rendering

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {children}
        </div>
    )
}
