/**
 * ROUTER PAGE
 * 
 * Black loading page that shows a spinner while server-side routing logic runs.
 * This page is the entry point after login - it determines where the user should go.
 * 
 * Shows: Black background with centered white loading spinner
 * Does: Server-side redirect based on HARD RULES (see lib/routing.ts)
 */

import { checkRouting } from '@/lib/routing'
import { redirect } from 'next/navigation'

export default async function RouterPage() {
    // Run routing logic server-side
    const result = await checkRouting()

    // If we have a redirect target, go there
    if (result.redirect) {
        redirect(result.redirect)
    }

    // No redirect needed - show loading (this rarely happens, fallback)
    // The user should have been redirected above
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    )
}
