'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { SequencePage } from '@/components/sequences/SequencePage'
import { TextInput } from '@/components/ui/TextInput'
import { Button } from '@/components/ui/Button'
import { onboardingPages } from '@/lib/sequences/onboarding'
import { getNextPageKey, getPageByKey } from '@/lib/sequences/types'

export default function OnboardingPage() {
    const router = useRouter()
    const [currentPageKey, setCurrentPageKey] = useState('v1-o-1')
    const [responses, setResponses] = useState<Record<string, string>>({})
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const [detectedTimezone, setDetectedTimezone] = useState('')

    useEffect(() => {
        // Detect timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        setDetectedTimezone(tz)
        setResponses(prev => ({ ...prev, user_timezone: tz }))

        loadProgress()
    }, [])

    const loadProgress = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        // Get onboarding sequence
        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'onboarding')
            .single()

        if (!seq) {
            setIsLoading(false)
            return
        }

        // Get existing progress
        const { data: progress } = await supabase
            .from('sequence_progress')
            .select('current_page_key, path_choices')
            .eq('user_id', user.id)
            .eq('sequence_id', seq.id)
            .is('daily_log_id', null)
            .single()

        if (progress?.current_page_key) {
            setCurrentPageKey(progress.current_page_key)
            if (progress.path_choices) {
                setResponses(progress.path_choices as Record<string, string>)
            }
        }

        // Load existing metric responses
        const { data: metrics } = await supabase
            .from('metric_responses')
            .select('metrics(key), value_text')
            .eq('user_id', user.id)
            .is('daily_log_id', null)

        if (metrics) {
            const existingResponses: Record<string, string> = {}
            for (const m of metrics) {
                // m.metrics can be object or array depending on Supabase version
                const metricData = m.metrics as { key: string } | { key: string }[] | null
                if (metricData && m.value_text) {
                    const key = Array.isArray(metricData) ? metricData[0]?.key : metricData.key
                    if (key) {
                        existingResponses[key] = m.value_text
                    }
                }
            }
            if (existingResponses.user_name) {
                setUserName(existingResponses.user_name)
            }
            setResponses(prev => ({ ...prev, ...existingResponses }))
        }

        setIsLoading(false)
    }

    const saveProgress = async (pageKey: string, newResponses: Record<string, string>) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get sequence ID
        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'onboarding')
            .single()

        if (!seq) return

        // Upsert sequence progress
        await supabase
            .from('sequence_progress')
            .upsert({
                user_id: user.id,
                sequence_id: seq.id,
                current_page_key: pageKey,
                path_choices: newResponses,
                status: 'in_progress',
                started_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,sequence_id',
            })
    }

    const saveMetricResponse = async (metricKey: string, value: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get metric ID
        const { data: metric } = await supabase
            .from('metrics')
            .select('id')
            .eq('key', metricKey)
            .single()

        if (!metric) return

        await supabase
            .from('metric_responses')
            .upsert({
                user_id: user.id,
                metric_id: metric.id,
                value_text: value,
            }, {
                onConflict: 'user_id,metric_id',
            })

        // Also update user_profiles for name and timezone
        if (metricKey === 'user_name') {
            await supabase
                .from('user_profiles')
                .update({ name: value })
                .eq('user_id', user.id)
            setUserName(value)
        } else if (metricKey === 'user_timezone') {
            await supabase
                .from('user_profiles')
                .update({ timezone: value })
                .eq('user_id', user.id)
        }
    }

    const completeOnboarding = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Mark onboarding as complete
        await supabase
            .from('user_profiles')
            .update({ onboarded: true })
            .eq('user_id', user.id)

        // Update sequence progress
        const { data: seq } = await supabase
            .from('sequences')
            .select('id')
            .eq('key', 'onboarding')
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
        }

        // Redirect to evening (first time after onboarding)
        router.push('/app/evening')
    }

    const handleNext = async (response?: string) => {
        const currentPage = getPageByKey(onboardingPages, currentPageKey)
        if (!currentPage) return

        // Save metric if applicable
        if (currentPage.metric && (inputValue || response)) {
            await saveMetricResponse(currentPage.metric, inputValue || response || '')
        }

        // Update responses
        const newResponses = { ...responses }
        if (currentPage.metric) {
            newResponses[currentPage.metric] = inputValue || response || ''
        }
        setResponses(newResponses)

        // Get next page
        const nextKey = getNextPageKey(onboardingPages, currentPageKey, response)

        if (!nextKey) {
            // End of onboarding
            await completeOnboarding()
            return
        }

        // Skip pages that shouldn't show
        let targetKey = nextKey
        let targetPage = getPageByKey(onboardingPages, targetKey)
        while (targetPage?.showIf && !targetPage.showIf(newResponses)) {
            const skip = getNextPageKey(onboardingPages, targetKey)
            if (!skip) {
                await completeOnboarding()
                return
            }
            targetKey = skip
            targetPage = getPageByKey(onboardingPages, targetKey)
        }

        // Save progress and move to next
        await saveProgress(targetKey, newResponses)
        setCurrentPageKey(targetKey)
        setInputValue('')
    }

    if (isLoading) {
        return (
            <div className="page-container">
                <p className="text-muted">Loading...</p>
            </div>
        )
    }

    const currentPage = getPageByKey(onboardingPages, currentPageKey)
    if (!currentPage) {
        return (
            <div className="page-container">
                <p className="text-muted">Page not found</p>
            </div>
        )
    }

    // Render dynamic text
    const renderText = (text: string) => {
        return text
            .replace(/NAME/g, userName || 'there')
            .replace(/\[DATE\]/g, responses.last_efd_date || '')
    }

    // Dynamic v1-o-11 text
    if (currentPageKey === 'v1-o-11' && responses.last_efd_date) {
        currentPage.text = `You had your last execution flow day on ${responses.last_efd_date}.\n\nLets try to get it up to 5 Execution flow days in the next 30 days.\nShall we?`
    }

    return (
        <SequencePage
            pageId={currentPageKey}
            heading={currentPage.heading}
            buttonText={currentPage.type === 'choice' ? undefined : currentPage.buttonText}
            onNext={currentPage.type === 'choice' ? undefined : () => handleNext()}
            disabled={currentPage.type === 'text-input' && !inputValue}
        >
            <p className="text-body whitespace-pre-line">
                {renderText(currentPage.text)}
            </p>

            {currentPage.subtext && (
                <p className="text-muted mt-4">
                    {renderText(currentPage.subtext)}
                </p>
            )}

            {currentPage.type === 'text-input' && (
                <div className="mt-8">
                    <TextInput
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type here..."
                        autoFocus
                    />
                </div>
            )}

            {currentPage.type === 'timezone' && (
                <div className="mt-8">
                    <p className="text-body mb-4">{detectedTimezone}</p>
                    <TextInput
                        value={inputValue || detectedTimezone}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Your timezone..."
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
                        max={new Date().toISOString().split('T')[0]}
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
