/**
 * ONBOARDING PAGE UX_v3_o_4
 * 
 * Text: "Over Everything they Ensure Focussed Persistance - No Matter the Circumstances."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o4() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                They Don't Care About Circumstances.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                Most Importantly: Serial Entrepreneurs do the single most important task every morning right after waking up. Regardless of how they feel. Its this simple, focussed, daily habit that leads to their success. And it must be trained by anyone that wants to grow a business.
            </p>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_5')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
