/**
 * USE ROUTING POLL HOOK
 * 
 * Client-side hook that polls the routing API every 10 seconds.
 * If routing logic determines user should be redirected, it navigates them.
 * 
 * Used in sequence layouts to enforce HARD RULES even when user is mid-flow.
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useRoutingPoll() {
    const router = useRouter()

    useEffect(() => {
        const checkRouting = async () => {
            try {
                const response = await fetch('/api/check-routing')
                const data = await response.json()

                if (data.redirect) {
                    // Don't redirect if we're already on the target page
                    const currentPath = window.location.pathname
                    if (currentPath !== data.redirect) {
                        // Don't redirect if user is on a features page linked from morning/22
                        // These are valid "end state" pages where user should be able to stay
                        const isOnMorningFeatures = currentPath.startsWith('/morning/features/')
                        const redirectToMorning22 = data.redirect === '/morning/22'
                        if (isOnMorningFeatures && redirectToMorning22) {
                            // User chose to visit a feature page - respect that
                            return
                        }
                        router.push(data.redirect)
                    }
                }
            } catch (error) {
                // Silently fail - don't break the app
                console.error('Routing check failed:', error)
            }
        }

        // Check on mount
        checkRouting()

        // Check every 10 seconds
        const interval = setInterval(checkRouting, 10000)

        return () => clearInterval(interval)
    }, [router])
}
