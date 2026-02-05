/**
 * LOGIN PAGE - Elite Minimalist Design
 * 
 * Pure black background, white outline buttons, maximum simplicity.
 * Uses standard resetPasswordForEmail flow to trigger the "Reset Password" email template.
 * Includes PWA detection to warn users against resetting inside PWA WebViews.
 */

'use client'

import { login } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [resetSent, setResetSent] = useState(false)
    const [resetLoading, setResetLoading] = useState(false)

    // PWA Modal State
    const [showPWAModal, setShowPWAModal] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Use resetPasswordForEmail (Standard Recovery)
    // This triggers the specific "Reset Password" email template
    async function handleReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setResetLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        if (!email) {
            setError('Email is required')
            setResetLoading(false)
            return
        }

        const supabase = createClient()

        // Explicitly point to the reset-password page
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://member.m246.org/reset-password',
        })

        if (error) {
            setError(error.message)
            setResetLoading(false)
        } else {
            setResetSent(true)
            setResetLoading(false)
        }
    }

    const handleForgotClick = () => {
        // Detect PWA mode (standalone)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true

        if (isStandalone) {
            setShowPWAModal(true)
        } else {
            setShowReset(true)
        }
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText('https://member.m246.org/login')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            // Fallback if clipboard fails (rare)
            const input = document.createElement('input')
            input.value = 'https://member.m246.org/login'
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">

            {/* PWA Warning Modal */}
            {showPWAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm border border-gray-800 bg-black p-6 rounded-xl shadow-2xl">
                        <h3 className="text-lg font-medium text-white mb-2">Browser Required</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Apple restricts password resets inside apps. Please open this link in <strong>Safari</strong> or <strong>Chrome</strong> to reset your password.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={copyLink}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                            >
                                {copied ? '✓ Copied!' : 'Copy Link'}
                            </button>

                            <div className="text-center text-xs text-gray-500">
                                Paste in Safari → Click "Forgot Password"
                            </div>

                            <button
                                onClick={() => setShowPWAModal(false)}
                                className="w-full text-gray-400 text-sm hover:text-white pt-2 underline underline-offset-4"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Container */}
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        {showReset ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {showReset
                            ? (resetSent ? 'Check your email for reset link' : 'Enter your email to receive a reset link')
                            : 'Sign in to your account'}
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 border border-red-500/30 rounded-lg bg-red-500/10">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Reset Password Form */}
                {showReset ? (
                    resetSent ? (
                        <div className="text-center">
                            <p className="text-green-400 mb-6">✓ Reset email sent!</p>
                            <button
                                onClick={() => { setShowReset(false); setResetSent(false); setError(null); }}
                                className="text-gray-400 underline underline-offset-2 hover:text-white text-sm"
                            >
                                Back to login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-minimal"
                                placeholder="Email address"
                            />
                            <div className="pt-2">
                                <button type="submit" disabled={resetLoading} className="btn-primary">
                                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowReset(false); setError(null); }}
                                    className="text-gray-400 underline underline-offset-2 hover:text-white text-sm"
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    )
                ) : (
                    /* Login Form */
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

                        {/* Forgot password link */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleForgotClick}
                                className="text-gray-500 text-sm hover:text-gray-400"
                            >
                                Forgot password?
                            </button>
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
                )}

                {/* Link to signup */}
                {!showReset && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-gray-400 underline underline-offset-2 hover:text-white">
                                Sign up
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
