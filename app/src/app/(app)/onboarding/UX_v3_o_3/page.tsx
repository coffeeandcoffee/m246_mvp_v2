/**
 * ONBOARDING PAGE UX_v3_o_3
 * 
 * Text: "We Interviewed and Analyzed the Minds of the Best Serial Entrepreneurs. Their Systems are Simple and Reliable."
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o3() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                We Analyzed the Behaviours of Successful Serial Entrepreneurs.<br /><br />Their Systems are Simple, Reliable and Easy to Follow.<br /><br />You Just Need to Do It.
            </h1>

            <button
                onClick={() => router.push('/onboarding/UX_v3_o_4')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
