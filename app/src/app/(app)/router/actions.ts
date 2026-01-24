'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Get completed tasks for today
 */
export async function getCompletedTasks(): Promise<string[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('daily_tasks')
        .select('task_key')
        .eq('user_id', user.id)
        .eq('task_date', today)

    if (error) {
        console.error('Error fetching completed tasks:', error)
        return []
    }

    return data.map(row => row.task_key)
}

/**
 * Mark a task as complete for today
 */
export async function markTaskComplete(taskKey: string): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
        .from('daily_tasks')
        .upsert({
            user_id: user.id,
            task_date: today,
            task_key: taskKey
        }, {
            onConflict: 'user_id,task_date,task_key'
        })

    if (error) {
        console.error('Error marking task complete:', error)
        return false
    }

    return true
}

/**
 * Save the user's "first victory" (nervous task) response and mark complete
 */
export async function saveFirstVictory(taskText: string): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const today = new Date().toISOString().split('T')[0]

    // Mark task as complete in daily_tasks
    const { error } = await supabase
        .from('daily_tasks')
        .upsert({
            user_id: user.id,
            task_date: today,
            task_key: 'first_victory'
        }, {
            onConflict: 'user_id,task_date,task_key'
        })

    if (error) {
        console.error('Error saving first victory:', error)
        return false
    }

    return true
}

// ============================================================================
// SUCCESS METRICS FOR REFLECTION
// ============================================================================

export type SuccessMetricForRating = {
    id: string
    question: string
    position: number
}

/**
 * Get user's success metric questions for rating
 */
export async function getSuccessMetricsForRating(): Promise<SuccessMetricForRating[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('success_metric_questions')
        .select('id, question, position')
        .eq('user_id', user.id)
        .order('position', { ascending: true })

    if (error) {
        console.error('Error fetching success metrics:', error)
        return []
    }

    return data || []
}

/**
 * Save all reflection data: metric ratings + daily learning
 */
export async function saveReflectionData(
    ratings: Record<string, number>,
    learningText: string
): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const today = new Date().toISOString().split('T')[0]

    // Get or create daily log
    const { data: dailyLogId, error: logError } = await supabase.rpc('get_or_create_daily_log', {
        p_user_id: user.id,
        p_date: today
    })

    if (logError) {
        console.error('Error getting daily log:', logError)
        return false
    }

    // Save each metric rating using custom RPC that auto-creates metrics
    for (const [questionId, rating] of Object.entries(ratings)) {
        const { error: rpcError } = await supabase.rpc('save_custom_metric_response', {
            p_user_id: user.id,
            p_question_id: questionId,
            p_daily_log_id: dailyLogId,
            p_rating: rating
        })

        if (rpcError) {
            console.error('Error saving metric rating:', rpcError)
        }
    }

    // Save daily learning - use insert with manual conflict check
    if (learningText.trim()) {
        // Check if entry exists for today
        const { data: existing } = await supabase
            .from('daily_learnings')
            .select('id')
            .eq('user_id', user.id)
            .eq('daily_log_id', dailyLogId)
            .single()

        if (existing) {
            // Update existing
            const { error: updateError } = await supabase
                .from('daily_learnings')
                .update({ learning_text: learningText.trim() })
                .eq('id', existing.id)

            if (updateError) {
                console.error('Error updating daily learning:', updateError)
            }
        } else {
            // Insert new
            const { error: insertError } = await supabase
                .from('daily_learnings')
                .insert({
                    user_id: user.id,
                    daily_log_id: dailyLogId,
                    learning_text: learningText.trim()
                })

            if (insertError) {
                console.error('Error inserting daily learning:', insertError)
            }
        }
    }

    return true
}
