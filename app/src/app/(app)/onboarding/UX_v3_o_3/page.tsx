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
                We Analyzed Successful Serial Entrepreneurs.
            </h1>
            <p className="text-gray-400 mb-12 leading-relaxed">
                Their Neuroscientific profile is caused by simple daily actions anyone can do! We make it super easy for you to build the same brain as a Serial Entrepreneur by guiding you and always telling you the next step to take.
            </p>


            <button
                onClick={() => router.push('/onboarding/UX_v3_o_4')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
