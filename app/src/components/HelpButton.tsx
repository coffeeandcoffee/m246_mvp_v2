/**
 * HELP BUTTON
 * 
 * Fixed help button in top-right corner of app.
 * Shows on all authenticated pages as a global overlay.
 */

'use client'

import { useState } from 'react'
import { logHelpPopupOpen } from '@/app/actions'

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

export default function HelpButton() {
    const [showHelp, setShowHelp] = useState(false)
    const [pageId, setPageId] = useState('')

    const handleHelpClick = () => {
        const currentPath = window.location.pathname
        setPageId(currentPath)
        logHelpPopupOpen(currentPath)
        setShowHelp(true)
    }

    return (
        <>
            {/* Fixed button in top-right */}
            <button
                onClick={handleHelpClick}
                className="fixed top-4 right-4 z-40 text-gray-500 text-xs underline hover:text-gray-300"
            >
                help
            </button>

            {/* Popup */}
            {showHelp && (
                <HelpPopup
                    pageId={pageId}
                    onClose={() => setShowHelp(false)}
                />
            )}
        </>
    )
}
