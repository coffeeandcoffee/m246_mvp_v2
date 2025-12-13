import { login } from '@/app/auth/actions'
import Link from 'next/link'

export default async function LoginPage({
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
                    <h1 className="heading-lg mb-2">Welcome Back</h1>
                    <p className="text-muted">Sign in to continue</p>
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
                            className="input-text"
                            placeholder="Password"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        formAction={login}
                        className="btn-primary"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-muted text-sm">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-white underline hover:no-underline"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
