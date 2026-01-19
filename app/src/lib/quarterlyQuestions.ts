/**
 * Quarterly Reflection Questions
 * 
 * These 26 questions are asked each quarter.
 * Answers are stored by index (0-25) in the quarterly_reports table.
 */

export const quarterlyQuestions: string[] = [
    "Have I attained the goal that I established as my objective for this year?",
    "Have I delivered service of the best possible quality of which I was capable, or have I improved any part of this service?",
    "Have I delivered service in the greatest possible quantity that I was capable of?",
    "Has the spirit of my conduct been harmonious and cooperative at all times?",
    "Have I permitted the habit of procrastination to decrease my efficiency, and if so, to what extent? (Non-immediate obedience of your intuition/gut-feeling is also procrastination)",
    "Have I improved my personality? And if so, in what ways?",
    "Have I been persistent in following my plans through to completion?",
    "Have I reached decisions promptly and definitely on all occasions?",
    "Have I permitted any one or more of the six basic fears to decrease my efficiency? These are: (i) The fear of poverty (ii) The fear of criticism (iii) The fear of ill health (iv) The fear of loss of love of someone (v) The fear of old age (vi) The fear of death.",
    "Have I been either over cautious or under cautious?",
    "Has my relationship with my associates in work been pleasant or unpleasant? If unpleasant, has the fault been partly or wholly mine?",
    "Have I dissipated any of my energy through a lack of concentration of effort?",
    "Have I been open minded and tolerant in connection with all subjects?",
    "In what way have I improved my ability to render service?",
    "Have I been intemperate in any of my habits?",
    "Have I expressed either openly or secretly any form of egotism?",
    "Has my conduct towards my associates been such that it has induced them to respect me?",
    "Have my opinions and decisions been based upon guesswork? Or accuracy of analysis and thought?",
    "Have I followed the habit of budgeting my time, my expenses, and my income? And have I been conservative in these budgets?",
    "How much time have I devoted to unprofitable effort, which I might have used to better advantage?",
    "How may I rebudget my time and change my habits so I can be more efficient the coming year?",
    "Have I been guilty of any conduct, which was not approved by my conscience?",
    "In what ways have I rendered more service and better service than I was paid to render?",
    "Have I been unfair to anyone? And if so, in what way?",
    "If I had been the purchaser of my own services for the year, would I be satisfied with my purchase?",
    "Am I in the right vocation? And if not, why not?",
    "Has the purchaser of my services been satisfied with the service I have rendered? And if not, why not?"
]

/**
 * Instructions shown at the top of the reflection page
 */
export const reflectionInstructions: string[] = [
    "Take your time to self-analyse (at least 1 whole day)",
    "Provide short, clear, honest answers",
    "Go through the questions with somebody that does not permit you to deceive yourself. In other words: with somebody that is very honest and does not always say what you would like to hear, but rather what you need to hear"
]

/**
 * Calculate quarter dates and status
 */
export function getQuarterInfo(year: number, quarter: number, currentDate: Date = new Date()) {
    // Quarter month ranges: Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec
    const thirdMonthStart = new Map([
        [1, { month: 2, day: 1 }],  // Mar 1
        [2, { month: 5, day: 1 }],  // Jun 1
        [3, { month: 8, day: 1 }],  // Sep 1
        [4, { month: 11, day: 1 }]  // Dec 1
    ])

    const editableEndMonth = new Map([
        [1, { month: 3, endDay: 30 }],   // Apr 30
        [2, { month: 6, endDay: 31 }],   // Jul 31
        [3, { month: 9, endDay: 31 }],   // Oct 31
        [4, { month: 0, endDay: 31, nextYear: true }]  // Jan 31 next year
    ])

    const activeFrom = thirdMonthStart.get(quarter)!
    const editEnd = editableEndMonth.get(quarter)!

    const activeDate = new Date(year, activeFrom.month, activeFrom.day)
    const editableEndYear = editEnd.nextYear ? year + 1 : year
    const editableEndDate = new Date(editableEndYear, editEnd.month, editEnd.endDay, 23, 59, 59)

    const isActive = currentDate >= activeDate
    const isEditable = currentDate >= activeDate && currentDate <= editableEndDate

    return {
        activeDate,
        editableEndDate,
        isActive,
        isEditable,
        availableText: formatAvailableDate(activeDate)
    }
}

function formatAvailableDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString().slice(-2)
    return `${day} ${month} ${year}`
}
