/**
 * PROGRAM PURPOSE PAGE
 * 
 * Placeholder page for the Purpose tab.
 * Shows "Coming soon" message.
 */

export default function PurposePage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                {/* Shield/Purpose icon */}
                <div className="mb-8">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold text-white mb-4">
                    Program Purpose
                </h1>

                <p className="text-gray-500">
                    Coming soon
                </p>
            </div>
        </div>
    )
}
