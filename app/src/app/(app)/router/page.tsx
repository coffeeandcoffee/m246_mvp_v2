/**
 * WHAT'S NEXT TODAY - INTERACTIVE TASK SELECTOR
 * 
 * Shows personalized greeting and daily action items in a vertical timeline.
 * - Tasks unlock progressively (mantra → first_victory → reflection)
 * - 80% audio progress unlocks next task
 * - Content panel below based on selected task
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getUserAudioUrl } from '@/lib/audio'
import { getCompletedTasks, markTaskComplete, saveFirstVictory, getSuccessMetricsForRating, saveReflectionData, type SuccessMetricForRating } from './actions'

type TaskKey = 'mantra' | 'first_victory' | 'reflection'

function CoffeeIcon({ active }: { active?: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
            />
        </svg>
    )
}

function VictoryIcon({ active }: { active?: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
        </svg>
    )
}

function ReflectionIcon({ active }: { active?: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    )
}

// Helper to format seconds as mm:ss
function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function WhatsNextTodayPage() {
    const [userName, setUserName] = useState<string>('')
    const [selectedTask, setSelectedTask] = useState<TaskKey>('mantra')
    const [completedTasks, setCompletedTasks] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // Audio state
    const audioRef = useRef<HTMLAudioElement>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioError, setAudioError] = useState<string | null>(null)
    const [audioDuration, setAudioDuration] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [mantraUnlocked, setMantraUnlocked] = useState(false)

    // First victory input state
    const [victoryTask, setVictoryTask] = useState('')
    const [victoryLockedIn, setVictoryLockedIn] = useState(false)
    const [submittingVictory, setSubmittingVictory] = useState(false)

    // Reflection state
    const [successMetrics, setSuccessMetrics] = useState<SuccessMetricForRating[]>([])
    const [metricRatings, setMetricRatings] = useState<Record<string, number>>({})
    const [dailyLearning, setDailyLearning] = useState('')
    const [submittingReflection, setSubmittingReflection] = useState(false)

    useEffect(() => {
        async function init() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch user name
                const { data } = await supabase
                    .from('user_profiles')
                    .select('name')
                    .eq('user_id', user.id)
                    .single()
                if (data?.name) {
                    setUserName(data.name)
                }

                // Fetch completed tasks
                const completed = await getCompletedTasks()
                setCompletedTasks(completed)

                // If mantra is complete, it's unlocked
                if (completed.includes('mantra')) {
                    setMantraUnlocked(true)
                }

                // Auto-select first incomplete task
                if (completed.includes('mantra') && !completed.includes('first_victory')) {
                    setSelectedTask('first_victory')
                } else if (completed.includes('first_victory') && !completed.includes('reflection')) {
                    setSelectedTask('reflection')
                }

                // Fetch audio
                const { signedUrl, error } = await getUserAudioUrl(supabase, user.id)
                if (error) {
                    setAudioError(error)
                } else {
                    setAudioUrl(signedUrl)
                }

                // Fetch success metrics for reflection
                const metrics = await getSuccessMetricsForRating()
                setSuccessMetrics(metrics)
            }
            setLoading(false)
        }
        init()
    }, [])

    // Check for 80% audio progress to unlock
    useEffect(() => {
        if (audioDuration > 0 && currentTime >= audioDuration * 0.8 && !mantraUnlocked) {
            setMantraUnlocked(true)
            // Mark mantra as complete when 80% reached
            markTaskComplete('mantra').then(success => {
                if (success && !completedTasks.includes('mantra')) {
                    setCompletedTasks(prev => [...prev, 'mantra'])
                }
            })
        }
    }, [currentTime, audioDuration, mantraUnlocked, completedTasks])

    // Audio handlers
    function handleLoadedMetadata() {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration)
        }
    }

    function handleTimeUpdate() {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    function handleAudioEnded() {
        setIsPlaying(false)
    }

    function togglePlay() {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play().catch(err => {
                    console.error('Play error:', err)
                    setAudioError('Could not play audio')
                })
            }
            setIsPlaying(!isPlaying)
        }
    }

    // Lock in first victory (step 1: show task, don't mark complete yet)
    function handleLockInVictory(e: React.FormEvent) {
        e.preventDefault()
        if (!victoryTask.trim()) return
        setVictoryLockedIn(true)
    }

    // Complete first victory (step 2: mark as done)
    async function handleCompleteVictory() {
        setSubmittingVictory(true)
        const success = await saveFirstVictory(victoryTask)
        if (success) {
            setCompletedTasks(prev => [...prev, 'first_victory'])
            setSelectedTask('reflection')
        }
        setSubmittingVictory(false)
    }

    // Mark reflection complete
    async function handleCompleteReflection() {
        const success = await markTaskComplete('reflection')
        if (success) {
            setCompletedTasks(prev => [...prev, 'reflection'])
        }
    }

    const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

    const isMantraComplete = completedTasks.includes('mantra')
    const isVictoryComplete = completedTasks.includes('first_victory')
    const isReflectionComplete = completedTasks.includes('reflection')

    // Unlock logic: second shows only when mantra at 80%+, third shows only when second complete
    const showSecondTask = mantraUnlocked || isMantraComplete
    const showThirdTask = isVictoryComplete

    if (loading) {
        return <div className="w-full max-w-md mx-auto px-6 pt-12 text-gray-500">Loading...</div>
    }

    return (
        <div className="w-full max-w-md mx-auto px-6 pt-12">
            {/* Greeting */}
            <h1 className="text-3xl font-semibold text-white mb-3 animate-fade-in-1">
                Hi {userName || '...'}.
            </h1>

            <p className="text-gray-500 text-sm mb-10 animate-fade-in-1">
                Press play and become invincible.
            </p>

            {/* Timeline */}
            <div className="animate-fade-in-2">
                {/* Timeline items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Item 1: Enjoy Your Morning Coffee - with inline player */}
                    <div
                        onClick={() => setSelectedTask('mantra')}
                        className={`relative w-full rounded-lg border transition-all duration-300 ease-out cursor-pointer ${selectedTask === 'mantra'
                            ? 'border-gray-500'
                            : 'border-transparent'
                            }`}
                    >
                        {/* Hidden audio element */}
                        {audioUrl && (
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                preload="metadata"
                                onLoadedMetadata={handleLoadedMetadata}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={handleAudioEnded}
                                onError={() => setAudioError('Could not load audio')}
                            />
                        )}

                        <div className="flex items-center gap-3 py-2 px-2">
                            {/* Play/Pause button - replaces coffee icon */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedTask('mantra')
                                    togglePlay()
                                }}
                                disabled={!audioUrl || audioDuration === 0}
                                className="w-6 h-6 flex items-center justify-center z-10 disabled:opacity-50"
                            >
                                {isMantraComplete && !isPlaying && currentTime === 0 ? (
                                    <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                ) : isPlaying ? (
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <rect x="6" y="4" width="4" height="16" />
                                        <rect x="14" y="4" width="4" height="16" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <polygon points="5,3 19,12 5,21" />
                                    </svg>
                                )}
                            </button>

                            <span className={`flex-1 transition-colors duration-300 ${selectedTask === 'mantra' ? 'text-white' : 'text-gray-600'}`}>
                                Enjoy your morning coffee
                            </span>

                            {isMantraComplete && (
                                <CheckIcon />
                            )}
                        </div>

                        {/* Expandable progress bar - shows when playing or has progress */}
                        {(isPlaying || currentTime > 0) && (
                            <div
                                className="flex items-center gap-3 px-2 pb-2"
                                style={{ animation: 'fadeIn 0.3s ease-out' }}
                            >
                                <span className="text-gray-500 text-xs w-10 text-right">{formatTime(currentTime)}</span>
                                <div
                                    className="flex-1 h-1 cursor-pointer flex items-center"
                                    onClick={(e) => {
                                        if (audioRef.current && audioDuration > 0) {
                                            const rect = e.currentTarget.getBoundingClientRect()
                                            const clickX = e.clientX - rect.left
                                            const percent = clickX / rect.width
                                            audioRef.current.currentTime = percent * audioDuration
                                        }
                                    }}
                                >
                                    <div className="w-full h-px bg-gray-700 relative">
                                        <div
                                            className="absolute left-0 top-0 h-px bg-white transition-all duration-300"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="text-gray-500 text-xs w-10">{formatTime(audioDuration)}</span>
                            </div>
                        )}

                        {audioError && (
                            <p className="text-red-400 text-xs px-2 pb-2">{audioError}</p>
                        )}
                    </div>

                    {/* Item 2: Today's First Victory - only shows after 80% audio */}
                    {showSecondTask && (
                        <button
                            onClick={() => setSelectedTask('first_victory')}
                            className={`flex items-center gap-3 relative w-full text-left py-2 px-2 rounded-lg border transition-all duration-300 ease-out ${selectedTask === 'first_victory'
                                ? 'border-gray-500'
                                : 'border-transparent'
                                }`}
                            style={{ animation: 'fadeIn 0.5s ease-out' }}
                        >
                            <div className="w-6 h-6 flex items-center justify-center z-10">
                                <VictoryIcon active={selectedTask === 'first_victory'} />
                            </div>
                            <span className={`flex-1 transition-colors duration-300 ${selectedTask === 'first_victory' ? 'text-white' : 'text-gray-600'}`}>
                                Become Fearless
                            </span>
                            {isVictoryComplete && (
                                <CheckIcon />
                            )}
                        </button>
                    )}

                    {/* Item 3: 60-Second Reflection - only shows after first victory */}
                    {showThirdTask && (
                        <button
                            onClick={() => setSelectedTask('reflection')}
                            className={`flex items-center gap-3 relative w-full text-left py-2 px-2 rounded-lg border transition-all duration-300 ease-out ${selectedTask === 'reflection'
                                ? 'border-gray-500'
                                : 'border-transparent'
                                }`}
                            style={{ animation: 'fadeIn 0.5s ease-out' }}
                        >
                            <div className="w-6 h-6 flex items-center justify-center z-10">
                                <ReflectionIcon active={selectedTask === 'reflection'} />
                            </div>
                            <span className={`flex-1 transition-colors duration-300 ${selectedTask === 'reflection' ? 'text-white' : 'text-gray-600'}`}>
                                60-Second Reflection
                            </span>
                            {isReflectionComplete && (
                                <CheckIcon />
                            )}
                        </button>
                    )}
                </div>

                {isReflectionComplete ? (
                    <p className="text-green-500 text-sm mt-6">
                        Congrats! Done for today. Come back tomorrow morning.
                    </p>
                ) : showThirdTask && !isReflectionComplete ? (
                    <p className="text-gray-500 text-xs italic mt-6">
                        Almost there — one task left!
                    </p>
                ) : null}
            </div>

            {/* Content Panel */}
            <div className="mt-12 animate-fade-in-3">

                {selectedTask === 'first_victory' && (
                    <div>
                        {!victoryLockedIn && !isVictoryComplete && (
                            <>
                                <h2 className="text-xl font-medium text-white mb-4 text-center">
                                    What are you most nervous about?
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 text-center">
                                    Without fooling yourself, tackling the true root of nervousness, is the fastest way to build rock-solid confidence early in the day.<br /><br />You will become fearless and invincible. Now you have reached maximum productivity potential. Do not focus on how it CAN NOT be done. Focus on how it CAN be done. And you are unstoppable.
                                </p>
                            </>
                        )}

                        {isVictoryComplete ? (
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-4">Your Task:</p>
                                <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-8">
                                    <p className="text-xl text-white font-medium">{victoryTask || 'Task saved'}</p>
                                </div>
                                <p className="text-green-500">✓ Task Done</p>
                            </div>
                        ) : victoryLockedIn ? (
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-white mb-6">Face The Task Now. Heads On.</h3>
                                <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-2">
                                    <p className="text-xl text-white font-medium">{victoryTask}</p>
                                </div>
                                <button
                                    onClick={() => setVictoryLockedIn(false)}
                                    className="text-gray-500 text-xs underline mb-8 hover:text-gray-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleCompleteVictory}
                                    disabled={submittingVictory}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    {submittingVictory ? '...' : 'Task Done ✓'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleLockInVictory}>
                                <textarea
                                    value={victoryTask}
                                    onChange={(e) => setVictoryTask(e.target.value)}
                                    placeholder="e.g., Making that phone call, Asking myself that question, ..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none mb-6"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    disabled={!victoryTask.trim()}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    Do Task Now
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {selectedTask === 'reflection' && (
                    <div>
                        <h2 className="text-xl font-medium text-white mb-4 text-center">
                            60-Second Reflection
                        </h2>

                        {isReflectionComplete ? (
                            <p className="text-green-500 text-center">✓ Completed</p>
                        ) : (
                            <div className="space-y-6">
                                {/* Custom metrics ratings */}
                                {successMetrics.length > 0 ? (
                                    <div className="space-y-4">
                                        {successMetrics.map((metric) => (
                                            <div key={metric.id} className="space-y-2">
                                                <p className="text-gray-300 text-sm text-center">{metric.question}</p>
                                                <div className="flex justify-center gap-1">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setMetricRatings(prev => ({ ...prev, [metric.id]: num }))}
                                                            className={`w-8 h-8 rounded-full border text-xs font-medium transition-all
                                                                ${metricRatings[metric.id] === num
                                                                    ? 'bg-white text-black border-white'
                                                                    : 'bg-transparent text-white border-white/30 hover:border-white/60'
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <p className="text-gray-500 text-sm italic text-center">
                                            Custom Success Metric Questions Appear Here.<br />
                                            Design Your Own under &quot;Where Do We Go&quot; Now.
                                        </p>
                                    </div>
                                )}

                                {/* Daily learning question */}
                                <div className="space-y-2">
                                    <p className="text-gray-300 text-sm">
                                        In one sentence, what's the most important thing you learned today to increase revenue?
                                    </p>
                                    <textarea
                                        value={dailyLearning}
                                        onChange={(e) => setDailyLearning(e.target.value)}
                                        placeholder="Today I learned..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none text-sm"
                                        rows={2}
                                    />
                                </div>

                                {/* Complete button */}
                                <button
                                    onClick={async () => {
                                        setSubmittingReflection(true)
                                        await saveReflectionData(metricRatings, dailyLearning)
                                        await markTaskComplete('reflection')
                                        setCompletedTasks(prev => [...prev, 'reflection'])
                                        setSubmittingReflection(false)
                                    }}
                                    disabled={submittingReflection}
                                    className="btn-primary w-full disabled:opacity-50"
                                >
                                    {submittingReflection ? 'Saving...' : 'Complete Reflection'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Fade-in animation */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div >
    )
}
