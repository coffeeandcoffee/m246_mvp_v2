/**
 * EVENING PAGE 13 (v1-e-13)
 * 
 * "How quick were decisions?" (1–10)
 * 
 * Collects: rating_decision_speed (integer 1-10)
 * Label under "10": "Very fast"
 * 
 * Next → page 14 (final page)
 */

'use client'

import { useState, useEffect } from 'react'
import { saveRating, logPageVisit } from '../actions'

export default function EveningPage13() {
    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        logPageVisit('v1-e-13')
    }, [])

    async function handleSubmit() {
        if (selectedRating === null) {
            setError('Please select a rating')
            return
        }

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.set('metricKey', 'rating_decision_speed')
        formData.set('rating', selectedRating.toString())
        formData.set('nextPage', '/evening/14')

        const result = await saveRating(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">13 / 14</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                How quick were your decisions?
            </h1>

            {/* Rating scale 1-10 */}
            <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        onClick={() => setSelectedRating(num)}
                        className={`w-10 h-10 rounded-full border text-sm font-medium transition-all
                            ${selectedRating === num
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white border-white/30 hover:border-white/60'
                            }`}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Scale label */}
            <p className="text-gray-500 text-sm mb-12">
                10 = Very fast
            </p>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Continue button */}
            <button
                onClick={handleSubmit}
                disabled={loading || selectedRating === null}
                className="btn-primary disabled:opacity-50"
            >
                {loading ? '...' : 'Continue'}
            </button>
        </div>
    )
}
