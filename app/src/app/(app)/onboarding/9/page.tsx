/**
 * ONBOARDING PAGE 9 (v1-o-9)
 * 
 * "Our goal is to help you increase..."
 * Explanation page - no data collected
 */

import Link from 'next/link'

export default function OnboardingPage9() {
    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">9 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Our goal is to help you increase your Execution Flow Days.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                Through daily structured sequences<br />
                and behavioral tracking,<br />
                we help you unlock more of these days.
            </p>

            {/* Continue button */}
            <Link href="/onboarding/10" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}
