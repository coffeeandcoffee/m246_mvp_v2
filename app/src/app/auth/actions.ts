/**
 * AUTH ACTIONS - Server-side authentication logic
 * 
 * These are "Server Actions" in Next.js - they run on the server, not in the browser.
 * This is important because:
 * 1. We can safely call Supabase without exposing credentials
 * 2. We can redirect users after success
 * 3. Form submissions are handled securely
 * 
 * The 'use server' directive at the top tells Next.js these are server actions.
 */

'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// ============================================================================
// SIGNUP - Creates a new user account
// ============================================================================

export async function signup(formData: FormData) {
    // Step 1: Extract form values
    // FormData is what the browser sends when a form is submitted
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const inviteCode = formData.get('inviteCode') as string

    // Step 2: Basic validation - make sure fields aren't empty
    if (!email || !password || !inviteCode) {
        return { error: 'All fields are required' }
    }

    // Step 3: Create a Supabase client for this request
    const supabase = await createClient()

    // Step 4: VALIDATE THE INVITE CODE FIRST (before creating user!)
    // This calls the validate_invite_code() function we created in the database
    // 
    // Why .rpc()? It calls a PostgreSQL function directly.
    // Our function returns true/false to tell us if the code is valid.
    const { data: isValidCode, error: codeError } = await supabase
        .rpc('validate_invite_code', { p_code: inviteCode })

    // Handle database errors (rare, but good to check)
    if (codeError) {
        console.error('Invite code validation error:', codeError)
        return { error: 'Failed to validate invite code' }
    }

    // If the code is NOT valid, stop here! Don't create the user.
    if (!isValidCode) {
        return { error: 'Invalid invite code' }
    }

    // Step 5: Code is valid! Now create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    })

    // Handle signup errors (e.g., email already exists, weak password)
    if (authError) {
        console.error('Signup error:', authError)
        return { error: authError.message }
    }

    // Step 6: Mark the invite code as used (for referral codes)
    // Universal codes (M246MVP) won't be marked as used - the database function handles this
    if (authData.user) {
        const { error: useCodeError } = await supabase
            .rpc('use_invite_code', {
                p_code: inviteCode,
                p_user_id: authData.user.id
            })

        // Log but don't fail - the user is already created
        if (useCodeError) {
            console.error('Failed to mark invite code as used:', useCodeError)
        }
    }

    // Step 7: Success! Redirect to onboarding (first-time users)
    redirect('/onboarding/1')
}

// ============================================================================
// LOGIN - Signs in an existing user
// ============================================================================

export async function login(formData: FormData) {
    // Step 1: Extract form values
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Step 2: Basic validation
    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Step 3: Create Supabase client and attempt sign in
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // Handle login errors (wrong password, user doesn't exist, etc.)
    if (error) {
        return { error: error.message }
    }

    // Step 4: Success! Redirect to dashboard
    redirect('/dashboard')
}

// ============================================================================
// SIGNOUT - Signs out the current user
// ============================================================================

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
