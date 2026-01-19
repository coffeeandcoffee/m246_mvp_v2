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

            <p className="text-gray-400 mb-12 leading-relaxed">
                Our team of Neuroscientists actively investigates this phenomenon so you can get this same brain profile that leads to business success.
            </p>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_3')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
