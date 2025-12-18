/**
 * ROUTING API
 * 
 * API endpoint for client-side polling.
 * Returns JSON with redirect URL if user needs to be redirected based on time rules.
 * Used by layouts to check every 10 seconds if routing should kick in.
 */

import { NextResponse } from 'next/server'
import { checkRouting } from '@/lib/routing'

export async function GET() {
    const result = await checkRouting()

    return NextResponse.json({
        redirect: result.redirect,
        reason: result.reason
    })
}
