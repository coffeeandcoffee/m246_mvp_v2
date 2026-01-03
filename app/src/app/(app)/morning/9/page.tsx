/**
 * MORNING PAGE 9 (v1-m-9)
 * 
 * "Read Carefully:" mental preparation slide 5
 * 
 * Next → page 10
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function MorningPage9() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-m-9')
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/10')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">9 / 22</p>

            {/* Label */}
            <p className="text-gray-500 text-sm mb-6">Read Carefully</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-16 leading-relaxed">
                This space is where your power lives.
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
