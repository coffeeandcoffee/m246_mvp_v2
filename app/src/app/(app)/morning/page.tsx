'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { SequencePage } from '@/components/sequences/SequencePage'
import { AudioPlayer } from '@/components/sequences/AudioPlayer'
import { TextInput } from '@/components/ui/TextInput'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { morningPages, FEATURE_LINKS } from '@/lib/sequences/morning'
import { getNextPageKey, getPageByKey } from '@/lib/sequences/types'

// Supabase storage URL for default audio
const DEFAULT_AUDIO_URL = 'https://fkwuvonuicokyxvdqxgq.supabase.co/storage/v1/object/public/audio/default/default_grounding_audio.mp3'

export default function MorningPage() {
    const router = useRouter()
    const [currentPageKey, setCurrentPageKey] = useState('v1-m-1')
    const [responses, setResponses] = useState<Record<string, string>>({})
    const [inputValue, setInputValue] = useState('')
    const [checkboxChecked, setCheckboxChecked] = useState(false)
    const [audioProgress, setAudioProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [dailyLogId, setDailyLogId] = useState<string | null>(null)
    const [needsBackfill, setNeedsBackfill] = useState(false)
    const [magicTask, setMagicTask] = useState('')

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

        // Get today's date
        const now = new Date()
        const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
        const dateStr = userLocalTime.toISOString().split('T')[0]

        // Get or create daily log
        const { data: logId } = await supabase.rpc('get_or_create_daily_log', {
            p_user_id: user.id,
            p_date: dateStr,
        })
        setDailyLogId(logId)

        // Check if yesterday's evening was completed
        const yesterday = new Date(userLocalTime)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        const { data: yesterdayLog } = await supabase
            .from('daily_logs')
            .select('id')
            .eq('user_id', user.id)
            .eq('log_date', yesterdayStr)
            .single()

        if (yesterdayLog) {
            const { data: eveningSeq } = await supabase
                .from('sequences')
                .select('id')
                .eq('key', 'evening')
                .single()

            if (eveningSeq) {
                const { data: eveningProgress } = await supabase
                    .from('sequence_progress')
                    .select('status')
                    .eq('user_id', user.id)
                    .eq('sequence_id', eveningSeq.id)
                    .eq('daily_log_id', yesterdayLog.id)
                    .single()

                setNeedsBackfill(eveningProgress?.status !== 'completed')
            }
        }

        // Get morning sequence
        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'morning')
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
            router.push('/app/waiting')
            return
        }

        if (progress?.current_page_key) {
            setCurrentPageKey(progress.current_page_key)
            if (progress.path_choices) {
                const choices = progress.path_choices as Record<string, string>
                setResponses(choices)
                if (choices.magic_task) {
                    setMagicTask(choices.magic_task)
                }
            }
        }

        setIsLoading(false)
    }

    const saveProgress = async (pageKey: string, newResponses: Record<string, string>) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'morning')
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

    const saveMetricResponse = async (metricKey: string, value: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: metric } = await supabase
            .from('metrics')
            .select('id, type')
            .eq('key', metricKey)
            .single()

        if (!metric) return

        const isTime = metric.type === 'time'
        await supabase
            .from('metric_responses')
            .upsert({
                user_id: user.id,
                daily_log_id: dailyLogId,
                metric_id: metric.id,
                value_text: isTime ? null : value,
                value_time: isTime ? value : null,
            }, {
                onConflict: 'user_id,daily_log_id,metric_id',
            })
    }

    const completeMorning = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'morning')
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

    const handleNext = async () => {
        const currentPage = getPageByKey(morningPages, currentPageKey)
        if (!currentPage) return

        // Save metric
        if (currentPage.metric && inputValue) {
            await saveMetricResponse(currentPage.metric, inputValue)
            if (currentPage.metric === 'magic_task') {
                setMagicTask(inputValue)
            }
        }

        // Update responses
        const newResponses = { ...responses }
        if (currentPage.metric) {
            newResponses[currentPage.metric] = inputValue
        }
        setResponses(newResponses)

        // Reset inputs
        setInputValue('')
        setCheckboxChecked(false)
        setAudioProgress(0)

        // Get next page
        let nextKey = getNextPageKey(morningPages, currentPageKey)

        // Handle backfill logic - skip v1-m-21 if not needed
        if (nextKey === 'v1-m-21' && !needsBackfill) {
            nextKey = 'v1-m-22'
        }

        // If on v1-m-21, redirect to evening for backfill
        if (currentPageKey === 'v1-m-21' && needsBackfill) {
            // TODO: Implement backfill flow
            nextKey = 'v1-m-22'
        }

        if (!nextKey || currentPageKey === 'v1-m-22') {
            await completeMorning()
            return
        }

        await saveProgress(nextKey, newResponses)
        setCurrentPageKey(nextKey)
    }

    const handleFeatureLinkClick = async (linkKey: string) => {
        // Log the click
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !dailyLogId) return

        // Get page for v1-m-22
        const { data: pageData } = await supabase
            .from('pages')
            .select('id')
            .eq('key', 'v1-m-22')
            .single()

        if (pageData) {
            await supabase.from('page_events').insert({
                user_id: user.id,
                daily_log_id: dailyLogId,
                page_id: pageData.id,
                event_type: 'link_click',
                metadata: { link_key: linkKey },
            })
        }

        // Navigate to feature page
        router.push(`/app/feature/${linkKey}`)
    }

    if (isLoading) {
        return (
            <div className="page-container">
                <p className="text-muted">Loading...</p>
            </div>
        )
    }

    const currentPage = getPageByKey(morningPages, currentPageKey)
    if (!currentPage) {
        return (
            <div className="page-container">
                <p className="text-muted">Page not found</p>
            </div>
        )
    }

    // Get dynamic text content
    const getDynamicText = () => {
        switch (currentPageKey) {
            case 'v1-m-1':
                return `${userName || 'there'}, you showed up. Well done.\n\nSTEP #1 = DONE.`
            case 'v1-m-4':
                return `${userName || 'there'} – Now we get your brain into the right state before listening to your Reality-Defining Audio.`
            case 'v1-m-13':
                return `${userName || 'there'} – well done.\n\nSTEP #2 = DONE.`
            case 'v1-m-15':
                return `2/3 – well done ${userName || 'there'}.\n\nOnly one step left to make this day a success.`
            case 'v1-m-16':
                return `${userName || 'there'} – What is the single most impactful Magic Task you need to take today to move towards your Dream?\n\nSeek silence and complete calmness, and your intuition will tell you the truth. Even when it is uncomfortable.\n\nObey to this truth, do your single Magic Task with obsessive focus, and you will succeed.`
            case 'v1-m-17':
                return `${magicTask || responses.magic_task || 'Your Magic Task'}\n\nNow, focus only on this task.\nCreate your best environment for focus.\nRemember not to drift or open other apps until this task is done.\nOnly then will you bear the fruits you desire.`
            case 'v1-m-18':
                return `3/3 – ${userName || 'there'} – truly amazing.\n\nHow does it feel to overcome doubt with execution, and have the most important thing done for today?\n\nEvery such day you open this app compounds to real progress over time towards your dream.\n\nSimply continue, and be patient. We are always there for you.`
            default:
                return currentPage.text
        }
    }

    // Render based on page type
    const isAudioPage = currentPageKey === 'v1-m-12'
    const isCheckboxPage = currentPageKey === 'v1-m-2'
    const isTextInputPage = currentPage.type === 'text-input'
    const isTimePickerPage = currentPage.type === 'time-picker'
    const isFinalPage = currentPageKey === 'v1-m-22'

    // Determine if button should be disabled
    let isDisabled = false
    if (isCheckboxPage && !checkboxChecked) isDisabled = true
    if (isTextInputPage && !inputValue) isDisabled = true
    if (isTimePickerPage && !inputValue) isDisabled = true
    if (isAudioPage && audioProgress < 80) isDisabled = true

    // Final page - show feature links
    if (isFinalPage) {
        return (
            <SequencePage pageId={currentPageKey}>
                <div className="text-body whitespace-pre-line mb-6">
                    Return here for your 5-min reflection at {responses.evening_reflection_time || '18:00'} when alarm rings.
                </div>

                <p className="text-muted">
                    Now you can relax a little bit. Take a break. You can listen to your audio again to gain energy, or simply do nothing.
                    <br /><br />
                    When you are ready to continue with the next most important task, go ahead.
                </p>

                <div className="feature-links mt-8 w-full">
                    {FEATURE_LINKS.map((link) => (
                        <button
                            key={link.key}
                            className="feature-link"
                            onClick={() => handleFeatureLinkClick(link.key)}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-[#222] w-full">
                    <h2 className="heading-sm mb-4">Reality-Defining Audio</h2>
                    <p className="text-muted mb-4">Listen anytime, to gain clarity and confidence.</p>
                    <AudioPlayer
                        audioUrl={DEFAULT_AUDIO_URL}
                        onProgress={() => { }}
                    />
                </div>

                <Button className="mt-8" onClick={completeMorning}>
                    I&apos;m Done for Now
                </Button>
            </SequencePage>
        )
    }

    return (
        <SequencePage
            pageId={currentPageKey}
            heading={currentPage.heading}
            buttonText={currentPage.buttonText}
            onNext={handleNext}
            disabled={isDisabled}
        >
            <p className="text-body whitespace-pre-line">
                {getDynamicText()}
            </p>

            {currentPage.subtext && (
                <p className="text-muted mt-4">
                    {currentPage.subtext}
                </p>
            )}

            {isCheckboxPage && (
                <div className="mt-8">
                    <Checkbox
                        label={currentPage.text}
                        checked={checkboxChecked}
                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                </div>
            )}

            {isTextInputPage && (
                <div className="mt-8">
                    <TextInput
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type here..."
                        autoFocus
                    />
                </div>
            )}

            {isTimePickerPage && (
                <div className="mt-8">
                    <input
                        type="time"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="input-text"
                    />
                </div>
            )}

            {isAudioPage && (
                <div className="mt-8">
                    <AudioPlayer
                        audioUrl={DEFAULT_AUDIO_URL}
                        onProgress={setAudioProgress}
                        unlockThreshold={80}
                    />
                    {audioProgress < 80 && (
                        <p className="text-muted text-sm mt-4 text-center">
                            Listen to at least 80% to continue ({Math.round(audioProgress)}%)
                        </p>
                    )}
                </div>
            )}
        </SequencePage>
    )
}
