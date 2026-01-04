/**
 * ONBOARDING PAGE UX_v3_o_6
 * 
 * Text: "You Will Maintain a Joyful and Calm Attitude, Clarity of Mind and Big Confidence."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o6() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                You Will Maintain a Joyful and Calm Attitude.<br /><br />And Every Day You Have Clarity of Mind and Big Confidence.
            </h1>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_7')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
