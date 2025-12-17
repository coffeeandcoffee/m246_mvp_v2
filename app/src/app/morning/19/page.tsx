/**
 * MORNING PAGE 19 (v1-m-19)
 * 
 * "When for 5-min reflection?" - time picker
 * Prefilled with previous day's time or 18:00 default
 * 
 * Collects: evening_reflection_time (time)
 * Next → page 20
 */

'use client'

import { useState, useEffect } from 'react'
import { saveReflectionTime, getPreviousReflectionTime } from '../actions'

export default function MorningPage19() {
    const [time, setTime] = useState('18:00')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [prefilling, setPrefilling] = useState(true)

    // Prefill with previous time if available
    useEffect(() => {
        async function fetchPreviousTime() {
            const previousTime = await getPreviousReflectionTime()
            if (previousTime) {
                // Format might be HH:MM:SS, we need HH:MM for input
                setTime(previousTime.substring(0, 5))
            }
            setPrefilling(false)
        }
        fetchPreviousTime()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!time) {
            setError('Please select a time')
            return
        }

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.set('reflectionTime', time)

        const result = await saveReflectionTime(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect happens in the action
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">19 / 22</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                When will you do your<br />5-min reflection today?
            </h1>

            <p className="text-gray-400 mb-12">
                Pick a time in the evening when you'll reflect on your day.
            </p>

            {/* Time picker */}
            <form onSubmit={handleSubmit}>
                {prefilling ? (
                    <p className="text-gray-500 mb-8">Loading...</p>
                ) : (
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-32 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-center text-xl focus:outline-none focus:border-white/40 mb-8 mx-auto block"
                    />
                )}

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                )}

                {/* Continue button */}
                <button
                    type="submit"
                    disabled={loading || prefilling}
                    className="btn-primary disabled:opacity-50"
                >
                    {loading ? '...' : 'Continue'}
                </button>
            </form>
        </div>
    )
}
