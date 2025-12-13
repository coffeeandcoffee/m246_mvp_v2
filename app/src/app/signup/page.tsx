import { signup } from '@/app/auth/actions'
import Link from 'next/link'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const params = await searchParams
    const error = params.error
    const message = params.message

    return (
        <div className="page-container">
            <div className="sequence-page">
                <div className="text-center">
                    <h1 className="heading-lg mb-2">Create Account</h1>
                    <p className="text-muted">Join the M246 program</p>
                </div>

                {error && (
                    <div className="error-box w-full">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-box w-full">
                        {message}
                    </div>
                )}

                <form className="w-full space-y-6">
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="input-text"
                            placeholder="Email"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="input-text"
                            placeholder="Password"
                            autoComplete="new-password"
                        />
                        <p className="text-muted text-xs mt-2 text-center">
                            Minimum 6 characters
                        </p>
                    </div>

                    <div>
                        <input
                            id="inviteCode"
                            name="inviteCode"
                            type="text"
                            required
                            className="input-text uppercase"
                            placeholder="Invite Code"
                            autoComplete="off"
                        />
                    </div>

                    <button
                        formAction={signup}
                        className="btn-primary"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-muted text-sm">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-white underline hover:no-underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
