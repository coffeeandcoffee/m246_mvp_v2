/**
 * EVENING PAGE 5 (v1-e-5)
 * 
 * [if later] Date picker for return date
 * 
 * Collects: return_date (date)
 * 
 * Next → page 6
 */

'use client'

import { useState } from 'react'

export default function EveningPage5() {
    const [selectedDate, setSelectedDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Minimum date is 2 days from now
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + 2)
    const minDateStr = minDate.toISOString().split('T')[0]

    async function handleSubmit() {
        if (!selectedDate) {
            setError('Please select a date')
            return
        }

        setLoading(true)
        setError(null)

        // Store in sessionStorage for page 6 to use
        sessionStorage.setItem('returnDate', selectedDate)

        // Also save to database
        const { saveReturnDate } = await import('../actions')
        const formData = new FormData()
        formData.set('returnDate', selectedDate)

        const result = await saveReturnDate(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect happens in the action
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">5 / 14</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
                When will you return?
            </h1>

            {/* Date picker */}
            <div className="mb-8">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDateStr}
                    className="w-full max-w-xs p-4 bg-neutral-900 border border-white/20 rounded-lg text-white text-center text-lg focus:outline-none focus:border-white/50"
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Continue button */}
            <button
                onClick={handleSubmit}
                disabled={loading || !selectedDate}
                className="btn-primary disabled:opacity-50"
            >
                {loading ? '...' : 'Continue'}
            </button>
        </div>
    )
}
