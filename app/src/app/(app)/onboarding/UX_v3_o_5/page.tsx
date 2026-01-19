/**
 * ONBOARDING PAGE UX_v3_o_5
 * 
 * Text: "We Guide You There with Simple Daily Actions. No Overwhelm, Just Simple Steps."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o5() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                We Guide You There. Promise.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                No overwhelm. Just simple daily steps. Success will follow.
            </p>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_6')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
