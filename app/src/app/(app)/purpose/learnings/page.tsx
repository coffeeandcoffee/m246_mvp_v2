'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAllLearnings } from '../actions'

type Learning = {
    id: string
    learning_text: string
    created_at: string
}

type WeekGroup = {
    weekLabel: string
    yearWeek: string // for sorting, e.g. "2026-W05"
    learnings: Learning[]
}

// Get ISO week number
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Format week label like "2026 - W05"
function formatWeekLabel(date: Date): string {
    const week = getWeekNumber(date)
    const year = date.getFullYear()
    return `${year} - W${week.toString().padStart(2, '0')}`
}

// Get sortable key for week
function getWeekKey(date: Date): string {
    const week = getWeekNumber(date)
    const year = date.getFullYear()
    return `${year}-W${week.toString().padStart(2, '0')}`
}

export default function AllLearningsPage() {
    const router = useRouter()
    const [weekGroups, setWeekGroups] = useState<WeekGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [currentWeekLabel, setCurrentWeekLabel] = useState('')

    useEffect(() => {
        async function load() {
            const data = await getAllLearnings()

            // Get current week label
            const now = new Date()
            const thisWeekLabel = formatWeekLabel(now)
            const thisWeekKey = getWeekKey(now)
            setCurrentWeekLabel(thisWeekLabel)

            // Group by week
            const groupsMap = new Map<string, WeekGroup>()

            for (const learning of data) {
                const date = new Date(learning.created_at)
                const weekLabel = formatWeekLabel(date)
                const weekKey = getWeekKey(date)

                if (!groupsMap.has(weekKey)) {
                    groupsMap.set(weekKey, {
                        weekLabel,
                        yearWeek: weekKey,
                        learnings: []
                    })
                }
                groupsMap.get(weekKey)!.learnings.push(learning)
            }

            // Sort groups by week (newest first)
            const sortedGroups = Array.from(groupsMap.values())
                .sort((a, b) => b.yearWeek.localeCompare(a.yearWeek))

            // Ensure current week exists (even if empty)
            if (!groupsMap.has(thisWeekKey)) {
                sortedGroups.unshift({
                    weekLabel: thisWeekLabel,
                    yearWeek: thisWeekKey,
                    learnings: []
                })
            }

            setWeekGroups(sortedGroups)
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div className="min-h-screen bg-black px-6 py-12 pb-32">
            <div className="w-full max-w-lg mx-auto">
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 text-sm mb-8 hover:text-gray-400"
                >
                    ← Back
                </button>

                <h1 className="text-xl font-semibold text-white text-center mb-8">
                    Past Learnings
                </h1>

                {loading ? (
                    <p className="text-gray-500 text-center">Loading...</p>
                ) : (
                    <div className="space-y-8">
                        {weekGroups.map((group) => (
                            <div key={group.yearWeek}>
                                {/* Week header */}
                                <p className="text-gray-500 text-sm mb-3">
                                    {group.weekLabel}
                                </p>

                                {group.learnings.length === 0 ? (
                                    <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                                        <p className="text-gray-500 text-sm">
                                            No learnings recorded this week.
                                        </p>
                                        <p className="text-gray-600 text-xs mt-2">
                                            Complete your morning flow and fill in a learning for the day.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {group.learnings.map((learning) => (
                                            <div
                                                key={learning.id}
                                                className="bg-gray-900/30 border border-gray-800 rounded-xl p-4"
                                            >
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {learning.learning_text}
                                                </p>
                                                <p className="text-gray-600 text-xs mt-2">
                                                    {new Date(learning.created_at).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
