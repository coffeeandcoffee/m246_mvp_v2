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
                Most of All: They Act Every Day.<br /><br />No Matter the Circumstances.
            </h1>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_5')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
