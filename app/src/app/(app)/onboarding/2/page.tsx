/**
 * ONBOARDING PAGE 2 (v1-o-2)
 * 
 * "Is this your correct timezone?"
 * Collects: timezone → user_profiles
 * 
 * Auto-detects timezone from browser, user can confirm or change.
 */

'use client'

import { saveTimezone } from '../actions'
import { useState, useEffect } from 'react'

// Get GMT offset string for a timezone
function getGmtOffset(timezone: string): string {
    try {
        const date = new Date()
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'shortOffset'
        })
        const parts = formatter.formatToParts(date)
        const offsetPart = parts.find(p => p.type === 'timeZoneName')
        return offsetPart?.value || ''
    } catch {
        return ''
    }
}

export default function OnboardingPage2() {
    const [timezone, setTimezone] = useState<string>('')
    const [gmtOffset, setGmtOffset] = useState<string>('')
    const [showPicker, setShowPicker] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Detect timezone on mount
    useEffect(() => {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimezone(detected)
        setGmtOffset(getGmtOffset(detected))
    }, [])

    async function handleConfirm() {
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.set('timezone', timezone)

        const result = await saveTimezone(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    async function handleTimezoneChange(newTimezone: string) {
        setTimezone(newTimezone)
        setGmtOffset(getGmtOffset(newTimezone))
        setShowPicker(false)
    }

    // Common timezones for picker
    const commonTimezones = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
    ]

    return (
        <div className="w-full max-w-sm text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">2 / 12</p>

            {/* Main question */}
            <h1 className="text-2xl font-semibold text-white mb-8">
                Is this your correct timezone?
            </h1>

            {/* Detected timezone display */}
            <div className="mb-12">
                <p className="text-xl text-white font-medium">{timezone}</p>
                <p className="text-gray-500 text-sm mt-1">({gmtOffset})</p>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Buttons */}
            {!showPicker ? (
                <div className="space-y-4">
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : 'Yes, that\'s correct'}
                    </button>
                    <button
                        onClick={() => setShowPicker(true)}
                        className="btn-secondary w-full"
                    >
                        No, change timezone
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {commonTimezones.map((tz) => (
                        <button
                            key={tz}
                            onClick={() => handleTimezoneChange(tz)}
                            className="w-full p-3 text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
                        >
                            {tz} <span className="text-gray-600">({getGmtOffset(tz)})</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setShowPicker(false)}
                        className="btn-secondary w-full mt-4"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}
