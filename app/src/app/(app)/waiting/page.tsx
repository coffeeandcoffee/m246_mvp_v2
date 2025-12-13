import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '@/app/auth/actions'

export default async function WaitingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user profile
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('name, timezone')
        .eq('user_id', user.id)
        .single()

    const userName = profile?.name || 'there'
    const timezone = profile?.timezone || 'UTC'

    // Get today's date
    const now = new Date()
    const userLocalTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    const hour = userLocalTime.getHours()
    const isNightOwl = hour < 3
    const effectiveDate = isNightOwl
        ? new Date(userLocalTime.getTime() - 24 * 60 * 60 * 1000)
        : userLocalTime
    const dateStr = effectiveDate.toISOString().split('T')[0]

    // Get today's log
    const { data: todaysLog } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', dateStr)
        .single()

    // Get evening reflection time
    let reflectionTime = '18:00'
    if (todaysLog) {
        const { data: metric } = await supabase
            .from('metrics')
            .select('id')
            .eq('key', 'evening_reflection_time')
            .single()

        if (metric) {
            const { data: timeResponse } = await supabase
                .from('metric_responses')
                .select('value_time')
                .eq('daily_log_id', todaysLog.id)
                .eq('metric_id', metric.id)
                .single()

            if (timeResponse?.value_time) {
                reflectionTime = timeResponse.value_time
            }
        }
    }

    // Format time for display
    const [hours, minutes] = reflectionTime.split(':').map(Number)
    const displayTime = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })

    return (
        <div className="page-container">
            <div className="sequence-page">
                <h1 className="heading-lg">Well done, {userName}!</h1>

                <p className="text-body">
                    Return here for your 5-min reflection at {displayTime} when alarm rings.
                </p>

                <p className="text-muted mt-4">
                    Now you can relax a little bit. Take a break.
                    <br /><br />
                    You can listen to your audio again to gain energy, or simply do nothing.
                    <br /><br />
                    When you are ready to continue with the next most important task, go ahead.
                </p>

                <div className="feature-links mt-8">
                    <Link href="/app/feature/scientific" className="feature-link">
                        Scientific Background of the M246-Program
                    </Link>
                    <Link href="/app/feature/community" className="feature-link">
                        Join a Community Call
                    </Link>
                    <Link href="/app/feature/accountability" className="feature-link">
                        Get an Accountability Partner
                    </Link>
                    <Link href="/app/feature/structure" className="feature-link">
                        Get more structure in my day
                    </Link>
                    <Link href="/app/feature/invite" className="feature-link">
                        Invite-Link for my Friends join M246
                    </Link>
                    <Link href="/app/feature/audio" className="feature-link">
                        Edit my Reality-Defining Audio
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-[#222] w-full">
                    <h2 className="heading-sm mb-4">Reality-Defining Audio</h2>
                    <p className="text-muted mb-4">Listen anytime, to gain clarity and confidence.</p>
                    {/* Audio player would go here */}
                    <p className="text-muted text-sm">[Audio player - coming soon]</p>
                </div>

                <form className="mt-8">
                    <button
                        formAction={signout}
                        className="text-muted text-sm underline hover:text-white"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}
