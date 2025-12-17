/**
 * EVENING PAGE 6 (v1-e-6)
 * 
 * "Commit to return on [WEEKDAY, DATE] morning?"
 * 
 * Reads return date from sessionStorage (set by page 4 or 5)
 * Shows the date in a friendly format
 * 
 * Next → page 7 (ratings)
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function EveningPage6() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [returnDate, setReturnDate] = useState<string | null>(null)
    const [formattedDate, setFormattedDate] = useState('')

    useEffect(() => {
        logPageVisit('v1-e-6')

        // Get return date from sessionStorage
        const stored = sessionStorage.getItem('returnDate')
        if (stored) {
            setReturnDate(stored)
            // Format the date nicely
            const date = new Date(stored + 'T00:00:00')
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
            setFormattedDate(`${weekday}, ${dateStr}`)
        }
    }, [])

    function handleCommit() {
        setLoading(true)
        // Clear the sessionStorage
        sessionStorage.removeItem('returnDate')
        router.push('/evening/7')
    }

    if (!formattedDate) {
        return (
            <div className="w-full max-w-md text-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">6 / 14</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-16 leading-relaxed">
                Commit to return in the morning, right after waking up, on {formattedDate}?
            </h1>

            {/* Commit button */}
            <button
                onClick={handleCommit}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? '...' : 'Commit'}
            </button>
        </div>
    )
}
