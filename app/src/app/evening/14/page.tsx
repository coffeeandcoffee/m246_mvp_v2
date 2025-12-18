/**
 * EVENING PAGE 14 (v1-e-14)
 * 
 * "Great job NAME. See you [DATE]."
 * 
 * Final page of evening sequence.
 * Shows "tomorrow" only if returning next day (committed on page 2).
 * Shows specific date if taking day off (from return_date).
 * 
 * This is a SERVER component to fetch user data.
 */

import { createClient } from '@/utils/supabase/server'

export default async function EveningPage14() {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="w-full max-w-md text-center">
                <p className="text-gray-400">Not authenticated</p>
            </div>
        )
    }

    // Get user's name from profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single()

    const userName = profile?.name || 'friend'

    // Check if user committed (returning tomorrow) or took day off (has return_date)
    // First, check for committed_tomorrow metric
    const { data: commitMetric } = await supabase
        .from('metric_responses')
        .select('value_text, metrics!inner(key)')
        .eq('user_id', user.id)
        .eq('metrics.key', 'committed_tomorrow')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    const committed = commitMetric?.value_text === 'true'

    // Calculate what to show
    let returnText = 'tomorrow'

    if (!committed) {
        // User took day off - get their return_date
        const { data: returnMetric } = await supabase
            .from('metric_responses')
            .select('value_date, metrics!inner(key)')
            .eq('user_id', user.id)
            .eq('metrics.key', 'return_date')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (returnMetric?.value_date) {
            const date = new Date(returnMetric.value_date + 'T00:00:00')
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
            returnText = `on ${weekday} morning, ${dateStr}`
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">14 / 14</p>

            {/* Success checkmark */}
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-10">
                <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            {/* Main message */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                Great job, {userName}.
            </h1>

            <p className="text-gray-400 mb-16">
                See you tomorrow, right after awaking.
            </p>

            {/* Hint text instead of button */}
            <p className="text-gray-500 text-sm">
                You can close this app now and return tomorrow morning. Enjoy your evening!
            </p>
        </div>
    )
}
