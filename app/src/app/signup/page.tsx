/**
 * SIGNUP PAGE - Elite Minimalist Design
 * 
 * Pure black background, white outline buttons, maximum simplicity.
 */

'use client'

import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await signup(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            {/* Container */}
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold text-white mb-2">Join M246</h1>
                    <p className="text-gray-500 text-sm">Create your account</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 border border-red-500/30 rounded-lg bg-red-500/10">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form action={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="input-minimal"
                            placeholder="Email address"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="input-minimal"
                            placeholder="Password"
                        />
                    </div>

                    {/* Invite code */}
                    <div>
                        <input
                            id="inviteCode"
                            name="inviteCode"
                            type="text"
                            required
                            className="input-minimal uppercase"
                            placeholder="Invite code"
                        />
                        <p className="mt-2 text-xs text-gray-600">
                            You need an invite code to join
                        </p>
                    </div>

                    {/* Submit button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>

                {/* Link to login */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gray-400 underline underline-offset-2 hover:text-white">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
