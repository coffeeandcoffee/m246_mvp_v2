import { SequencePage } from './types'

export const onboardingPages: SequencePage[] = [
    {
        key: 'v1-o-1',
        type: 'text-input',
        text: 'How can we call you?',
        buttonText: '>',
        metric: 'user_name',
    },
    {
        key: 'v1-o-2',
        type: 'timezone',
        text: 'Is this your correct Timezone?',
        subtext: 'Change later in settings',
        buttonText: '>',
        metric: 'user_timezone',
    },
    {
        key: 'v1-o-3',
        type: 'choice',
        text: 'Do you remember the last day you did not overthink, you had no doubt, and you just executed boldly, and quickly with clarity and confidence?',
        buttonText: '',
        metric: 'remembers_efd',
        choices: [
            { label: 'Yes', value: 'yes', next: 'v1-o-4' },
            { label: 'No', value: 'no', next: 'v1-o-5' },
        ],
        branch: { 'yes': 'v1-o-4', 'no': 'v1-o-5' },
    },
    {
        key: 'v1-o-4',
        type: 'date-picker',
        text: 'Do you remember, by any chance, when this day was?',
        subtext: 'The day you did not overthink, you had no doubts, and you simply executed boldly.',
        buttonText: '>',
        metric: 'last_efd_date',
        showIf: (data) => data.remembers_efd === 'yes',
    },
    {
        key: 'v1-o-5',
        type: 'text',
        text: 'We call such days Execution Flow Days.',
        buttonText: '>',
    },
    {
        key: 'v1-o-6',
        type: 'text',
        heading: 'Execution Flow Days',
        text: 'Those days feel really good. Work feels effortless. Without stress.',
        buttonText: '>',
    },
    {
        key: 'v1-o-7',
        type: 'text',
        heading: 'Execution Flow Days',
        text: 'Once such a special day is over, you feel accomplished. This has several benefits beyond increasing your profits.',
        buttonText: '>',
    },
    {
        key: 'v1-o-8',
        type: 'text',
        heading: 'Execution Flow Days',
        text: 'Such days cause you to:\n\n• improve your mental health\n• progress in business quick\n• gain confidence and clarity\n• not overthink\n• think positively\n• and attract good things',
        buttonText: '>',
    },
    {
        key: 'v1-o-9',
        type: 'text',
        text: 'Our goal is to help you increase the number of such days. Not only because it is the single deciding factor for your business success, but because it is healthy, and it is the way we are supposed to be living.\n\nStress, worry, doubt, fear and overthinking are no good for building an impactful, fulfilling, and successful business.',
        buttonText: '>',
    },
    {
        key: 'v1-o-10',
        type: 'text',
        text: 'Successful, experienced & happy entrepreneurs achieve up to 20 such days per month.\n\nFocussed, effortless impact.',
        subtext: 'Good news: It is a muscle. You can train it.',
        buttonText: '>',
    },
    {
        key: 'v1-o-11',
        type: 'text',
        text: '', // Dynamic: "You had your last execution flow day on [DATE]..."
        buttonText: 'Lets Go >',
        showIf: (data) => !!data.last_efd_date,
    },
    {
        key: 'v1-o-12',
        type: 'text',
        text: "You couldn't seem to remember your last execution flow day.\n\nTogether, we will change that.\n\nLets try to get it up to 5 Execution flow days in the next 30 days.\nShall we?",
        buttonText: 'Lets Go >',
        showIf: (data) => !data.last_efd_date,
    },
]

export const onboardingSequence = {
    key: 'onboarding',
    pages: onboardingPages,
}
