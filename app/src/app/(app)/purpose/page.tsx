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

                {/* 3-Step Guide */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 mb-10 space-y-3">
                    <h2 className="text-white font-semibold text-sm mb-4">How to get the most out of M246</h2>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">1.</span>
                        <p className="text-gray-200 text-sm">Visit "Next Actions" tab every day to take the proven, guided steps.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">2.</span>
                        <p className="text-gray-200 text-sm">Watch your dream come true over the next few years.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">3.</span>
                        <p className="text-gray-200 text-sm">Monitor current progress below.</p>
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
