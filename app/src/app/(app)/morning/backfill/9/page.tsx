/**
 * BACKFILL PAGE 9
 * 
 * Final page: "Great, we captured yesterday's data"
 * 
 * Success confirmation, then redirects back to morning sequence (page 22)
 * 
 * Done → /morning/22
 */

'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function BackfillPage9() {
    useEffect(() => {
        logPageVisit('v1-bf-9')
    }, [])

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">9 / 9</p>

            {/* Success checkmark */}
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-10">
                <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            {/* Main message */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                Great, we captured yesterday&apos;s data.
            </h1>

            <p className="text-gray-400 mb-16">
                Now let&apos;s continue with your morning.
            </p>

            {/* Done button - goes to morning page 22 */}
            <Link href="/morning/22" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}

