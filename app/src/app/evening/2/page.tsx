/**
 * EVENING PAGE 2 (v1-e-2)
 * 
 * "Will you commit to open this app tomorrow?"
 * 
 * Collects: committed_tomorrow (boolean)
 * 
 * Branching:
 * - [Commit] → page 7 (skip to ratings)
 * - [Day off] → page 3 (day off flow)
 */

'use client'

import { saveCommitmentResponse } from '../actions'
import { useState } from 'react'

export default function EveningPage2() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<'commit' | 'dayoff' | null>(null)

    async function handleChoice(choice: 'commit' | 'dayoff') {
        setLoading(choice)
        setError(null)

        const formData = new FormData()
        formData.set('choice', choice)
        // Branch: Commit goes to page 7 (ratings), Day off goes to page 3
        formData.set('nextPage', choice === 'commit' ? '/evening/7' : '/evening/3')

        const result = await saveCommitmentResponse(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(null)
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">2 / 14</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-16 leading-relaxed">
                Will you commit to open this app tomorrow morning?
            </h1>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Commit / Day off buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleChoice('commit')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'commit' ? '...' : 'Commit'}
                </button>
                <button
                    onClick={() => handleChoice('dayoff')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'dayoff' ? '...' : 'Day off'}
                </button>
            </div>
        </div>
    )
}
