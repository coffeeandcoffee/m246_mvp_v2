/**
 * ONBOARDING PAGE 4 (v1-o-4) - Placeholder
 * 
 * "When was this day?" (date picker for last EFD)
 * Only shown if user answered "Yes" on page 3
 * 
 * TODO: Implement date picker in future step
 */

export default function OnboardingPage4() {
    return (
        <div className="w-full max-w-sm text-center">
            <p className="text-gray-600 text-sm mb-16">4 / 12</p>
            <h1 className="text-2xl font-semibold text-white mb-8">
                When was this day?
            </h1>
            <p className="text-gray-500 mb-8">
                [Date picker coming soon]
            </p>
            <a href="/onboarding/5" className="btn-primary inline-block">
                Continue
            </a>
        </div>
    )
}
