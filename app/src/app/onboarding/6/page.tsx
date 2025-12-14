/**
 * ONBOARDING PAGE 6 (v1-o-6)
 * 
 * "Those days feel really good..."
 * Explanation page - no data collected
 */

import Link from 'next/link'

export default function OnboardingPage6() {
    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">6 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Those days feel really good.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                You wake up with purpose.<br />
                You move through your day with momentum.<br />
                Decisions come easy. Doubt stays quiet.
            </p>

            {/* Continue button */}
            <Link href="/onboarding/7" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}
