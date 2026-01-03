/**
 * PWA PAGE
 * 
 * Detects if opened from homescreen (standalone) or browser:
 * - Standalone → redirect to /router for normal app flow
 * - Browser → show "Add to homescreen" instructions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logHelpPopupOpen } from '@/app/actions'

// WhatsApp support number
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
        const message = encodeURIComponent(`${type} (pageid:${pageId})\n\nType your message below here:\n\n`)
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

export default function PWAPage() {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        // Check if running in standalone mode (opened from homescreen)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true

        if (isStandalone) {
            // Opened from homescreen → go to normal app flow
            router.replace('/router')
        } else {
            // Browser → show add to homescreen instructions
            setIsChecking(false)
        }
    }, [router])

    // Show loading while checking
    if (isChecking) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    // Browser mode → show instructions
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-2xl font-semibold text-white mb-4">
                Add M246 to your phone's homescreen
            </h1>

            <p className="text-gray-400 mb-8 max-w-sm">
                M246 is mobile only. For the best experience, add this app to your homescreen and open it from there.
            </p>

            <div className="space-y-6 text-left max-w-sm">
                {/* iOS Instructions */}
                <div className="p-4 border border-white/10 rounded-lg">
                    <h2 className="text-white font-medium mb-2">iPhone / iPad</h2>
                    <ol className="text-gray-400 text-sm space-y-1">
                        <li>1. Tap the <span className="text-white">Share</span> button (bottom of screen)</li>
                        <li>2. Scroll down and tap <span className="text-white">Add to Home Screen</span></li>
                        <li>3. Tap <span className="text-white">Add</span></li>
                    </ol>
                </div>

                {/* Android Instructions */}
                <div className="p-4 border border-white/10 rounded-lg">
                    <h2 className="text-white font-medium mb-2">Android</h2>
                    <ol className="text-gray-400 text-sm space-y-1">
                        <li>1. Tap the <span className="text-white">⋮</span> menu (top right)</li>
                        <li>2. Tap <span className="text-white">Add to Home screen</span></li>
                        <li>3. Tap <span className="text-white">Add</span></li>
                    </ol>
                </div>
            </div>

            <p className="text-gray-500 text-sm mt-8">
                Then open M246 from your homescreen to continue.
            </p>

            {/* Help/stuck/error link */}
            <button
                onClick={() => {
                    logHelpPopupOpen('/pwa')
                    setShowHelp(true)
                }}
                className="text-gray-600 text-xs mt-6 underline hover:text-gray-400"
            >
                Help / Stuck / Error?
            </button>

            {/* Help popup */}
            {showHelp && (
                <HelpPopup
                    pageId="/pwa"
                    onClose={() => setShowHelp(false)}
                />
            )}
        </div>
    )
}
