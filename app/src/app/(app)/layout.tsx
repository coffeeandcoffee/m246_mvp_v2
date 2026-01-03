/**
 * APP LAYOUT (AUTHENTICATED)
 * 
 * Wraps authenticated pages with the bottom TabBar.
 * The TabBar shows ONLY for authenticated users.
 * 
 * Authentication check happens server-side - if not authenticated,
 * redirects to /login.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import TabBar from '@/components/TabBar'
import HelpButton from '@/components/HelpButton'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check authentication server-side
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    // If not authenticated, redirect to login
    if (error || !user) {
        redirect('/login')
    }

    return (
        <>
            {/* Global help button - fixed top-right */}
            <HelpButton />

            {/* Main content - add padding at bottom for TabBar */}
            <div className="pb-16">
                {children}
            </div>

            {/* Bottom Tab Bar - only shown for authenticated users */}
            <TabBar />
        </>
    )
}
