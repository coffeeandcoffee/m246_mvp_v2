/**
 * MORNING PAGE 21 (v1-m-21)
 * 
 * Backfill page - only shown if yesterday's evening was missed
 * "We missed yesterday's reflection" → quick rating collection
 * 
 * TODO: Implement backfill logic
 * For now, this is a placeholder that just redirects to page 22
 * 
 * Next → page 22
 */

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MorningPage21() {
    const router = useRouter()

    // TODO: Check if yesterday's evening is empty
    // If not empty, skip to page 22
    // For now, always skip
    useEffect(() => {
        router.push('/morning/22')
    }, [router])

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">21 / 22</p>

            {/* Loading state while redirecting */}
            <h1 className="text-xl font-medium text-white mb-8">
                Checking yesterday's data...
            </h1>
        </div>
    )
}
