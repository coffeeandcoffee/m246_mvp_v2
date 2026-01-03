/**
 * ONBOARDING PAGE 11 (v1-o-11)
 * 
 * "Your last EFD was [DATE]..."
 * Personalized page shown if user entered a date
 * Finishes onboarding
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { finishOnboarding } from '../actions'

export default function OnboardingPage11() {
    const [userName, setUserName] = useState('')
    const [efdDate, setEfdDate] = useState<string | null>(null)
    const [daysSince, setDaysSince] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            // Get user profile for name
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('name')
                .eq('user_id', user.id)
                .single()

            if (profile?.name) {
                setUserName(profile.name)
            }

            // Get EFD date
            const { data: response } = await supabase
                .from('metric_responses')
                .select(`
                    value_date,
                    metrics!inner(key)
                `)
                .eq('user_id', user.id)
                .eq('metrics.key', 'last_efd_date')
                .single()

            if (response?.value_date) {
                setEfdDate(response.value_date)
                // Calculate days since
                const efdDateObj = new Date(response.value_date)
                const today = new Date()
                const diffTime = today.getTime() - efdDateObj.getTime()
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                setDaysSince(diffDays)
            }
        }

        fetchData()
    }, [])

    async function handleFinish() {
        setLoading(true)
        await finishOnboarding()
    }

    // Format the date nicely
    const formattedDate = efdDate
        ? new Date(efdDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : ''

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">11 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                {userName ? `${userName}, your` : 'Your'} last Execution Flow Day was
            </h1>

            <p className="text-3xl font-bold text-white mb-4">
                {formattedDate}
            </p>

            {daysSince !== null && (
                <p className="text-gray-400 mb-8">
                    That was <span className="text-white font-semibold">{daysSince}</span> {daysSince === 1 ? 'day' : 'days'} ago.
                </p>
            )}

            <p className="text-gray-400 mb-12 leading-relaxed">
                Let's work together to increase<br />
                your Execution Flow Days.
            </p>

            {/* Finish button */}
            <button
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? 'Starting...' : "Let's Begin"}
            </button>
        </div>
    )
}
