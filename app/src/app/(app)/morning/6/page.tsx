/**
 * MORNING PAGE 6 (v1-m-6)
 * 
 * "Read Carefully:" mental preparation slide 2
 * 
 * Next → page 7
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function MorningPage6() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-m-6')
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/7')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">6 / 22</p>

            {/* Label */}
            <p className="text-gray-500 text-sm mb-6">Read Carefully</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-16 leading-relaxed">
                Most of these thoughts are repetitive patterns — not truth.
            </h1>

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
