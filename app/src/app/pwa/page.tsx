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

export default function PWAPage() {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

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
                Add M246 to your homescreen
            </h1>

            <p className="text-gray-400 mb-8 max-w-sm">
                For the best experience, add this app to your homescreen and open it from there.
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
        </div>
    )
}
