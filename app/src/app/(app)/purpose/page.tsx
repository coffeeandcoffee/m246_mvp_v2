'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuarterInfo } from '@/lib/quarterlyQuestions'

/**
 * PROGRAM PURPOSE PAGE
 * 
 * Explains the 6 components of persistence for business success.
 * Includes quarterly reflections with year selection (2025-2035).
 */

export default function PurposePage() {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(2025)
    const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]

    const components = [
        {
            number: 1,
            text: "Quarterly Personal & Business Reflection.",
            completed: false
        },
        {
            number: 2,
            text: "Full Awareness of Self and Mode of Operation.",
            completed: false
        },
        {
            number: 3,
            text: "Definite Purpose Backed by a Burning Desire for its Fulfillment.",
            completed: false
        },
        {
            number: 4,
            text: "Definite Plan to be Expressed in Continuous Action.",
            completed: false
        },
        {
            number: 5,
            text: "Daily System for a Mind Closed Tightly Against All Negative and Discouraging Influences. (including negative suggestions of relatives, friends and acquaintances)",
            completed: false
        },
        {
            number: 6,
            text: "Weekly Meetings with a Friendly Alliance of One or More Persons who Encourage You to Follow Through with Both Plan and Purpose.",
            completed: false
        }
    ]

    // Find current active quarter (most recent one that's active)
    const findActiveQuarter = () => {
        const now = new Date()
        // Check from most recent to oldest
        for (let y = 2035; y >= 2025; y--) {
            for (let q = 4; q >= 1; q--) {
                const info = getQuarterInfo(y, q, now)
                if (info.isActive) {
                    return { year: y, quarter: q }
                }
            }
        }
        return null
    }

    const activeQuarterData = findActiveQuarter()

    // Find the next quarter after the active one (for "available" text)
    const getNextQuarter = (year: number, quarter: number) => {
        if (quarter < 4) {
            return { year, quarter: quarter + 1 }
        }
        return { year: year + 1, quarter: 1 }
    }

    const nextQuarterData = activeQuarterData
        ? getNextQuarter(activeQuarterData.year, activeQuarterData.quarter)
        : null

    // Handle quarter click - navigate to report page
    const handleQuarterClick = (year: number, quarter: number) => {
        const info = getQuarterInfo(year, quarter)
        if (info.isActive) {
            router.push(`/purpose/report?year=${year}&quarter=${quarter}`)
        }
    }

    return (
        <div className="min-h-screen bg-black px-6 py-12 pb-32">
            <div className="w-full max-w-lg mx-auto">
                {/* Headline */}
                <h1 className="text-2xl font-semibold text-white text-center mb-3 leading-relaxed">
                    Get the Clarity and Confidence to Grow Your Business like a Serial Entrepreneur.
                </h1>

                {/* Quote below headline */}
                <p className="text-gray-500 text-sm text-center mb-10">
                    Remove all Barriers. No Overthinking. Just Execution.
                </p>

                {/* 3-Step Guide */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 mb-10 space-y-3">
                    <h2 className="text-white font-semibold text-sm mb-4">How to use:</h2>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">1.</span>
                        <p className="text-gray-200 text-sm">Open App Every Day to do the Next Action.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">2.</span>
                        <p className="text-gray-200 text-sm">Monitor Progress Below.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-gray-400 font-medium">3.</span>
                        <p className="text-gray-200 text-sm">Watch your business grow.</p>
                    </div>
                </div>

                {/* Progress Panel */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 mt-10">
                    <p className="text-gray-500 text-sm text-center mb-6">
                        PROGRESS
                    </p>
                    <div className="space-y-4">
                        {components.map((component, index) => (
                            <div
                                key={component.number}
                                className="flex gap-4 items-center"
                            >
                                {/* Circle bullet - green stroke only for first, gray for rest */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full border ${component.completed
                                            ? 'bg-green-500 border-green-500'
                                            : index === 0
                                                ? 'border-green-500'
                                                : 'border-gray-600'
                                            }`}
                                    />
                                </div>
                                {/* Text - first item lighter, rest darker */}
                                <p className={`text-sm leading-relaxed ${index === 0 ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {component.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quarterly Reflections Panel */}
                <div id="reflections" className="bg-gray-900/20 border border-gray-800/50 rounded-xl p-5 mt-6">
                    <p className="text-gray-500 text-sm text-center mb-4">
                        QUARTERLY REFLECTIONS
                    </p>

                    {/* Year Selector - scrollable with fade */}
                    <div className="relative mb-4">
                        <div
                            className="overflow-x-auto"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                        >
                            <div className="flex gap-4 whitespace-nowrap px-2">
                                {years.map((year) => (
                                    <span
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`text-sm cursor-pointer ${selectedYear === year
                                            ? 'text-gray-300'
                                            : 'text-gray-600 hover:text-gray-400'
                                            }`}
                                    >
                                        {year}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Fade gradient on right */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none" />
                    </div>

                    {/* Horizontal line below years */}
                    <hr className="border-gray-800 mb-4" />

                    {/* Q1-Q4 Panels */}
                    <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((quarter) => {
                            const quarterInfo = getQuarterInfo(selectedYear, quarter)
                            const isCurrentActive = activeQuarterData?.year === selectedYear && activeQuarterData?.quarter === quarter
                            const isNextQuarter = nextQuarterData?.year === selectedYear && nextQuarterData?.quarter === quarter

                            return (
                                <div
                                    key={quarter}
                                    onClick={() => handleQuarterClick(selectedYear, quarter)}
                                    className={`bg-gray-900/30 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[80px] ${quarterInfo.isActive ? 'cursor-pointer hover:bg-gray-800/50' : 'opacity-50'
                                        }`}
                                >
                                    {/* Circle bullet */}
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full border mb-2 ${isCurrentActive ? 'border-green-500' : 'border-gray-600'
                                            }`}
                                    />
                                    {/* Quarter label */}
                                    <span className={`text-sm ${isCurrentActive ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Q{quarter}
                                    </span>
                                    {/* "Available" text for next quarter */}
                                    {isNextQuarter && !quarterInfo.isActive && (
                                        <span className="text-[10px] text-gray-600 mt-1 text-center">
                                            available {quarterInfo.availableText}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
