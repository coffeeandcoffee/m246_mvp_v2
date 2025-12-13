'use client'

import { ReactNode } from 'react'
import { FeedbackButton } from '@/components/FeedbackButton'

interface SequencePageProps {
    pageId: string
    heading?: string
    children: ReactNode
    buttonText?: string
    onNext?: () => void
    disabled?: boolean
    showFeedback?: boolean
}

export function SequencePage({
    pageId,
    heading,
    children,
    buttonText,
    onNext,
    disabled = false,
    showFeedback = true,
}: SequencePageProps) {
    return (
        <div className="page-container">
            <div className="sequence-page">
                {heading && (
                    <h1 className="heading-lg">{heading}</h1>
                )}

                <div className="w-full">
                    {children}
                </div>

                {buttonText && onNext && (
                    <button
                        className="btn-primary"
                        onClick={onNext}
                        disabled={disabled}
                    >
                        {buttonText}
                    </button>
                )}
            </div>

            {showFeedback && <FeedbackButton pageId={pageId} />}
        </div>
    )
}
