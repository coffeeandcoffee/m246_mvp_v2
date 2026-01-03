/**
 * DAY OFF PAGE
 * 
 * Shown when user opens app on a scheduled day off.
 * Displays encouraging message to rest and not think about work.
 * Includes option to override and make today a work day.
 */

'use client'

import { useState } from 'react'
import { overrideDayOff } from './actions'

export default function DayOffPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleOverride() {
        setLoading(true)
        setError(null)

        const result = await overrideDayOff()

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect happens in the action
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                {/* Sun/rest icon */}
                <div className="mb-8">
                    <svg
                        className="w-16 h-16 mx-auto text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </div>

                {/* Main message */}
                <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                    Today is a day off.
                </h1>

                <p className="text-gray-400 mb-16 leading-relaxed">
                    Ensure to recharge and don't think or ponder about work.
                </p>

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                )}

                {/* Override option */}
                <button
                    onClick={handleOverride}
                    disabled={loading}
                    className="text-gray-500 text-sm underline hover:text-gray-300 transition-colors disabled:opacity-50"
                >
                    {loading ? '...' : 'Make today a work day instead'}
                </button>
            </div>
        </div>
    )
}
