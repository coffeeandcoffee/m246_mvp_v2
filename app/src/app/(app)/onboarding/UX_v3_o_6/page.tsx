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
                You are Joyful and Calm.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                You will behave exactly like a Serial Entrepreneur. Your calmness will radiate. Your clarity of mind and confidence is felt by anybody in the room. Soon you will see opportunities arise in different shapes.
            </p>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_7')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
