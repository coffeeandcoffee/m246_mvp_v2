'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getQuarterInfo } from '@/lib/quarterlyQuestions'
import { getUserFocusPoints, getUserName, toggleFocusPointComplete, getSuccessMetricQuestions, type FocusPoint } from './actions'

/**
 * PROGRAM PURPOSE PAGE
 * 
 * Explains the 6 components of persistence for business success.
 * Includes quarterly reflections with year selection (2025-2035).
 * Shows personalized focus points panel at top.
 */

export default function PurposePage() {
    const router = useRouter()
    const [selectedYear, setSelectedYear] = useState(2025)
    const years = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035]

    // User personalization state
    const [userName, setUserName] = useState<string | null>(null)
    const [focusPoints, setFocusPoints] = useState<FocusPoint[]>([])
    const [successMetricsCount, setSuccessMetricsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUserData() {
            const [name, points, metrics] = await Promise.all([
                getUserName(),
                getUserFocusPoints(),
                getSuccessMetricQuestions()
            ])
            setUserName(name)
            setFocusPoints(points)
            setSuccessMetricsCount(metrics.length)
            setLoading(false)
        }
        loadUserData()
    }, [])

    // Handle clicking a focus point to toggle completion
    const handleFocusPointClick = async (pointId: string, currentlyCompleted: boolean) => {
        // Optimistic update
        setFocusPoints(prev => prev.map(p =>
            p.id === pointId
                ? { ...p, completed_at: currentlyCompleted ? null : new Date().toISOString() }
                : p
        ))
        // Save to database
        await toggleFocusPointComplete(pointId, currentlyCompleted)
    }

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
                <h1 className="text-2xl font-semibold text-white text-center mb-10 leading-relaxed">
                    Together, We Find The Right Way For You To Grow Your Business
                </h1>

                {/* Personalized Focus Points Panel */}
                {!loading && focusPoints.length > 0 && (
                    <div
                        className="rounded-xl p-5 mb-6 animate-fade-in-1 border border-cyan-500/20"
                        style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)' }}
                    >
                        <p className="text-cyan-400/80 text-sm text-center mb-4 tracking-wider">
                            CURRENT FOCUS
                        </p>
                        <div className="space-y-4">
                            {focusPoints.map((point) => {
                                const isCompleted = !!point.completed_at
                                return (
                                    <div
                                        key={point.id}
                                        onClick={() => handleFocusPointClick(point.id, isCompleted)}
                                        className="flex gap-4 items-center cursor-pointer hover:opacity-80"
                                    >
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full border ${isCompleted
                                                    ? 'bg-cyan-400 border-cyan-400'
                                                    : 'border-cyan-400/60'
                                                    }`}
                                            />
                                        </div>
                                        <p className={`text-sm leading-relaxed ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'
                                            }`}>
                                            {point.focus_text}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Custom Success Metrics Panel */}
                {!loading && (
                    <div
                        onClick={() => router.push('/purpose/metrics')}
                        className={`rounded-xl p-5 mb-6 cursor-pointer animate-fade-in-2 ${successMetricsCount > 0
                            ? 'bg-gray-900/20 border border-gray-800/50 hover:bg-gray-800/30'
                            : 'gradient-flow-azure border border-cyan-500/30 hover:border-cyan-400/50'
                            }`}
                        style={successMetricsCount === 0 ? {
                            boxShadow: '0 0 25px rgba(6, 182, 212, 0.2), inset 0 0 25px rgba(59, 130, 246, 0.08)'
                        } : undefined}
                    >
                        <p className={`text-sm text-center mb-3 tracking-wider ${successMetricsCount > 0 ? 'text-gray-500' : 'text-cyan-400/90'
                            }`}>
                            YOUR OWN SUCCESS DEFINITION
                        </p>
                        <div className="flex justify-center">
                            <span className={`text-sm px-4 py-1.5 rounded-full transition-colors ${successMetricsCount > 0
                                ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                                }`}>
                                {successMetricsCount > 0 ? 'Edit Success Metrics →' : 'Set Your Metric Now →'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Quarterly Reflections Panel */}
                <div id="reflections" className={`bg-gray-900/20 border border-gray-800/50 rounded-xl p-5 ${!loading ? 'animate-fade-in-3' : 'opacity-0'}`}>
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
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900/80 to-transparent pointer-events-none" />
                    </div>

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
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full border mb-2 ${isCurrentActive ? 'border-green-500' : 'border-gray-600'
                                            }`}
                                    />
                                    <span className={`text-sm ${isCurrentActive ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Q{quarter}
                                    </span>
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
