/**
 * ONBOARDING PAGE 10 (v1-o-10)
 * 
 * "Successful entrepreneurs achieve up to 20/month"
 * Routes to page 11 (if date known) or 12 (if no date)
 * Checks metric_responses to determine which path
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage10() {
    const [nextPage, setNextPage] = useState('/onboarding/12')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkEfdDate() {
            const supabase = createClient()

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            // Check if user has a last_efd_date saved
            const { data } = await supabase
                .from('metric_responses')
                .select(`
                    value_date,
                    metrics!inner(key)
                `)
                .eq('user_id', user.id)
                .eq('metrics.key', 'last_efd_date')
                .single()

            if (data?.value_date) {
                setNextPage('/onboarding/11')
            }

            setLoading(false)
        }

        checkEfdDate()
    }, [])

    return (
        <div className="w-full max-w-md text-center">
            {/* Page counter */}
            <p className="text-gray-600 text-sm mb-16">10 / 12</p>

            {/* Main content */}
            <h1 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                Successful entrepreneurs achieve up to<br />
                <span className="text-4xl font-bold">15 EFDs</span><br />
                per month.
            </h1>

            <p className="text-gray-400 mb-12 leading-relaxed">
                How many do you currently experience?<br />
                Let's find out and improve together.
            </p>

            {/* Continue button */}
            <Link
                href={nextPage}
                className={`btn-primary inline-block ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                Continue
            </Link>
        </div>
    )
}
