/**
 * FEATURE PLACEHOLDER PAGE - Scientific Background
 * 
 * Coming soon page with suggestion form
 * Feature: Scientific Background of the M246-Program
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveFeatureSuggestion, getUserName } from '../../actions'
import { useEffect } from 'react'

export default function ScientificBackgroundPage() {
    const router = useRouter()
    const [suggestion, setSuggestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userName, setUserName] = useState<string | null>(null)

    useEffect(() => {
        async function fetchName() {
            const name = await getUserName()
            setUserName(name)
        }
        fetchName()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!suggestion.trim()) return

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.set('featureName', 'Scientific Background of the M246-Program')
        formData.set('suggestion', suggestion.trim())

        const result = await saveFeatureSuggestion(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSubmitted(true)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                {/* Back button */}
                <button
                    onClick={() => router.push('/morning/22')}
                    className="text-gray-500 hover:text-white text-sm mb-8 block"
                >
                    ← Back to summary
                </button>

                {/* Heading */}
                <h1 className="text-2xl font-semibold text-white mb-4">
                    Scientific Background of the M246-Program
                </h1>

                <p className="text-gray-400 mb-8">
                    Coming soon
                </p>

                {/* Suggestion form or confirmation */}
                {submitted ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                        <p className="text-green-400">
                            Thank you for your suggestion!<br />
                            We'll use it to build this feature.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p className="text-gray-400 text-sm mb-4">
                            This feature is in development.<br />
                            {userName ? `${userName}, in your opinion, what would be helpful to see/have here?` : 'What would be helpful to see/have here?'}<br />
                            Suggest it - and see it implemented!
                        </p>

                        <textarea
                            value={suggestion}
                            onChange={(e) => setSuggestion(e.target.value)}
                            placeholder="Your suggestion..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none mb-4"
                            rows={4}
                        />

                        {error && (
                            <p className="text-red-400 text-sm mb-4">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !suggestion.trim()}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? '...' : 'Submit Suggestion'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
