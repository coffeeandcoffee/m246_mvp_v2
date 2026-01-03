/**
 * EVENING PAGE 14 (v1-e-14)
 * 
 * Final page after evening flow (which now follows morning flow immediately).
 * Combines:
 * 1. Evening completion message ("See you tomorrow")
 * 2. Morning page 22 content (audio player + feature links)
 * 
 * This is a CLIENT component to support audio player state.
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { logPageVisit } from '../actions'

const FEATURE_LINKS = [
    { key: 'scientific-background', label: 'Scientific Background of the M246-Program' },
    { key: 'community-call', label: 'Join a Community Call' },
    { key: 'accountability-partner', label: 'Get an Accountability Partner' },
    { key: 'day-structure', label: 'Get more structure in my day' },
    { key: 'invite-friends', label: 'Invite-Link for my Friends to join M246' },
    { key: 'edit-audio', label: 'Edit my Reality-Defining Audio' },
]

export default function EveningPage14() {
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement>(null)

    const [userName, setUserName] = useState<string>('friend')
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioError, setAudioError] = useState<string | null>(null)
    const [audioDuration, setAudioDuration] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    // Log page visit and fetch user name on mount
    useEffect(() => {
        logPageVisit('v1-e-14')

        async function fetchName() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('name')
                    .eq('user_id', user.id)
                    .single()
                if (profile?.name) {
                    setUserName(profile.name)
                }
            }
        }
        fetchName()
    }, [])

    // Fetch audio URL on mount
    useEffect(() => {
        async function fetchAudio() {
            try {
                const supabase = createClient()
                const audioPath = 'default/default_grounding_audio.mp3'

                const { data, error } = await supabase.storage
                    .from('audio')
                    .createSignedUrl(audioPath, 3600)

                if (error) {
                    console.error('Audio URL error:', error)
                    setAudioError('Failed to load audio')
                    return
                }

                setAudioUrl(data.signedUrl)
            } catch (err) {
                console.error('Error fetching audio:', err)
                setAudioError('Failed to load audio')
            }
        }
        fetchAudio()
    }, [])

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

    function handleFeatureClick(featureKey: string) {
        router.push(`/morning/features/${featureKey}`)
    }

    const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">14 / 14</p>

            {/* Success checkmark */}
            <div className="w-20 h-20 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-10">
                <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>

            {/* Main message */}
            <h1 className="text-2xl font-semibold text-white mb-4 leading-relaxed">
                Great job, {userName}.
            </h1>

            <p className="text-gray-400 mb-8">
                See you tomorrow, right after awaking.
            </p>

            {/* Hint text */}
            <p className="text-gray-500 text-sm mb-12">
                The most important thing is done. Enjoy the rest of your day!
            </p>

            {/* Audio player */}
            <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-8">
                <p className="text-gray-400 text-sm mb-4">Your Mind Hack Audio (available anytime)</p>

                {/* Audio element */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        preload="metadata"
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        onError={() => setAudioError('Could not load audio')}
                    />
                )}

                {audioError ? (
                    <p className="text-red-400 text-sm">{audioError}</p>
                ) : (
                    <>
                        {/* Play/Pause button */}
                        <button
                            onClick={togglePlay}
                            disabled={!audioUrl || audioDuration === 0}
                            className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center mb-4 mx-auto hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            {isPlaying ? (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            )}
                        </button>

                        {/* Progress bar */}
                        <div className="w-full bg-white/20 rounded-full h-1 mb-2">
                            <div
                                className="bg-white h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {/* Time display */}
                        <div className="flex justify-between text-gray-500 text-xs">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(audioDuration)}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Feature links */}
            <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">Explore more:</p>
                <div className="space-y-2">
                    {FEATURE_LINKS.map((link) => (
                        <button
                            key={link.key}
                            onClick={() => handleFeatureClick(link.key)}
                            className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm transition-colors"
                        >
                            → {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
