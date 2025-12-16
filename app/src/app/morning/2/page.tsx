/**
 * MORNING PAGE 2 (v1-m-2)
 * 
 * Checkbox: "I will not open other apps..."
 * Requires checkbox to be checked before proceeding
 * 
 * Next → page 3
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MorningPage2() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)

    function handleCommit() {
        setLoading(true)
        router.push('/morning/3')
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">2 / 22</p>

            {/* Checkbox commitment */}
            <label className="flex items-start gap-4 text-left mb-12 cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-white/30 bg-transparent checked:bg-white checked:border-white"
                />
                <span className="text-white text-lg leading-relaxed">
                    I will not open other apps until this morning routine is complete.
                </span>
            </label>

            {/* Commit button */}
            <button
                onClick={handleCommit}
                disabled={loading || !checked}
                className="btn-primary disabled:opacity-50"
            >
                {loading ? '...' : 'Commit'}
            </button>
        </div>
    )
}
