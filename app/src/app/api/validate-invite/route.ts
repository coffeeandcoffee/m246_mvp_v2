import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { code } = await request.json()

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { valid: false, error: 'Invite code is required' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Call the validate_invite_code function we created in migrations
        const { data, error } = await supabase
            .rpc('validate_invite_code', { p_code: code.toUpperCase().trim() })

        if (error) {
            console.error('Invite code validation error:', error)
            return NextResponse.json(
                { valid: false, error: 'Failed to validate code' },
                { status: 500 }
            )
        }

        return NextResponse.json({ valid: data === true })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { valid: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
