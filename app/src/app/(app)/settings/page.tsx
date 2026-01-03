/**
 * SETTINGS PAGE
 * 
 * Simple settings page with logout functionality.
 */

import { signout } from '@/app/auth/actions'

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold text-white mb-8">
                    Settings
                </h1>

                {/* Logout link */}
                <form action={signout}>
                    <button
                        type="submit"
                        className="text-gray-500 underline hover:text-gray-400 transition-colors"
                    >
                        Log out
                    </button>
                </form>
            </div>
        </div>
    )
}
