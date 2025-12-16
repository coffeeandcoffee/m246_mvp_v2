/**
 * MORNING PAGE 14 (v1-m-14)
 * 
 * "You can listen to your audio anytime..."
 * Information page about audio access
 * 
 * Next → page 15
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MorningPage14() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function handleContinue() {
        setLoading(true)
        router.push('/morning/15')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">14 / 22</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-6 leading-relaxed">
                You can listen to your audio anytime during the day.
            </h1>

            <p className="text-gray-400 mb-16">
                It's available on the final page and on your dashboard.
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
