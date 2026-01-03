/**
 * BACKFILL PAGE 1
 * 
 * Intro page: "We missed yesterday's reflection"
 * 
 * This is the entry point for the backfill sequence.
 * Triggered from morning page 21 when yesterday's evening data is empty.
 * 
 * Next → page 2 (first rating: positivity)
 */

'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { logPageVisit } from '../actions'

export default function BackfillPage1() {
    useEffect(() => {
        logPageVisit('v1-bf-1')
    }, [])

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">1 / 9</p>

            {/* Main message */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                We missed yesterday&apos;s reflection.
            </h1>

            <p className="text-gray-400 mb-16 leading-relaxed">
                Let&apos;s quickly capture how you felt yesterday so we don&apos;t lose that data.
            </p>

            {/* Continue button */}
            <Link href="/morning/backfill/2" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}

