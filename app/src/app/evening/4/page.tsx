/**
 * EVENING PAGE 4 (v1-e-4)
 * 
 * "When will you return?"
 * 
 * Branching:
 * - [Day after tomorrow] → saves return_date → page 6 (commit confirmation)
 * - [Later] → page 5 (date picker)
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { saveReturnDate } from '../actions'

export default function EveningPage4() {
    const router = useRouter()
    const [loading, setLoading] = useState<'tomorrow' | 'later' | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleChoice(choice: 'tomorrow' | 'later') {
        setLoading(choice)
        setError(null)

        if (choice === 'tomorrow') {
            // Day after tomorrow - calculate date and save to DB
            const dayAfterTomorrow = new Date()
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
            const dateStr = dayAfterTomorrow.toISOString().split('T')[0]

            // Store in sessionStorage for page 6 display
            sessionStorage.setItem('returnDate', dateStr)

            // Also save to database
            const formData = new FormData()
            formData.set('returnDate', dateStr)

            const result = await saveReturnDate(formData)

            if (result?.error) {
                setError(result.error)
                setLoading(null)
                return
            }
            // Redirect happens in the action (to /evening/6)
        } else {
            // Later - go to date picker
            router.push('/evening/5')
        }
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">4 / 14</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-16 leading-relaxed">
                When will you return?
            </h1>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Choice buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => handleChoice('tomorrow')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'tomorrow' ? '...' : 'Day after tomorrow'}
                </button>
                <button
                    onClick={() => handleChoice('later')}
                    disabled={loading !== null}
                    className="btn-choice"
                >
                    {loading === 'later' ? '...' : 'Later'}
                </button>
            </div>
        </div>
    )
}
