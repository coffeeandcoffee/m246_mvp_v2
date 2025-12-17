/**
 * MORNING PAGE 20 (v1-m-20)
 * 
 * "Set alarm on your phone" - reminder page
 * Shows the time user just selected so they know what to set
 * 
 * Next → page 21 (backfill) or page 22 (final)
 * For now, always go to page 22 (backfill logic added later)
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getPreviousReflectionTime } from '../actions'

export default function MorningPage20() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [reflectionTime, setReflectionTime] = useState<string | null>(null)

    // Fetch the time user just set
    useEffect(() => {
        async function fetchTime() {
            const time = await getPreviousReflectionTime()
            if (time) {
                // Format HH:MM:SS to readable format
                setReflectionTime(formatTimeForDisplay(time))
            }
        }
        fetchTime()
    }, [])

    function handleContinue() {
        setLoading(true)
        // For now, skip backfill page and go to final
        // TODO: Add backfill logic to check if yesterday's evening is empty
        router.push('/morning/22')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">20 / 22</p>

            {/* Alarm icon */}
            <div className="text-5xl mb-8">⏰</div>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                Set an alarm on your phone.
            </h1>

            {/* Show the time they selected */}
            {reflectionTime && (
                <div className="bg-white/10 border border-white/20 rounded-lg px-6 py-4 mb-6 inline-block">
                    <p className="text-white text-2xl font-bold">{reflectionTime}</p>
                </div>
            )}

            <p className="text-gray-400 mb-16">
                This ensures you won't forget your evening reflection.<br />
                It only takes 5 minutes.
            </p>

            {/* Continue button */}
            <button
                onClick={handleContinue}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? '...' : 'Done'}
            </button>
        </div>
    )
}

// Convert HH:MM:SS or HH:MM to readable format like "6:30 PM"
function formatTimeForDisplay(time: string): string {
    try {
        const [hours, minutes] = time.split(':').map(Number)
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    } catch {
        return time.substring(0, 5) // fallback to HH:MM
    }
}
