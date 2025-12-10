import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-white">Dashboard</h1>
                        <form>
                            <button
                                formAction={signout}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome!</h2>

                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                            <p className="text-white">{user.email}</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">User ID</h3>
                            <p className="text-white font-mono text-sm">{user.id}</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Last Sign In</h3>
                            <p className="text-white">
                                {user.last_sign_in_at
                                    ? new Date(user.last_sign_in_at).toLocaleString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Profile</h3>
                        <p className="text-gray-300 text-sm">Manage your account settings and preferences</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
                        <p className="text-gray-300 text-sm">Update your password and security settings</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Activity</h3>
                        <p className="text-gray-300 text-sm">View your recent activity and logs</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
