/**
 * DASHBOARD PAGE - Forbidden
 * 
 * Users should never see this page. It immediately redirects to /router
 * which will send them to the appropriate sequence.
 */

import { redirect } from 'next/navigation'

export default function DashboardPage() {
    // Dashboard is forbidden - redirect to router for proper time-based routing
    redirect('/router')
}

