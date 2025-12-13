'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/app')  // Redirect to app (sequence router)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const inviteCode = (formData.get('inviteCode') as string)?.toUpperCase().trim()

    // Validate invite code first
    if (!inviteCode) {
        redirect('/signup?error=' + encodeURIComponent('Invite code is required'))
    }

    const { data: isValid, error: validateError } = await supabase
        .rpc('validate_invite_code', { p_code: inviteCode })

    if (validateError || !isValid) {
        redirect('/signup?error=' + encodeURIComponent('Invalid invite code'))
    }

    // Create user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signupError) {
        redirect('/signup?error=' + encodeURIComponent(signupError.message))
    }

    // Mark invite code as used (if it's a one-time code)
    if (authData.user) {
        await supabase.rpc('use_invite_code', {
            p_code: inviteCode,
            p_user_id: authData.user.id
        })

        // Update user profile with invite code reference
        const { data: codeData } = await supabase
            .from('invite_codes')
            .select('id')
            .eq('code', inviteCode)
            .single()

        if (codeData) {
            await supabase
                .from('user_profiles')
                .update({ invite_code_id: codeData.id })
                .eq('user_id', authData.user.id)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/signup?message=Check your email to confirm your account')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
