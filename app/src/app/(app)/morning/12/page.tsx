/**
 * MORNING PAGE 12 (v1-m-12)
 * 
 * Audio player with progress bar
 * Next button UNLOCKED after 80% of audio duration has passed since page visit
 * 
 * Logic:
 * 1. On page load, record pageVisitTime
 * 2. Fetch audio and get its duration
 * 3. Calculate unlockTime = pageVisitTime + (duration * 0.8)
 * 4. Enable Next button when current time >= unlockTime
 * 
 * Audio source: default from Supabase Storage (user custom audio later)
 * 
 * Next → page 13
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { logPageVisit } from '../actions'
import { getUserAudioUrl } from '@/lib/audio'

export default function MorningPage12() {
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement>(null)

    const [loading, setLoading] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioError, setAudioError] = useState<string | null>(null)
    const [audioDuration, setAudioDuration] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [canProceed, setCanProceed] = useState(false)
    const [timeRemaining, setTimeRemaining] = useState<number>(0)

    // Store the page visit timestamp
    const [pageVisitTime] = useState<number>(Date.now())

    // Fetch audio URL on mount
    useEffect(() => {
        // Log page visit for progress tracking
        logPageVisit('v1-m-12')

        async function fetchAudio() {
            const supabase = createClient()

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setAudioError('Not authenticated')
                return
            }

            // Fetch user-specific audio (or fallback to default)
            const { signedUrl, error } = await getUserAudioUrl(supabase, user.id)

            if (error) {
                setAudioError(error)
                return
            }

            setAudioUrl(signedUrl)
        }

        fetchAudio()
    }, [])

    // When audio metadata loads, set up the unlock timer
    useEffect(() => {
        if (audioDuration > 0) {
            const unlockDuration = audioDuration * 0.8 * 1000 // 80% in milliseconds

            const interval = setInterval(() => {
                const elapsed = Date.now() - pageVisitTime
                const remaining = Math.max(0, unlockDuration - elapsed)
                setTimeRemaining(Math.ceil(remaining / 1000))

                if (elapsed >= unlockDuration) {
                    setCanProceed(true)
                    clearInterval(interval)
                }
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [audioDuration, pageVisitTime])

    // Handle audio metadata loaded
    function handleLoadedMetadata() {
        console.log('Audio metadata loaded')
        if (audioRef.current) {
            const duration = audioRef.current.duration
            console.log('Audio duration:', duration)
            setAudioDuration(duration)
            // Initialize countdown immediately
            setTimeRemaining(Math.ceil(duration * 0.8))
        }
    }

    // Handle audio can play through
    function handleCanPlayThrough() {
        console.log('Audio can play through')
    }

    // Handle audio error
    function handleAudioError(e: React.SyntheticEvent<HTMLAudioElement>) {
        console.error('Audio error:', e)
        setAudioError('Could not load audio file')
    }

    // Handle audio time update (for progress bar)
    function handleTimeUpdate() {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    // Toggle play/pause
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

    // Handle continue
    function handleContinue() {
        setLoading(true)
        router.push('/morning/13')
    }

    // Calculate progress percentage
    const progressPercent = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">12 / 18</p>

            {/* Main content */}
            <h1 className="text-xl font-medium text-white mb-8 leading-relaxed">
                Listen to Your Personalized Mind Conditioning Audio Now.
            </h1>

            {/* Label */}
            <p className="text-gray-500 text-sm mb-6">This is the Reality-Defining Neuropathway Shaping Process for today. Relax, be open minded to new solutions that may come to you. Recieve the confidence boost you deserve, and translate it into immediate action in the next step.</p>

            {/* Audio element */}
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlayThrough={handleCanPlayThrough}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    onError={handleAudioError}
                />
            )}

            {/* Error message */}
            {audioError && (
                <p className="text-red-400 text-sm mb-4">{audioError}</p>
            )}

            {/* Audio player UI */}
            <div className="mb-8">
                {/* Play/Pause button */}
                <button
                    onClick={togglePlay}
                    disabled={!audioUrl || audioDuration === 0}
                    className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-6 mx-auto hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                    {isPlaying ? (
                        // Pause icon
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        // Play icon
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </button>

                {/* Progress bar - clickable to seek */}
                <div
                    className="w-full bg-white/20 rounded-full h-4 mb-2 cursor-pointer flex items-center"
                    onClick={(e) => {
                        if (audioRef.current && audioDuration > 0) {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const clickX = e.clientX - rect.left
                            const percent = clickX / rect.width
                            audioRef.current.currentTime = percent * audioDuration
                        }
                    }}
                >
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

                {/* Loading status */}
                {audioUrl && audioDuration === 0 && !audioError && (
                    <p className="text-gray-500 text-sm mt-4">Loading audio...</p>
                )}
            </div>

            {/* Continue button */}
            <button
                onClick={handleContinue}
                disabled={loading || !canProceed}
                className="btn-primary disabled:opacity-50"
            >
                {loading ? '...' : 'Next'}
            </button>
        </div>
    )
}

// Helper to format seconds as mm:ss
function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}
