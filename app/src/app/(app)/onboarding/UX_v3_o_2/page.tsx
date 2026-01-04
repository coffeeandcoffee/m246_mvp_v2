/**
 * ONBOARDING PAGE UX_v3_o_2
 * 
 * Text: "Not Just One Time. But Every Day."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o2() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                Not Just One Time.<br /><br />But Every Day.
            </h1>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_3')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
