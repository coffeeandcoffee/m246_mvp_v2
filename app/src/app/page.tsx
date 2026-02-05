/**
 * ROOT PAGE
 * 
 * Simple redirect to /pwa which handles all detection logic.
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
    redirect('/pwa')
}
