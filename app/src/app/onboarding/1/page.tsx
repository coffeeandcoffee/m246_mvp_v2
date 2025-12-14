/**
 * ONBOARDING PAGE 1 (v1-o-1)
 * 
 * "How can we call you?"
 * Collects: display_name → user_profiles
 */

'use client'

import { saveDisplayName } from '../actions'
import { useState } from 'react'

export default function OnboardingPage1() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await saveDisplayName(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-sm text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">1 / 12</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-12">
                How can we call you?
            </h1>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Form */}
            <form action={handleSubmit} className="space-y-8">
                <input
                    name="displayName"
                    type="text"
                    required
                    autoFocus
                    className="input-minimal text-center"
                    placeholder="Your first name..."
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
