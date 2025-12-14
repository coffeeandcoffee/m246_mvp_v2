/**
 * ONBOARDING LAYOUT
 * 
 * Shared layout for all onboarding pages:
 * - Black background, centered content
 * - Page counter at top
 * - Help/error/stuck link at bottom
 */

'use client'

import { useState } from 'react'

// WhatsApp support number from README
const SUPPORT_NUMBER = '+4915259495693'

interface HelpPopupProps {
    pageId: string
    onClose: () => void
}

function HelpPopup({ pageId, onClose }: HelpPopupProps) {
    const options = [
        { label: 'I need help', type: 'help' },
        { label: 'I encountered an error', type: 'error' },
        { label: 'I am stuck', type: 'stuck' },
    ]

    const handleClick = (type: string) => {
        const message = encodeURIComponent(`${type} (pageid:${pageId})...`)
        window.open(`https://wa.me/${SUPPORT_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank')
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="w-full max-w-xs bg-neutral-900 border border-white/10 rounded-lg p-6">
                <div className="space-y-3">
                    {options.map((opt) => (
                        <button
                            key={opt.type}
                            onClick={() => handleClick(opt.type)}
                            className="w-full p-3 text-left text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full p-2 text-gray-500 text-sm hover:text-gray-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [showHelp, setShowHelp] = useState(false)
    // We'll get the pageId from the URL path
    const pageId = typeof window !== 'undefined' ? window.location.pathname : 'onboarding'

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main content area - grows to fill space */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                {children}
            </main>

            {/* Help link - fixed at bottom */}
            <footer className="py-6 text-center">
                <button
                    onClick={() => setShowHelp(true)}
                    className="help-link"
                >
                    help / error / stuck
                </button>
            </footer>

            {/* Help popup */}
            {showHelp && (
                <HelpPopup
                    pageId={pageId}
                    onClose={() => setShowHelp(false)}
                />
            )}
        </div>
    )
}
