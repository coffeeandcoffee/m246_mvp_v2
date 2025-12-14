/**
 * LOGIN PAGE - Elite Minimalist Design
 * 
 * Pure black background, white outline buttons, maximum simplicity.
 */

'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await login(formData)

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
                    <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
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
                            className="input-minimal"
                            placeholder="Password"
                        />
                    </div>

                    {/* Submit button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                {/* Link to signup */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-gray-400 underline underline-offset-2 hover:text-white">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
