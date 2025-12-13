'use client'

import { useState, useEffect, useRef } from 'react'

interface AudioPlayerProps {
    audioUrl: string
    onProgress: (percent: number) => void
    unlockThreshold?: number
}

export function AudioPlayer({ audioUrl, onProgress, unlockThreshold = 80 }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isUnlocked, setIsUnlocked] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
            const percent = (audio.currentTime / audio.duration) * 100
            onProgress(percent)

            if (percent >= unlockThreshold && !isUnlocked) {
                setIsUnlocked(true)
            }
        }

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
        }

        const handleEnded = () => {
            setIsPlaying(false)
        }

        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('ended', handleEnded)

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('ended', handleEnded)
        }
    }, [onProgress, unlockThreshold, isUnlocked])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current
        if (!audio || !duration) return

        const rect = e.currentTarget.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        audio.currentTime = percent * duration
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progressPercent = duration ? (currentTime / duration) * 100 : 0

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Play/Pause Button */}
            <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                        <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                        <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                        <polygon points="5,3 19,12 5,21" fill="currentColor" />
                    </svg>
                )}
            </button>

            {/* Progress Bar */}
            <div className="w-full">
                <div className="progress-bar" onClick={handleSeek}>
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Time Display */}
                <div className="flex justify-between mt-2">
                    <span className="time-display">{formatTime(currentTime)}</span>
                    <span className="time-display">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    )
}
