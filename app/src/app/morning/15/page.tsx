/**
 * MORNING PAGE 15 (v1-m-15)
 * 
 * "Step #3" with 2/3 progress
 * Simple intro page for the magic task phase
 * 
 * Next → page 16
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MorningPage15() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function handleContinue() {
        setLoading(true)
        router.push('/morning/16')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">15 / 22</p>

            {/* Progress indicator */}
            <div className="flex justify-center gap-3 mb-12">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>

            {/* Main content */}
            <h1 className="text-3xl font-bold text-white mb-4">
                Step #3
            </h1>

            <p className="text-gray-400 mb-16">
                The most important step.
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
