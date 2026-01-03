/**
 * ONBOARDING PAGE 12 (v1-o-12)
 * 
 * "You couldn't remember..."
 * Shown if user said NO on page 3 (doesn't remember last EFD)
 * Finishes onboarding
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { finishOnboarding } from '../actions'

export default function OnboardingPage12() {
    const [userName, setUserName] = useState('')
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
        }

        fetchData()
    }, [])

    async function handleFinish() {
        setLoading(true)
        await finishOnboarding()
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">12 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                {userName ? `${userName}, you` : 'You'} couldn't remember your last Execution Flow Day.
            </h1>

            <p className="text-gray-400 mb-6 leading-relaxed">
                That's completely normal.<br />
                Most entrepreneurs struggle with this.
            </p>

            <p className="text-gray-400 mb-12 leading-relaxed">
                Together, we'll make sure you have<br />
                <span className="text-white font-medium">many more to remember.</span>
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
