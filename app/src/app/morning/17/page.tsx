/**
 * MORNING PAGE 17 (v1-m-17)
 * 
 * Display the magic task user just entered
 * "Focus only on this" with [Task Done] button
 * 
 * Collects: magic_task_completed (boolean)
 * Next → page 18
 */

'use client'

import { useState, useEffect } from 'react'
import { getMagicTask, completeMagicTask, logPageVisit } from '../actions'

export default function MorningPage17() {
    const [task, setTask] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [taskLoading, setTaskLoading] = useState(true)

    // Fetch the magic task on mount
    useEffect(() => {
        logPageVisit('v1-m-17')

        async function fetchTask() {
            const result = await getMagicTask()
            if (result.error) {
                setError(result.error)
            } else {
                setTask(result.task)
            }
            setTaskLoading(false)
        }
        fetchTask()
    }, [])

    async function handleComplete() {
        setLoading(true)
        setError(null)

        const result = await completeMagicTask()

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect happens in the action
    }

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">17 / 22</p>

            {/* Main content */}
            <p className="text-gray-400 text-sm mb-4">Your Magic Task:</p>

            {/* Display the task */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-8">
                {taskLoading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : task ? (
                    <p className="text-xl text-white font-medium">{task}</p>
                ) : (
                    <p className="text-gray-500">No task found</p>
                )}
            </div>

            <h1 className="text-xl font-medium text-white mb-4 leading-relaxed">
                Focus only on this now.
            </h1>

            <p className="text-gray-400 mb-12">
                Complete this task now. No distractions, no other apps. Then come back and click below.
            </p>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-6">{error}</p>
            )}

            {/* Task Done button */}
            <button
                onClick={handleComplete}
                disabled={loading || !task}
                className="btn-primary disabled:opacity-50"
            >
                {loading ? '...' : 'Task Done ✓'}
            </button>
        </div>
    )
}
