'use server'

import { createClient } from '@/utils/supabase/server'
import { getQuarterInfo } from '@/lib/quarterlyQuestions'

export type QuarterlyReport = {
    id: string
    year: number
    quarter: number
    answers: Record<string, string>
    created_at: string
    updated_at: string
}

/**
 * Get a user's quarterly report for a specific year/quarter
 */
export async function getQuarterlyReport(year: number, quarter: number): Promise<QuarterlyReport | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('quarterly_reports')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('quarter', quarter)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching quarterly report:', error)
        return null
    }

    return data
}

/**
 * Save/update a user's quarterly report answers
 * Returns true if successful, false otherwise
 */
export async function saveQuarterlyReport(
    year: number,
    quarter: number,
    answers: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Check if still editable
    const quarterInfo = getQuarterInfo(year, quarter)
    if (!quarterInfo.isEditable) {
        return { success: false, error: 'This quarter is no longer editable' }
    }

    const { error } = await supabase
        .from('quarterly_reports')
        .upsert({
            user_id: user.id,
            year,
            quarter,
            answers,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id,year,quarter'
        })

    if (error) {
        console.error('Error saving quarterly report:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
