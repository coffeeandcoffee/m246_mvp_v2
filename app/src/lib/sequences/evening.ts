import { SequencePage } from './types'

export const eveningPages: SequencePage[] = [
    {
        key: 'v1-e-1',
        type: 'text',
        text: 'Your short 5-min daily reflection is ready.\n\nIn a few weeks you can use the results, and optimize your brain and behaviour to achieve your dream.',
        buttonText: '>',
    },
    {
        key: 'v1-e-2',
        type: 'choice',
        text: 'Before you continue:\n\nWill you commit to open this app tomorrow morning right after waking up before opening any other app?',
        subtext: 'We promise to increase your chances of a productive day by at least 64%+',
        buttonText: '',
        metric: 'committed_tomorrow',
        choices: [
            { label: 'I Commit.', value: 'commit', next: 'v1-e-7' },
            { label: 'Tomorrow I take a day off.', value: 'day_off', next: 'v1-e-3' },
        ],
        branch: { 'commit': 'v1-e-7', 'day_off': 'v1-e-3' },
    },
    {
        key: 'v1-e-3',
        type: 'text',
        text: 'Good, taking a day off is important as well.',
        buttonText: '>',
        showIf: (data) => data.committed_tomorrow === 'day_off',
    },
    {
        key: 'v1-e-4',
        type: 'choice',
        text: 'When will you return to work?',
        buttonText: '',
        choices: [
            { label: 'The day after tomorrow', value: 'day_after', next: 'v1-e-6' },
            { label: 'Later', value: 'later', next: 'v1-e-5' },
        ],
        branch: { 'day_after': 'v1-e-6', 'later': 'v1-e-5' },
        showIf: (data) => data.committed_tomorrow === 'day_off',
    },
    {
        key: 'v1-e-5',
        type: 'date-picker',
        text: 'When will you return to your work?',
        buttonText: '>',
        metric: 'return_date',
        showIf: (data) => data.committed_tomorrow === 'day_off',
    },
    {
        key: 'v1-e-6',
        type: 'text',
        text: '', // Dynamic: "Will you commit to open this app [DATE] morning..."
        buttonText: 'I Commit',
        showIf: (data) => data.committed_tomorrow === 'day_off',
    },
    {
        key: 'v1-e-7',
        type: 'scale',
        text: 'How positive did you feel today?\nBe honest.',
        buttonText: '>',
        metric: 'rating_positivity',
        maxLabel: 'I felt fantastic.',
    },
    {
        key: 'v1-e-8',
        type: 'scale',
        text: 'How confident were you today in your actions?\nBe honest.',
        buttonText: '>',
        metric: 'rating_confidence',
        maxLabel: 'Very confident.',
    },
    {
        key: 'v1-e-9',
        type: 'scale',
        text: 'How much overthinking did you do today?\nBe honest.',
        buttonText: '>',
        metric: 'rating_overthinking',
        maxLabel: 'Lots of overthinking & hesitation.',
    },
    {
        key: 'v1-e-10',
        type: 'scale',
        text: 'How much did intuition lead your actions today?\nBe honest.',
        buttonText: '>',
        metric: 'rating_intuition',
        maxLabel: 'Very Much.',
    },
    {
        key: 'v1-e-11',
        type: 'scale',
        text: 'How much doubt did you have today in achieving your dream?\nBe honest.',
        buttonText: '>',
        metric: 'rating_doubt',
        maxLabel: 'Lots of doubt.',
    },
    {
        key: 'v1-e-12',
        type: 'scale',
        text: 'How happy were you today?\nBe honest.',
        buttonText: '>',
        metric: 'rating_happiness',
        maxLabel: 'Very happy.',
    },
    {
        key: 'v1-e-13',
        type: 'scale',
        text: 'How quick were your decisions today?\nBe honest.',
        buttonText: '>',
        metric: 'rating_decision_speed',
        maxLabel: 'Very fast.',
    },
    {
        key: 'v1-e-14',
        type: 'text',
        text: '', // Dynamic: "Great job NAME. See you [DATE] morning."
        buttonText: '>',
    },
]

export const eveningSequence = {
    key: 'evening',
    pages: eveningPages,
}
