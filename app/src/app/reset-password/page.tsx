/**
 * RESET PASSWORD PAGE
 * 
 * Standardized Flow:
 * 1. User clicks email link -> hits /auth/confirm
 * 2. /auth/confirm verifies token and sets session cookie
 * 3. /auth/confirm redirects here (/reset-password)
 * 4. This page detects the active session and allows password update
 * 
 * Update: Only redirect to login if we timeout while verifying (e.g. infinite spinner).
 */

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [ready, setReady] = useState(false)

    // Debug info
    const [debugInfo, setDebugInfo] = useState<string[]>([])

    const supabase = createClient()
    const router = useRouter()

    const addDebug = (msg: string) => {
        console.log('[DEBUG]', msg)
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
    }

    useEffect(() => {
        let mounted = true

        const checkSession = async () => {
            addDebug('Checking session...')

            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                addDebug(`Session error: ${error.message}`)
            }

            if (session) {
                addDebug(`Active session: ${session.user.email}`)
                if (mounted) setReady(true)
            } else {
                addDebug('No active session found immediately')
                // Do NOT redirect immediately. Wait for auth state change or timeout.
            }
        }

        checkSession()

        // Also listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            addDebug(`Auth event: ${event}`)
            if (session && mounted) {
                setReady(true)
            }
        })

        // Timeout: Only redirect if we are STILL stuck loading after 4 seconds
        const timeout = setTimeout(() => {
            if (mounted && !ready) {
                addDebug('Timeout checking session - Redirecting to login')
                router.replace('/login')
            }
        }, 4000)

        return () => {
            mounted = false
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [router, ready]) // Added ready dependency to ensure we check fresh state

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            addDebug(`Update error: ${error.message}`)
            setError(error.message)
            setLoading(false)
        } else {
            addDebug('Password updated successfully!')
            await supabase.auth.signOut()
            setSuccess(true)
            setLoading(false)
        }
    }

    if (!ready && !success) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <div className="text-gray-500 text-sm">Verifying secure access...</div>
                <div className="p-3 bg-gray-900 rounded text-xs text-gray-400 max-w-sm max-h-32 overflow-y-auto hidden">
                    {debugInfo.map((d, i) => <div key={i}>{d}</div>)}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        {success ? 'Password Updated!' : 'Set New Password'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {success
                            ? 'You can now return to the app and log in.'
                            : 'Enter your new password below'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 border border-red-500/30 rounded-lg bg-red-500/10">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <p className="text-green-400 mb-6">✓ Password changed successfully!</p>
                        <p className="text-gray-400 text-sm mb-4">
                            Open M246 from your homescreen and log in with your new password.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-minimal"
                            placeholder="New password"
                            required
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-minimal"
                            placeholder="Confirm password"
                            required
                        />
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
