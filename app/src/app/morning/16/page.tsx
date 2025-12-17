/**
 * MORNING PAGE 16 (v1-m-16)
 * 
 * "The Magic Task" - text input for the one task to focus on
 * 
 * Collects: magic_task (text)
 * Next → page 17
 */

'use client'

import { useState } from 'react'
import { saveMagicTask } from '../actions'

export default function MorningPage16() {
    const [task, setTask] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
            <p className="text-gray-600 text-sm mb-16">16 / 22</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                The Magic Task
            </h1>

            <p className="text-gray-400 mb-8">
                What is the ONE hard task that, if completed today,<br />
                would make this day a success?
            </p>

            <p className="text-gray-400 mb-8">
                (Stress = is often an indicator that you ignore something you know you should be doing - the magic task.)
            </p>

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
