/**
 * EVENING PAGE 1 (v1-e-1)
 * 
 * "Your 5-min reflection is ready..."
 * Simple intro page, no data collection
 * 
 * Next → page 2
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function EveningPage1() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-e-1')
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/evening/2')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">1 / 14</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Your 5-min reflection is ready.
            </h1>

            <p className="text-gray-400 mb-16">
                Let's capture how today went.
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
