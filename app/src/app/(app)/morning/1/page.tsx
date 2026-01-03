/**
 * MORNING PAGE 1 (v1-m-1)
 * 
 * "Step #1 ✓ NAME, you showed up. Well done."
 * Simple intro page, no data collection
 * 
 * Next → page 2
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { logPageVisit } from '../actions'

export default function MorningPage1() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        // Log this page visit for progress tracking
        logPageVisit('v1-m-1')

        async function fetchUserName() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('name')
                    .eq('user_id', user.id)
                    .single()
                if (data?.name) {
                    setUserName(data.name)
                }
            }
        }
        fetchUserName()
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/2')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">1 / 22</p>

            {/* Progress indicator - step 1 complete */}
            <div className="flex justify-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>

            {/* Step indicator */}
            <p className="text-gray-500 text-sm mb-4">Step #1 ✓</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                {userName ? `${userName}, you showed up.` : 'You showed up.'}
            </h1>

            <p className="text-gray-400 mb-16">
                Well done.
            </p>

            {/* Continue button */}
            <button
                onClick={handleContinue}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? '...' : 'Continue'}
            </button>
        </div>
    )
}
