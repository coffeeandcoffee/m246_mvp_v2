'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSuccessMetricQuestions, saveSuccessMetricQuestion, deleteSuccessMetricQuestion, type SuccessMetricQuestion } from '../actions'

/**
 * SUCCESS METRICS EDITING PAGE
 * 
 * Users can define up to 3 custom questions to ask themselves daily.
 * Simple add/edit/delete with auto-save on blur.
 */

export default function MetricsPage() {
    const router = useRouter()
    const [questions, setQuestions] = useState<SuccessMetricQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newQuestion, setNewQuestion] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function load() {
            const data = await getSuccessMetricQuestions()
            setQuestions(data)
            setLoading(false)
        }
        load()
    }, [])

    // Save on blur for existing questions
    async function handleBlur(q: SuccessMetricQuestion, newText: string) {
        if (newText.trim() === q.question) {
            setEditingId(null)
            return
        }
        if (!newText.trim()) return

        setSaving(true)
        await saveSuccessMetricQuestion(q.id, newText.trim(), q.position)
        setQuestions(prev => prev.map(p =>
            p.id === q.id ? { ...p, question: newText.trim() } : p
        ))
        setEditingId(null)
        setSaving(false)
    }

    // Add new question
    async function handleAddQuestion() {
        if (!newQuestion.trim() || questions.length >= 3) return

        setSaving(true)
        const result = await saveSuccessMetricQuestion(null, newQuestion.trim(), questions.length)
        if (result.success && result.id) {
            setQuestions(prev => [...prev, {
                id: result.id!,
                question: newQuestion.trim(),
                position: questions.length,
                created_at: new Date().toISOString()
            }])
            setNewQuestion('')
        }
        setSaving(false)
    }

    // Delete question
    async function handleDelete(id: string) {
        setSaving(true)
        const success = await deleteSuccessMetricQuestion(id)
        if (success) {
            setQuestions(prev => prev.filter(q => q.id !== id))
        }
        setSaving(false)
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
            <div className="w-full max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/purpose')}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-white">
                        Custom Success Metrics
                    </h1>
                </div>

                {/* Instructions */}
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Define up to 3 questions to determine if today was successful.
                    You'll answer these daily with a 1-10 rating.
                </p>

                {/* Questions list */}
                <div className="space-y-4 mb-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="flex gap-3 items-start">
                            <span className="text-gray-500 text-sm mt-3 w-6">{index + 1}.</span>
                            {editingId === q.id ? (
                                <input
                                    type="text"
                                    defaultValue={q.question}
                                    autoFocus
                                    onBlur={(e) => handleBlur(q, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.currentTarget.blur()
                                        }
                                    }}
                                    className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 text-sm focus:outline-none focus:border-gray-500"
                                />
                            ) : (
                                <div
                                    onClick={() => setEditingId(q.id)}
                                    className="flex-1 bg-gray-900/30 border border-gray-800 rounded-lg px-4 py-3 text-gray-300 text-sm cursor-pointer hover:border-gray-700"
                                >
                                    {q.question}
                                </div>
                            )}
                            <button
                                onClick={() => handleDelete(q.id)}
                                className="text-gray-600 hover:text-red-400 mt-3 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add new question */}
                {questions.length < 3 && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Add a question..."
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddQuestion()
                                }
                            }}
                        />
                        <button
                            onClick={handleAddQuestion}
                            disabled={!newQuestion.trim() || saving}
                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Add Question'}
                        </button>
                    </div>
                )}

                {/* Max reached note */}
                {questions.length >= 3 && (
                    <p className="text-gray-600 text-sm text-center">
                        Maximum 3 questions. Delete one to add a new one.
                    </p>
                )}
            </div>
        </div>
    )
}
