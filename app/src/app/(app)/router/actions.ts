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
