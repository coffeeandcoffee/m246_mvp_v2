/**
 * EVENING SEQUENCE - PLACEHOLDER
 * 
 * Temporary landing page after onboarding completion
 * Will be replaced with full evening sequence in future
 */

import Link from 'next/link'

export default function EveningPlaceholder() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                {/* Success indicator */}
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Main content */}
                <h1 className="text-2xl font-semibold text-white mb-4">
                    Welcome to M246
                </h1>

                <p className="text-gray-400 mb-4 leading-relaxed">
                    You've completed onboarding!
                </p>

                <p className="text-gray-500 mb-12 text-sm">
                    The Evening Sequence is coming soon.<br />
                    For now, you can explore the dashboard.
                </p>

                {/* Navigation */}
                <Link href="/dashboard" className="btn-primary inline-block">
                    Go to Dashboard
                </Link>
            </div>

            {/* Help link */}
            <footer className="absolute bottom-6 text-center">
                <span className="text-gray-600 text-xs">
                    Evening sequence will be available in a future update
                </span>
            </footer>
        </div>
    )
}
