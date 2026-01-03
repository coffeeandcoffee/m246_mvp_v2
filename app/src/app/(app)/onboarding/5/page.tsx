/**
 * ONBOARDING PAGE 5 (v1-o-5)
 * 
 * "We call such days Execution Flow Days."
 * First explanation page - no data collected
 */

import Link from 'next/link'

export default function OnboardingPage5() {
    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">5 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                We call such days<br />
                <span className="text-3xl">Execution Flow Days.</span>
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                Days where you act with clarity.<br />
                Without second-guessing yourself.
            </p>

            {/* Continue button */}
            <Link href="/onboarding/6" className="btn-primary inline-block">
                Continue
            </Link>
        </div>
    )
}
