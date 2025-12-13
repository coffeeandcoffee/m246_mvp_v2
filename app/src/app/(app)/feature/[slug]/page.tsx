'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { SequencePage } from '@/components/sequences/SequencePage'
import { TextInput } from '@/components/ui/TextInput'
import { Button } from '@/components/ui/Button'

const FEATURE_TITLES: Record<string, string> = {
    scientific: 'Scientific Background',
    community: 'Community Call',
    accountability: 'Accountability Partner',
    structure: 'Daily Structure',
    invite: 'Invite Friends',
    audio: 'Edit Reality-Defining Audio',
    scientific_background: 'Scientific Background',
    community_call: 'Community Call',
    accountability_partner: 'Accountability Partner',
    invite_friends: 'Invite Friends',
    edit_audio: 'Edit Reality-Defining Audio',
}

export default function FeaturePage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string
    const [suggestion, setSuggestion] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const title = FEATURE_TITLES[slug] || 'Coming Soon'

    const handleSubmit = async () => {
        if (!suggestion.trim()) return

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase.from('feature_suggestions').insert({
            user_id: user.id,
            feature_key: slug,
            suggestion_text: suggestion.trim(),
        })

        setSubmitted(true)
    }

    return (
        <SequencePage pageId={`feature-${slug}`} showFeedback={false}>
            <h1 className="heading-lg mb-6">{title}</h1>

            <p className="text-body mb-8">
                Soon to come
            </p>

            {!submitted ? (
                <>
                    <p className="text-muted mb-4">
                        In your opinion, what would be cool to have?
                    </p>

                    <TextInput
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Your suggestion..."
                    />

                    <Button className="mt-4" onClick={handleSubmit} disabled={!suggestion.trim()}>
                        Send
                    </Button>
                </>
            ) : (
                <div className="success-box">
                    Thank you! We received your suggestion.
                </div>
            )}

            <button
                className="text-muted text-sm underline mt-8"
                onClick={() => router.back()}
            >
                ← Back
            </button>
        </SequencePage>
    )
}
