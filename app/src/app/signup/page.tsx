/**
 * SIGNUP PAGE
 * 
 * This is a "Client Component" (marked with 'use client') because:
 * - It needs to show error messages that can change (useState)
 * - It handles form submissions interactively
 * 
 * Client components run in the browser AND on the server (for initial render).
 */

'use client'

import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
    // State to store error messages from the server
    const [error, setError] = useState<string | null>(null)
    // State to show loading spinner during form submission
    const [loading, setLoading] = useState(false)

    // This function handles form submission
    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // Call the server action
        const result = await signup(formData)

        // If there's an error, display it (otherwise we'd have redirected)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Card container */}
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Join M246</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                {/* Form card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    {/* Error message - shown when something goes wrong */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* 
                      The form uses the action attribute to call our server action.
                      When submitted, handleSubmit is called, which then calls signup().
                    */}
                    <form action={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Invite code field - THE KEY ADDITION! */}
                        <div>
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-300 mb-2">
                                Invite Code
                            </label>
                            <input
                                id="inviteCode"
                                name="inviteCode"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all uppercase"
                                placeholder="Enter your invite code"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                You need an invite code to join
                            </p>
                        </div>

                        {/* Submit button with loading state */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Link to login page */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
