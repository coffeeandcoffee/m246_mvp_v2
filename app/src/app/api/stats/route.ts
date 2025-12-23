/**
 * STATS API
 * 
 * Public stats endpoint for admin dashboard.
 * Returns JSON with key metrics: total users, daily active users,
 * feature requests, and help/stuck/error clicks by page.
 * 
 * Call: GET https://member.m246.org/api/stats
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS for admin queries
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    try {
        // 1. Total users
        const { count: totalUsers } = await supabaseAdmin
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })

        // 2. Daily active users (users with a daily_log today)
        const today = new Date().toISOString().split('T')[0]
        const { count: dailyActiveUsers } = await supabaseAdmin
            .from('daily_logs')
            .select('*', { count: 'exact', head: true })
            .eq('log_date', today)

        // 3. All feature requests
        const { data: featureRequests } = await supabaseAdmin
            .from('feature_suggestions')
            .select('id, link_key, suggestion_text, created_at')
            .order('created_at', { ascending: false })

        // 4. Help/stuck/error clicks by page, sorted by count
        const { data: helpClicks } = await supabaseAdmin
            .from('page_events')
            .select('page_key, event_type')
            .in('event_type', ['help_click', 'error_click', 'stuck_click'])

        // Aggregate help clicks by page
        const helpByPage: Record<string, number> = {}
        if (helpClicks) {
            for (const click of helpClicks) {
                const page = click.page_key || 'unknown'
                helpByPage[page] = (helpByPage[page] || 0) + 1
            }
        }

        // Sort by count descending
        const helpClicksSorted = Object.entries(helpByPage)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count)

        return NextResponse.json({
            generated_at: new Date().toISOString(),
            total_users: totalUsers || 0,
            daily_active_users: dailyActiveUsers || 0,
            feature_requests: featureRequests || [],
            help_clicks_by_page: helpClicksSorted
        })

    } catch (error) {
        console.error('Stats API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
