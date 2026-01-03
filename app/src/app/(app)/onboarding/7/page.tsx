/**
 * ONBOARDING PAGE 7 (v1-o-7)
 * 
 * "Once such a special day is over..."
 * Explanation page - no data collected
 */

import Link from 'next/link'

export default function OnboardingPage7() {
    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">7 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Once such a special day is over...
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                You look back and realize how much you accomplished.<br />
                Not because you pushed harder.<br />
                But because everything just <em>flowed</em>.
            </p>

            {/* Continue button */}
            <Link href="/onboarding/8" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}
