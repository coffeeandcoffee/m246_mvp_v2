/**
 * PROGRAM PURPOSE PAGE
 * 
 * Explains the 4 components of persistence for business success.
 * Each component shows "Coming Soon" as features are in development.
 */

export default function PurposePage() {
    const components = [
        {
            number: 1,
            text: "A Definite purpose, backed by a burning desire for its fulfillment."
        },
        {
            number: 2,
            text: "A Definite Plan, expressed in continuous action."
        },
        {
            number: 3,
            text: "A mind closed tightly against all negative and discouraging influences, including negative suggestions of relatives, friends and acquaintances."
        },
        {
            number: 4,
            text: "A friendly alliance with one or more persons who will encourage one to follow through with both plan and purpose."
        }
    ]

    return (
        <div className="min-h-screen bg-black px-6 py-12 pb-32">
            <div className="w-full max-w-lg mx-auto">
                {/* Headline */}
                <h1 className="text-2xl font-semibold text-white text-center mb-3 leading-relaxed">
                    We Guide You to Your Dream.
                </h1>

                {/* Quote below headline */}
                <p className="text-gray-500 text-sm text-center mb-10">
                    The only insurance against failure is focussed persistence.
                </p>

                {/* Info Box */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-10">
                    <div className="flex gap-3">
                        {/* Info icon in circle - smaller */}
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center">
                                <span className="text-blue-400 font-medium text-[10px]">i</span>
                            </div>
                        </div>
                        {/* Info text */}
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Simply do the steps in "Next Actions" tab, and watch your dream come true over the next few years. Track your progress of the 4 Essential Components of Persistence below.
                        </p>
                    </div>
                </div>

                {/* The 4 Components */}
                <div className="space-y-6">
                    {components.map((component) => (
                        <div
                            key={component.number}
                            className="bg-gray-900/30 border border-gray-800 rounded-xl p-5"
                        >
                            {/* Number and text */}
                            <div className="flex gap-4 mb-3">
                                <span className="flex-shrink-0 text-gray-500 font-semibold">
                                    {component.number}.
                                </span>
                                <p className="text-white text-sm leading-relaxed">
                                    {component.text}
                                </p>
                            </div>
                            {/* Coming Soon label */}
                            <div className="ml-6">
                                <span className="text-xs text-gray-600 uppercase tracking-wider">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
