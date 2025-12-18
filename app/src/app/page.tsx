/**
 * ROOT PAGE
 * 
 * Redirects to /pwa which handles standalone detection.
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
    redirect('/pwa')
}
