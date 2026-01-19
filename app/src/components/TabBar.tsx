'use client'

import { usePathname, useRouter } from 'next/navigation'

/**
 * RESPONSIVE TAB BAR / SIDEBAR
 * 
 * Mobile: Bottom navigation bar (TikTok/YouTube-style)
 * Desktop (md+): Left sidebar navigation
 * 
 * Tabs:
 * - Strategy - compass icon
 * - Action (primary) - lightning icon
 * - Settings - gear icon
 */

type TabId = 'strategy' | 'action' | 'settings'

interface Tab {
    id: TabId
    label: string
    path: string
    icon: React.ReactNode
}

function StrategyIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            {/* Compass icon */}
            <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
            />
        </svg>
    )
}

function ActionIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-7 h-7 ${active ? 'text-white' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
        </svg>
    )
}

function SettingsIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    )
}

export default function TabBar() {
    const pathname = usePathname()
    const router = useRouter()

    // Determine active tab based on current path
    const getActiveTab = (): TabId => {
        if (pathname.startsWith('/purpose')) return 'strategy'
        if (pathname.startsWith('/settings')) return 'settings'
        // Default to action for all sequence pages (morning, evening, onboarding, dayoff, router)
        return 'action'
    }

    const activeTab = getActiveTab()

    const tabs: Tab[] = [
        {
            id: 'strategy',
            label: 'Where Do We Go?',
            path: '/purpose',
            icon: <StrategyIcon active={activeTab === 'strategy'} />
        },
        {
            id: 'action',
            label: 'Whats Next Today?',
            path: '/router',
            icon: <ActionIcon active={activeTab === 'action'} />
        },
        {
            id: 'settings',
            label: 'Settings',
            path: '/settings',
            icon: <SettingsIcon active={activeTab === 'settings'} />
        }
    ]

    const handleTabClick = (tab: Tab) => {
        router.push(tab.path)
    }

    return (
        <nav className="
            fixed z-40 bg-black border-white/10
            bottom-0 left-0 right-0 border-t safe-area-bottom pb-3
            md:top-0 md:right-auto md:w-64 md:border-t-0 md:border-r md:pb-0
        ">
            <div className="
                flex justify-around items-center h-16 max-w-md mx-auto
                md:flex-col md:justify-start md:items-stretch md:h-full md:pt-8 md:gap-2 md:max-w-none md:px-4
            ">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    const isCenter = tab.id === 'action'

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={`
                                flex flex-col items-center justify-center flex-1 h-full transition-colors
                                md:flex-row md:flex-none md:justify-start md:items-center md:w-full md:h-auto md:py-3 md:px-4 md:gap-3 md:rounded-lg md:hover:bg-white/5
                                ${isCenter ? 'scale-110 md:scale-100 md:order-first' : ''}
                            `}
                        >
                            <span className="md:shrink-0">{tab.icon}</span>
                            <span
                                className={`text-xs mt-1 md:mt-0 md:text-sm md:text-left md:whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-500'}`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
