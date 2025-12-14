/**
 * ONBOARDING PAGE 8 (v1-o-8)
 * 
 * "Such days cause you to:" (animated checklist)
 * Elite staggered animation - no data collected
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const checklistItems = [
    'Make faster decisions',
    'Trust your gut instincts',
    'Stop overthinking every detail',
    'Take bold action without hesitation',
    'Feel genuinely confident',
    'Accomplish more in less time',
]

export default function OnboardingPage8() {
    const [visibleItems, setVisibleItems] = useState(0)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        // Stagger the appearance of each item
        const itemTimers = checklistItems.map((_, index) => {
            return setTimeout(() => {
                setVisibleItems(index + 1)
            }, 300 + (index * 400)) // Start after 300ms, then 400ms between each
        })

        // Show button after all items
        const buttonTimer = setTimeout(() => {
            setShowButton(true)
        }, 300 + (checklistItems.length * 400) + 500)

        return () => {
            itemTimers.forEach(clearTimeout)
            clearTimeout(buttonTimer)
        }
    }, [])

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">8 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-10">
                Such days cause you to:
            </h1>

            {/* Animated checklist */}
            <ul className="space-y-4 mb-12 text-left max-w-xs mx-auto">
                {checklistItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center gap-3 transition-all duration-500 ${index < visibleItems
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-4'
                            }`}
                    >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                            <span
                                className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${index < visibleItems ? 'scale-100' : 'scale-0'
                                    }`}
                                style={{ transitionDelay: `${150}ms` }}
                            />
                        </span>
                        <span className="text-gray-300">{item}</span>
                    </li>
                ))}
            </ul>

            {/* Continue button with fade-in */}
            <div className={`transition-all duration-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link href="/onboarding/9" className="btn-primary inline-block">
                    Continue
                </Link>
            </div>
        </div>
    )
}
