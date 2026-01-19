/**
 * MORNING PAGE 10 (v1-m-10)
 * 
 * "Read Carefully:" mental preparation slide 6
 * 
 * Next → page 11
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function MorningPage10() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-m-10')
    }, [])

    function handleContinue() {
        setLoading(true)
        router.push('/morning/11')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">10 / 22</p>

            {/* Label */}
            <p className="text-gray-500 text-sm mb-6">Read Carefully</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-16 leading-relaxed">
                The audio you're about to hear will anchor your new patterns.
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
