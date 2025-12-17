/**
 * MORNING PAGE 18 (v1-m-18)
 * 
 * "Step #3 = DONE" with personalized compliment
 * Shows user's name and 3/3 progress
 * 
 * Next → page 19
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getUserName } from '../actions'

export default function MorningPage18() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)

    // Fetch user name on mount
    useEffect(() => {
        async function fetchName() {
            const name = await getUserName()
            setUserName(name)
        }
        fetchName()
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/19')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">18 / 22</p>

            {/* Progress indicator - all complete */}
            <div className="flex justify-center gap-3 mb-12">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>

            {/* Main content */}
            <h1 className="text-3xl font-bold text-white mb-4">
                Step #3 = DONE
            </h1>

            <p className="text-xl text-gray-300 mb-8">
                {userName ? `${userName}, you're unstoppable.` : "You're unstoppable."}
            </p>

            <p className="text-gray-400 mb-16">
                You've completed the most important work of the day.<br />
                Everything else is a bonus.
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
