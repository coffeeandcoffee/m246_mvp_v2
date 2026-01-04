/**
 * ONBOARDING PAGE UX_v3_o_1
 * 
 * Text: "Growing a Business Requires Confidence and Calm Clarity of Mind."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o1() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                Growing a Business Requires Big Confidence, Calmness and Clarity of Mind.
            </h1>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_2')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
