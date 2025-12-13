'use client'

import { useState } from 'react'

interface FeedbackButtonProps {
    pageId: string
}

const WHATSAPP_NUMBER = '4915259495693'

export function FeedbackButton({ pageId }: FeedbackButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    const getWhatsAppUrl = (type: 'help' | 'error' | 'stuck') => {
        const messages = {
            help: `I need help (pageid:${pageId}), here is my issue and steps I took (we get back to you asap):\n\n`,
            error: `I encountered error (pageid:${pageId}), here is my issue and steps I took (we get back to you asap):\n\n`,
            stuck: `I am stuck (pageid:${pageId}), here is my issue and steps I took (we get back to you asap):\n\n`,
        }
        const encodedMessage = encodeURIComponent(messages[type])
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    }

    const handleOptionClick = async (type: 'help' | 'error' | 'stuck') => {
        // TODO: Log event to page_events table
        // await logPageEvent(pageId, `${type}_click`)

        // Open WhatsApp
        window.open(getWhatsAppUrl(type), '_blank')
        setIsOpen(false)
    }

    return (
        <>
            <button
                className="feedback-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                help / error / stuck
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popup */}
                    <div className="feedback-popup">
                        <button
                            className="feedback-option"
                            onClick={() => handleOptionClick('help')}
                        >
                            help
                        </button>
                        <button
                            className="feedback-option"
                            onClick={() => handleOptionClick('error')}
                        >
                            error
                        </button>
                        <button
                            className="feedback-option"
                            onClick={() => handleOptionClick('stuck')}
                        >
                            stuck
                        </button>
                    </div>
                </>
            )}
        </>
    )
}
