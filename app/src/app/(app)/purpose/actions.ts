'use server'

import { createClient } from '@/utils/supabase/server'

export type FocusPoint = {
    id: string
    focus_text: string
    entry_batch_id: string
    completed_at: string | null
    created_at: string
}

/**
 * Get the current user's focus points from their LATEST entry batch only
 * (most recent entry_batch_id based on created_at)
 */
export async function getUserFocusPoints(): Promise<FocusPoint[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // First, get the latest entry_batch_id for this user
    const { data: latestBatch } = await supabase
        .from('user_focus_points')
        .select('entry_batch_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!latestBatch?.entry_batch_id) return []

    // Then fetch all points from that batch
    const { data, error } = await supabase
        .from('user_focus_points')
        .select('id, focus_text, entry_batch_id, completed_at, created_at')
        .eq('user_id', user.id)
        .eq('entry_batch_id', latestBatch.entry_batch_id)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching focus points:', error)
        return []
    }

    return data || []
}

/**
 * Get user's name from their profile
 */
export async function getUserName(): Promise<string | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single()

    return data?.name || null
}

/**
 * Toggle a focus point's completion status
 * If not completed -> mark as completed
 * If completed -> mark as not completed (NULL)
 */
export async function toggleFocusPointComplete(
    focusPointId: string,
    currentlyCompleted: boolean
): Promise<{ success: boolean; newCompletedAt: string | null }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, newCompletedAt: null }

    const newValue = currentlyCompleted ? null : new Date().toISOString()

    const { error } = await supabase
        .from('user_focus_points')
        .update({ completed_at: newValue })
        .eq('id', focusPointId)
        .eq('user_id', user.id) // Security: ensure user owns this point

    if (error) {
        console.error('Error toggling focus point:', error)
        return { success: false, newCompletedAt: null }
    }

    return { success: true, newCompletedAt: newValue }
}

// ============================================================================
// SUCCESS METRIC QUESTIONS - Custom daily reflection questions
// ============================================================================

export type SuccessMetricQuestion = {
    id: string
    question: string
    position: number
    created_at: string
}

/**
 * Get user's custom success metric questions (max 3)
 */
export async function getSuccessMetricQuestions(): Promise<SuccessMetricQuestion[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('success_metric_questions')
        .select('id, question, position, created_at')
        .eq('user_id', user.id)
        .order('position', { ascending: true })

    if (error) {
        console.error('Error fetching success metrics:', error)
        return []
    }

    return data || []
}

/**
 * Save a success metric question (create or update)
 */
export async function saveSuccessMetricQuestion(
    questionId: string | null,
    questionText: string,
    position: number
): Promise<{ success: boolean; id?: string }> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    if (questionId) {
        // Update existing
        const { error } = await supabase
            .from('success_metric_questions')
            .update({ question: questionText })
            .eq('id', questionId)
            .eq('user_id', user.id)

        if (error) {
            console.error('Error updating success metric:', error)
            return { success: false }
        }
        return { success: true, id: questionId }
    } else {
        // Create new
        const { data, error } = await supabase
            .from('success_metric_questions')
            .insert({
                user_id: user.id,
                question: questionText,
                position
            })
            .select('id')
            .single()

        if (error) {
            console.error('Error creating success metric:', error)
            return { success: false }
        }
        return { success: true, id: data?.id }
    }
}

/**
 * Delete a success metric question
 */
export async function deleteSuccessMetricQuestion(questionId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
        .from('success_metric_questions')
        .delete()
        .eq('id', questionId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting success metric:', error)
        return false
    }

    return true
}

// ============================================================================
// DAILY LEARNINGS
// ============================================================================

export type DailyLearning = {
    id: string
    learning_text: string
    created_at: string
}

/**
 * Get all past daily learnings for the user
 */
export async function getAllLearnings(): Promise<DailyLearning[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('daily_learnings')
        .select('id, learning_text, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching learnings:', error)
        return []
    }

    return data || []
}
