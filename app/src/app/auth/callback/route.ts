/**
 * AUTH CALLBACK ROUTE
 * 
 * Handles Supabase PKCE auth flow - exchanges code for session.
 * Required for password reset, email confirmation, etc.
 */

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/router'

    const baseUrl = 'https://member.m246.org'

    console.log('[AUTH CALLBACK] code:', code ? code.substring(0, 8) + '...' : 'none', 'next:', next)

    if (code) {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            console.log('[AUTH CALLBACK] exchange result:', error ? error.message : 'success')
            console.log('[AUTH CALLBACK] session user:', data?.session?.user?.email || 'none')

            if (!error && data.session) {
                // Success - redirect to target page
                return NextResponse.redirect(`${baseUrl}${next}`)
            } else {
                // Exchange failed - show error in URL
                const errorMsg = encodeURIComponent(error?.message || 'unknown_error')
                return NextResponse.redirect(`${baseUrl}/login?error=${errorMsg}`)
            }
        } catch (e: any) {
            console.log('[AUTH CALLBACK] exception:', e.message)
            return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(e.message)}`)
        }
    }

    // No code in URL
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`)
}
