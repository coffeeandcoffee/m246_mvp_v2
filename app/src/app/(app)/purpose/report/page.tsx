'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { quarterlyQuestions, reflectionInstructions, getQuarterInfo } from '@/lib/quarterlyQuestions'
import { getQuarterlyReport, saveQuarterlyReport } from './actions'

export default function QuarterlyReportPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const year = parseInt(searchParams.get('year') || '2025')
    const quarter = parseInt(searchParams.get('quarter') || '4')

    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

    const quarterInfo = getQuarterInfo(year, quarter)
    const isEditable = quarterInfo.isEditable

    // Debounce timer ref
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Load existing answers
    useEffect(() => {
        async function loadReport() {
            const report = await getQuarterlyReport(year, quarter)
            if (report) {
                setAnswers(report.answers || {})
            }
            setLoading(false)
        }
        loadReport()
    }, [year, quarter])

    // Auto-save function
    const autoSave = useCallback(async (newAnswers: Record<string, string>) => {
        if (!isEditable) return

        setSaveStatus('saving')
        const result = await saveQuarterlyReport(year, quarter, newAnswers)
        if (result.success) {
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 1500)
        } else {
            setSaveStatus('error')
        }
    }, [year, quarter, isEditable])

    // Handle answer change with debounced auto-save
    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = { ...answers, [index.toString()]: value }
        setAnswers(newAnswers)

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        // Set new debounced save (1.5 seconds after last change)
        saveTimeoutRef.current = setTimeout(() => {
            autoSave(newAnswers)
        }, 1500)
    }

    // Manual save button
    const handleManualSave = async () => {
        if (!isEditable) return

        // Clear any pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        setSaving(true)
        setSaveStatus('saving')
        const result = await saveQuarterlyReport(year, quarter, answers)
        setSaving(false)

        if (result.success) {
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2000)
        } else {
            setSaveStatus('error')
        }
    }

    // Format editable end date
    const formatEditableUntil = () => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        const d = quarterInfo.editableEndDate
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black px-6 py-8 pb-32">
            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    {/* Back arrow */}
                    <button
                        onClick={() => router.push('/purpose#reflections')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Title */}
                    <h1 className="text-2xl font-semibold text-white">
                        {year}-Q{quarter}
                    </h1>
                </div>

                {/* Editable status */}
                <p className="text-gray-500 text-sm mb-6">
                    {isEditable
                        ? `Editable until ${formatEditableUntil()}`
                        : 'View only'
                    }
                </p>

                {/* Instructions */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 mb-8">
                    <p className="text-gray-400 text-sm font-medium mb-3">Instructions:</p>
                    <ul className="space-y-2">
                        {reflectionInstructions.map((instruction, i) => (
                            <li key={i} className="flex gap-3 text-gray-300 text-sm">
                                <span className="text-gray-500">•</span>
                                <span>{instruction}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                    {quarterlyQuestions.map((question, index) => (
                        <div key={index} className="space-y-3">
                            {/* Question number and text */}
                            <div className="flex gap-3">
                                <span className="text-gray-500 text-sm font-medium flex-shrink-0">
                                    {index + 1}.
                                </span>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {question}
                                </p>
                            </div>

                            {/* Horizontal line between question and answer */}
                            <hr className="border-gray-800 ml-6" />

                            {/* Answer field or readonly text */}
                            <div className="ml-6">
                                {isEditable ? (
                                    <textarea
                                        value={answers[index.toString()] || ''}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        placeholder="Your answer..."
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none min-h-[80px]"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        {answers[index.toString()] || <span className="italic text-gray-600">No answer provided</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Save button (only if editable) */}
                {isEditable && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleManualSave}
                            disabled={saving}
                            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                            {saveStatus === 'saving' ? 'Saving...' :
                                saveStatus === 'saved' ? 'Saved ✓' :
                                    saveStatus === 'error' ? 'Error - Try Again' :
                                        'Save'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
