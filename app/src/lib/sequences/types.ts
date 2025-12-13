// Sequence page definitions and types

export type PageType =
    | 'text'           // Just text, click to continue
    | 'text-input'     // Text input field
    | 'choice'         // Yes/No or multiple choice
    | 'checkbox'       // Checkbox then button
    | 'scale'          // 1-10 rating
    | 'time-picker'    // Time selection
    | 'date-picker'    // Date selection
    | 'timezone'       // Timezone selection
    | 'audio'          // Audio player

export interface SequencePage {
    key: string                    // e.g., 'v1-o-1'
    type: PageType
    heading?: string
    text: string
    subtext?: string
    buttonText: string
    metric?: string                // Metric key to save
    maxLabel?: string              // For scale type
    choices?: { label: string; value: string; next?: string }[]
    branch?: { [value: string]: string }  // value -> next page key
    showIf?: (data: Record<string, unknown>) => boolean
}

export interface SequenceDefinition {
    key: string                    // 'onboarding', 'morning', 'evening'
    pages: SequencePage[]
}

// Get next page key based on current page and user response
export function getNextPageKey(
    pages: SequencePage[],
    currentKey: string,
    response?: string
): string | null {
    const currentIndex = pages.findIndex(p => p.key === currentKey)
    if (currentIndex === -1) return null

    const currentPage = pages[currentIndex]

    // Check for branch logic
    if (currentPage.branch && response) {
        const branchTarget = currentPage.branch[response]
        if (branchTarget) return branchTarget
    }

    // Default to next page
    if (currentIndex < pages.length - 1) {
        return pages[currentIndex + 1].key
    }

    return null // End of sequence
}

// Get page by key
export function getPageByKey(
    pages: SequencePage[],
    key: string
): SequencePage | undefined {
    return pages.find(p => p.key === key)
}
