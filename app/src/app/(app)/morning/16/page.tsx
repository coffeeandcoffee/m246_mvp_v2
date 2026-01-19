/**
 * MORNING PAGE 16 (v1-m-16)
 * 
 * "The Magic Task" - text input for the one task to focus on
 * 
 * Collects: magic_task (text)
 * Next → page 17
 */

'use client'

import { useState, useEffect } from 'react'
import { saveMagicTask, logPageVisit } from '../actions'

const checklistItems = [
    'It is 1 task',
    'It is usually uncomfortable/hard',
    'you know, once you complete it, you will feel relief',
    'It is something you should be doing',
    'It is something that stresses you out if you don`t do it',
    'Often times it is cold outreach, sales, content',
    'It is the single action that if repeated daily directly translates into business growth'
]

export default function MorningPage16() {
    const [task, setTask] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [visibleItems, setVisibleItems] = useState(0)

    useEffect(() => {
        logPageVisit('v1-m-16')

        // Stagger the appearance of each item
        const itemTimers = checklistItems.map((_, index) => {
            return setTimeout(() => {
                setVisibleItems(index + 1)
            }, 300 + (index * 400)) // Start after 300ms, then 400ms between each
        })

        return () => {
            itemTimers.forEach(clearTimeout)
        }
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!task.trim()) {
            setError('Please enter your magic task')
            return
        }

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.set('magicTask', task.trim())

        const result = await saveMagicTask(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect happens in the action
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">16 / 18</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                The Magic Task
            </h1>

            {/* Animated checklist */}
            <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                {checklistItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-start gap-3 transition-all duration-500 ${index < visibleItems
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-4'
                            }`}
                    >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center mt-0.5">
                            <span
                                className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 ${index < visibleItems ? 'scale-100' : 'scale-0'
                                    }`}
                                style={{ transitionDelay: `${150}ms` }}
                            />
                        </span>
                        <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                ))}
            </ul>

            {/* Task input */}
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="e.g., Finish the proposal for the new client"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none mb-6"
                    rows={3}
                    autoFocus
                />

                {/* Error */}
                {error && (
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                )}

                {/* Continue button */}
                <button
                    type="submit"
                    disabled={loading || !task.trim()}
                    className="btn-primary disabled:opacity-50"
                >
                    {loading ? '...' : 'Continue'}
                </button>
            </form>
        </div>
    )
}
