/**
 * GLOBAL SERVER ACTIONS
 * 
 * Shared actions used across multiple layouts.
 */

'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Log when user opens the help popup (before they pick an option)
 */
export async function logHelpPopupOpen(pageKey: string) {
    console.log('logHelpPopupOpen called with:', pageKey)
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        console.log('No user found, skipping log')
        return
    }

    // Log as help_click event with the page
    const { error } = await supabase.rpc('log_page_event', {
        p_user_id: user.id,
        p_page_key: pageKey,
        p_event_type: 'help_click',
        p_daily_log_id: null,
        p_metadata: {}
    })

    if (error) {
        console.error('Error logging help click:', error)
    } else {
        console.log('Help click logged successfully')
    }
}
