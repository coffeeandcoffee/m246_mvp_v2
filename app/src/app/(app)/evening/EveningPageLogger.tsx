/**
 * Client component to log page visits for evening pages
 * Used by server components that can't use useEffect directly
 */

'use client'

import { useEffect } from 'react'
import { logPageVisit } from './actions'

export function EveningPageLogger({ pageKey }: { pageKey: string }) {
    useEffect(() => {
        logPageVisit(pageKey)
    }, [pageKey])

    return null
}
