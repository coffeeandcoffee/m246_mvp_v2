/**
 * MORNING PAGE 4 (v1-m-4)
 * 
 * "Now we get your brain into the right state..."
 * Transition page before reading slides
 * 
 * Next → page 5
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function MorningPage4() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-m-4')
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/5')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">4 / 22</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Now we get your brain into the right state.
            </h1>

            <p className="text-gray-400 mb-16">
                Read the following carefully.
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
