/**
 * EVENING PAGE 3 (v1-e-3)
 * 
 * [if day off] "Good, taking a day off is important."
 * Simple acknowledgment page, no data collection
 * 
 * Next → page 4
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EveningPage3() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function handleContinue() {
        setLoading(true)
        router.push('/evening/4')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">3 / 14</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Good, taking a day off is important.
            </h1>

            <p className="text-gray-400 mb-16">
                Rest is part of the process.
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
