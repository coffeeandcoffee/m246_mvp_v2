'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { SequencePage } from '@/components/sequences/SequencePage'
import { Button } from '@/components/ui/Button'
import { ScaleRating } from '@/components/ui/ScaleRating'
import { eveningPages } from '@/lib/sequences/evening'
import { getNextPageKey, getPageByKey } from '@/lib/sequences/types'

export default function EveningPage() {
    const router = useRouter()
    const [currentPageKey, setCurrentPageKey] = useState('v1-e-1')
    const [responses, setResponses] = useState<Record<string, string | number>>({})
    const [scaleValue, setScaleValue] = useState<number | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [dailyLogId, setDailyLogId] = useState<string | null>(null)

    useEffect(() => {
        loadProgress()
    }, [])

    const loadProgress = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('name, timezone')
            .eq('user_id', user.id)
            .single()

        setUserName(profile?.name || '')
        const timezone = profile?.timezone || 'UTC'

        // Get/create daily log for today (accounting for night owl)
        const now = new Date()
        const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
        const hour = userLocalTime.getHours()
        const isNightOwl = hour < 3
        const effectiveDate = isNightOwl
            ? new Date(userLocalTime.getTime() - 24 * 60 * 60 * 1000)
            : userLocalTime
        const dateStr = effectiveDate.toISOString().split('T')[0]

        // Get or create daily log
        const { data: logId } = await supabase.rpc('get_or_create_daily_log', {
            p_user_id: user.id,
            p_date: dateStr,
        })
        setDailyLogId(logId)

        // Get evening sequence
        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'evening')
            .single()

        if (!seq || !logId) {
            setIsLoading(false)
            return
        }

        // Get existing progress
        const { data: progress } = await supabase
            .from('sequence_progress')
            .select('current_page_key, path_choices, status')
            .eq('user_id', user.id)
            .eq('sequence_id', seq.id)
            .eq('daily_log_id', logId)
            .single()

        if (progress?.status === 'completed') {
            // Already completed today
            router.push('/app/waiting')
            return
        }

        if (progress?.current_page_key) {
            setCurrentPageKey(progress.current_page_key)
            if (progress.path_choices) {
                setResponses(progress.path_choices as Record<string, string | number>)
            }
        }

        setIsLoading(false)
    }

    const saveProgress = async (pageKey: string, newResponses: Record<string, string | number>) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'evening')
            .single()

        if (!seq) return

        await supabase
            .from('sequence_progress')
            .upsert({
                user_id: user.id,
                sequence_id: seq.id,
                daily_log_id: dailyLogId,
                current_page_key: pageKey,
                path_choices: newResponses,
                status: 'in_progress',
                started_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,sequence_id,daily_log_id',
            })
    }

    const saveMetricResponse = async (metricKey: string, value: string | number) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: metric } = await supabase
            .from('metrics')
            .select('id, type')
            .eq('key', metricKey)
            .single()

        if (!metric) return

        const isScale = metric.type === 'scale_1_10'
        await supabase
            .from('metric_responses')
            .upsert({
                user_id: user.id,
                daily_log_id: dailyLogId,
                metric_id: metric.id,
                value_text: isScale ? null : String(value),
                value_int: isScale ? Number(value) : null,
            }, {
                onConflict: 'user_id,daily_log_id,metric_id',
            })
    }

    const completeEvening = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'evening')
            .single()

        if (seq) {
            await supabase
                .from('sequence_progress')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .eq('sequence_id', seq.id)
                .eq('daily_log_id', dailyLogId)
        }

        router.push('/app/waiting')
    }

    const handleNext = async (response?: string | number) => {
        const currentPage = getPageByKey(eveningPages, currentPageKey)
        if (!currentPage) return

        // Save metric
        if (currentPage.metric) {
            const val = scaleValue ?? response ?? inputValue
            if (val !== null && val !== undefined && val !== '') {
                await saveMetricResponse(currentPage.metric, val)
            }
        }

        // Update responses
        const newResponses = { ...responses }
        if (currentPage.metric) {
            newResponses[currentPage.metric] = scaleValue ?? response ?? inputValue ?? ''
        }
        if (response && currentPage.type === 'choice') {
            newResponses[`${currentPageKey}_choice`] = response
            // Special handling for committed_tomorrow
            if (currentPageKey === 'v1-e-2') {
                newResponses.committed_tomorrow = response
            }
        }
        setResponses(newResponses)

        // Reset inputs
        setScaleValue(null)
        setInputValue('')

        // Get next page
        const nextKey = getNextPageKey(eveningPages, currentPageKey, String(response))

        if (!nextKey) {
            await completeEvening()
            return
        }

        // Skip pages that shouldn't show
        let targetKey = nextKey
        let targetPage = getPageByKey(eveningPages, targetKey)
        while (targetPage?.showIf && !targetPage.showIf(newResponses)) {
            const skip = getNextPageKey(eveningPages, targetKey)
            if (!skip) {
                await completeEvening()
                return
            }
            targetKey = skip
            targetPage = getPageByKey(eveningPages, targetKey)
        }

        await saveProgress(targetKey, newResponses)
        setCurrentPageKey(targetKey)
    }

    if (isLoading) {
        return (
            <div className="page-container">
                <p className="text-muted">Loading...</p>
            </div>
        )
    }

    const currentPage = getPageByKey(eveningPages, currentPageKey)
    if (!currentPage) {
        return (
            <div className="page-container">
                <p className="text-muted">Page not found</p>
            </div>
        )
    }

    // Dynamic text replacements
    const renderText = (text: string) => {
        let result = text.replace(/NAME/g, userName || 'there')

        // Dynamic return date
        if (responses.return_date) {
            const date = new Date(String(responses.return_date))
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' })
            result = result.replace(/\[DATE\]/g, `${weekday}, ${responses.return_date}`)
        } else {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const weekday = tomorrow.toLocaleDateString('en-US', { weekday: 'long' })
            result = result.replace(/\[DATE\]/g, weekday)
        }

        return result
    }

    // Special handling for final page
    if (currentPageKey === 'v1-e-14') {
        const returnDate = responses.return_date || (() => {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            return tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
        })()
        currentPage.text = `Great job ${userName || 'there'}.\n\nSee you ${returnDate} morning.`
    }

    // Dynamic v1-e-6 text
    if (currentPageKey === 'v1-e-6') {
        const returnDate = responses.return_date || (() => {
            const dayAfter = new Date()
            dayAfter.setDate(dayAfter.getDate() + 2)
            return dayAfter.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
        })()
        currentPage.text = `Will you commit to open this app ${returnDate} morning right after waking up - before opening any other app?`
    }

    const isScalePage = currentPage.type === 'scale'
    const needsScaleValue = isScalePage && scaleValue === null

    return (
        <SequencePage
            pageId={currentPageKey}
            heading={currentPage.heading}
            buttonText={currentPage.type === 'choice' ? undefined : currentPage.buttonText}
            onNext={currentPage.type === 'choice' ? undefined : () => handleNext(scaleValue ?? undefined)}
            disabled={needsScaleValue || (currentPage.type === 'date-picker' && !inputValue)}
        >
            <p className="text-body whitespace-pre-line">
                {renderText(currentPage.text)}
            </p>

            {currentPage.subtext && (
                <p className="text-muted mt-4">
                    {renderText(currentPage.subtext)}
                </p>
            )}

            {isScalePage && (
                <div className="mt-8">
                    <ScaleRating
                        value={scaleValue}
                        onChange={setScaleValue}
                        maxLabel={currentPage.maxLabel}
                    />
                </div>
            )}

            {currentPage.type === 'date-picker' && (
                <div className="mt-8">
                    <input
                        type="date"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="input-text"
                        min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    />
                </div>
            )}

            {currentPage.type === 'choice' && currentPage.choices && (
                <div className="mt-8 space-y-4 w-full">
                    {currentPage.choices.map((choice) => (
                        <Button
                            key={choice.value}
                            onClick={() => handleNext(choice.value)}
                        >
                            {choice.label}
                        </Button>
                    ))}
                </div>
            )}
        </SequencePage>
    )
}
