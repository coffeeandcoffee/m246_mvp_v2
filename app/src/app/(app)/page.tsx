import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// App entry point - routes to correct sequence
export default async function AppPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarded, timezone')
        .eq('user_id', user.id)
        .single()

    // Not onboarded -> onboarding
    if (!profile?.onboarded) {
        redirect('/app/onboarding')
    }

    // Check if ever completed evening
    const { data: sequences } = await supabase
        .from('sequences')
        .select('id')
        .eq('key', 'evening')
        .single()

    const { data: anyEvening } = await supabase
        .from('sequence_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('sequence_id', sequences?.id)
        .eq('status', 'completed')
        .limit(1)

    // Never completed evening -> evening first
    if (!anyEvening || anyEvening.length === 0) {
        redirect('/app/evening')
    }

    // Get user's local time
    const timezone = profile?.timezone || 'UTC'
    const now = new Date()
    const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    const hour = userLocalTime.getHours()

    // Get today's date (accounting for night owl < 3am)
    const isNightOwl = hour < 3
    const effectiveDate = isNightOwl
        ? new Date(userLocalTime.getTime() - 24 * 60 * 60 * 1000)
        : userLocalTime
    const dateStr = effectiveDate.toISOString().split('T')[0]

    // Get today's log to check progress
    const { data: todaysLog } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', dateStr)
        .single()

    // Get morning sequence ID
    const { data: morningSeq } = await supabase
        .from('sequences')
        .select('id')
        .eq('key', 'morning')
        .single()

    let morningComplete = false
    if (todaysLog && morningSeq) {
        const { data: morningProgress } = await supabase
            .from('sequence_progress')
            .select('status')
            .eq('daily_log_id', todaysLog.id)
            .eq('sequence_id', morningSeq.id)
            .single()

        morningComplete = morningProgress?.status === 'completed'
    }

    // Before 3am or morning not complete -> morning
    if (hour < 3 || !morningComplete) {
        if (hour >= 3) {
            redirect('/app/morning')
        }
        // Night owl, show evening
        redirect('/app/evening')
    }

    // Morning complete, check evening time
    // Get evening reflection time
    const { data: eveningMetric } = await supabase
        .from('metrics')
        .select('id')
        .eq('key', 'evening_reflection_time')
        .single()

    if (eveningMetric && todaysLog) {
        const { data: timeResponse } = await supabase
            .from('metric_responses')
            .select('value_time')
            .eq('daily_log_id', todaysLog.id)
            .eq('metric_id', eveningMetric.id)
            .single()

        if (timeResponse?.value_time) {
            const [hours, minutes] = timeResponse.value_time.split(':').map(Number)
            const reflectionTime = hours * 60 + minutes
            const currentTime = userLocalTime.getHours() * 60 + userLocalTime.getMinutes()

            if (currentTime >= reflectionTime) {
                redirect('/app/evening')
            }
        }
    }

    // Waiting for evening time - show waiting page
    redirect('/app/waiting')
}
