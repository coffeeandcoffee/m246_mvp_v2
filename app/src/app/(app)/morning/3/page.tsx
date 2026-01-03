/**
 * MORNING PAGE 3 (v1-m-3)
 * 
 * "Step #2: Put headphones in."
 * Simple instruction page
 * 
 * Next → page 4
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function MorningPage3() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        logPageVisit('v1-m-3')
    }, [])

    function handleDone() {
        setLoading(true)
        router.push('/morning/4')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">3 / 22</p>

            {/* Progress indicator - step 1 done, starting step 2 */}
            <div className="flex justify-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                <div className="w-3 h-3 rounded-full bg-white/30"></div>
            </div>

            {/* Step indicator */}
            <p className="text-gray-500 text-sm mb-4">Step #2</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-16 leading-relaxed">
                Put headphones in.
            </h1>

            {/* Done button */}
            <button
                onClick={handleDone}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? '...' : 'Done'}
            </button>
        </div>
    )
}
