/**
 * ONBOARDING PAGE 3 (v1-o-3)
 * 
 * "Do you remember the last day you did not overthink a single decision?"
 * Collects: remembers_efd (yes/no) → metric_responses
 * 
 * Branching:
 * - Yes → page 4 (date picker)
 * - No → page 5 (skip date picker)
 */

'use client'

import { saveMetricResponse } from '../actions'
import { useState } from 'react'

export default function OnboardingPage3() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<'yes' | 'no' | null>(null)

    async function handleChoice(choice: 'yes' | 'no') {
        setLoading(choice)
        setError(null)

        const formData = new FormData()
        formData.set('metricKey', 'remembers_efd')
        formData.set('responseValue', choice)
        // Branch: Yes goes to page 4, No skips to page 5
        formData.set('nextPage', choice === 'yes' ? '/onboarding/4' : '/onboarding/5')

        const result = await saveMetricResponse(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(null)
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">3 / 12</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-16 leading-relaxed">
                Do you remember the last day you did not overthink a single decision?
            </h1>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Yes/No buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleChoice('yes')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'yes' ? '...' : 'Yes'}
                </button>
                <button
                    onClick={() => handleChoice('no')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'no' ? '...' : 'No'}
                </button>
            </div>
        </div>
    )
}
