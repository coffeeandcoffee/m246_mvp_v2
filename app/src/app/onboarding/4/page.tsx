/**
 * ONBOARDING PAGE 4 (v1-o-4)
 * 
 * "When was this day?"
 * Collects: last_efd_date → metric_responses (as date)
 * Only shown if user answered "Yes" on page 3
 */

'use client'

import { saveEfdDate } from '../actions'
import { useState } from 'react'

export default function OnboardingPage4() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await saveEfdDate(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Get today's date for max value
    const today = new Date().toISOString().split('T')[0]

    return (
        <div className="w-full max-w-sm text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">4 / 12</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-12">
                When was this day?
            </h1>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Form */}
            <form action={handleSubmit} className="space-y-8">
                <input
                    name="efdDate"
                    type="date"
                    required
                    max={today}
                    className="input-minimal text-center"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? 'Saving...' : 'Continue'}
                </button>
            </form>
        </div>
    )
}
