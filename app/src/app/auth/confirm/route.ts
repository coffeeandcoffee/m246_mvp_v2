import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    // Force production URL
    const baseUrl = 'https://member.m246.org'

    if (token_hash && type) {
        const supabase = await createClient()
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            // Force redirect to /reset-password for recovery flow
            let targetPath = next
            if (type === 'recovery') {
                targetPath = '/reset-password'
            }

            return NextResponse.redirect(`${baseUrl}${targetPath}`)
        }
    }

    // Error case
    return NextResponse.redirect(`${baseUrl}/login?error=link_invalid`)
}
