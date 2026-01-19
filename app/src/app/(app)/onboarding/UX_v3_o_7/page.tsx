/**
 * ONBOARDING PAGE UX_v3_o_7
 * 
 * Text: "Those are the Minimum Requirements and Only Things Needed for you to Successfully Scale Your Business."
 * 
 * Next: Goes to original onboarding page 1
 */

'use client'

import { useRouter } from 'next/navigation'

export default function OnboardingPageUXv3o7() {
    const router = useRouter()

    return (
        <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl font-semibold text-white mb-12 leading-relaxed">
                Shape Your Mind and Reality Will Follow.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                Only with the right neurological profile you can successfully scale your business. We help you remove all barriers and make your success inevitable. All you need to do are the Daily Actions in this app. Thats it.
            </p>

            <button
                onClick={() => router.push('/onboarding/1')}
                className="btn-primary"
            >
                Next
            </button>
        </div>
    )
}
