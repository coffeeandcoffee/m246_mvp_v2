/**
 * MORNING PAGE 7 (v1-m-7)
 * 
 * "Read Carefully:" mental preparation slide 3
 * 
 * Next → page 8
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MorningPage7() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function handleContinue() {
        setLoading(true)
        router.push('/morning/8')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">7 / 22</p>

            {/* Label */}
            <p className="text-gray-500 text-sm mb-6">Read Carefully</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-16 leading-relaxed">
                You have the power to choose which thoughts to believe.
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
