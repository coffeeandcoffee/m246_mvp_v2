import { SequencePage } from './types'

export const morningPages: SequencePage[] = [
    {
        key: 'v1-m-1',
        type: 'text',
        heading: 'Step #1 ✓',
        text: '', // Dynamic: "NAME, you showed up. Well done.\n\nSTEP #1 = DONE."
        buttonText: '>',
    },
    {
        key: 'v1-m-2',
        type: 'checkbox',
        text: 'I will not open any other apps before finishing the 3 steps of today, committing to progress towards my dream.',
        buttonText: 'Commit',
    },
    {
        key: 'v1-m-3',
        type: 'text',
        heading: 'Step #2',
        text: 'Put headphones in.',
        buttonText: 'Done.',
    },
    {
        key: 'v1-m-4',
        type: 'text',
        text: '', // Dynamic: "NAME - Now we get your brain into the right state before listening to your Reality-Defining Audio."
        buttonText: 'Next',
    },
    {
        key: 'v1-m-5',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'While listening, believe you have already achieved all you desire.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-6',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'Therefore you can relax and approach the day with joy.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-7',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'Relax, let your mind dream while listening.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-8',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'Take in the energy and feel the execution flow and confidence coming to you. Open your mind and be ready.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-9',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'You will see when it comes:\n\nIt will show in the way you walk, talk and think.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-10',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'Confident Execution Flow is a muscle we train together.',
        buttonText: 'I understand',
    },
    {
        key: 'v1-m-11',
        type: 'text',
        heading: 'Read Carefully:',
        text: 'We never let you down. And always believe in you.\n\nNow go ahead and make this day your own!',
        buttonText: 'Lets Go',
    },
    {
        key: 'v1-m-12',
        type: 'audio',
        heading: 'Press Play to Start Todays Journey.',
        text: 'Relax and let your inner confidence take over and lead you.\nDo not waste time. Start now.',
        buttonText: 'Next',
        metric: 'audio_play',
    },
    {
        key: 'v1-m-13',
        type: 'text',
        heading: 'Step #2 ✓',
        text: '', // Dynamic: "NAME - well done. STEP #2 = DONE."
        buttonText: '>',
    },
    {
        key: 'v1-m-14',
        type: 'text',
        text: 'Info: You can listen to your audio at anytime, to ride your wave of execution energy and confidence.\n\n(e.g. in a break between work)',
        buttonText: 'Ok',
    },
    {
        key: 'v1-m-15',
        type: 'text',
        heading: 'STEP #3',
        text: '', // Dynamic: "2/3 - well done NAME. Only one step left to make this day a success."
        buttonText: 'Lets Go',
    },
    {
        key: 'v1-m-16',
        type: 'text-input',
        heading: 'The Magic Task',
        text: '', // Dynamic: "NAME – What is the single most impactful Magic Task..."
        buttonText: 'Next',
        metric: 'magic_task',
    },
    {
        key: 'v1-m-17',
        type: 'text',
        heading: 'The Magic Task',
        text: '', // Dynamic: Shows user's task + focus instructions
        buttonText: 'Task is Done.',
        metric: 'magic_task_completed',
    },
    {
        key: 'v1-m-18',
        type: 'text',
        heading: 'Step #3 ✓',
        text: '', // Dynamic: "3/3 - NAME - truly amazing. How does it feel..."
        buttonText: 'Next',
    },
    {
        key: 'v1-m-19',
        type: 'time-picker',
        text: 'The daily 5-min reflection at the end of each day will soon uncover interesting insights into your brain, behaviour and what to improve to achieve your dream in reality.\n\nWhen do you want to return today for the 5-min reflection?',
        subtext: 'Do this ideally when you are done with your work and transition to relaxation.',
        buttonText: '>',
        metric: 'evening_reflection_time',
    },
    {
        key: 'v1-m-20',
        type: 'text',
        text: 'Now also put an alarm for that time on your phone so you have an easy reminder and don\'t have to remember yourself.',
        subtext: 'Info: this frees up your mind for other things.',
        buttonText: 'Done',
    },
    {
        key: 'v1-m-21',
        type: 'text',
        text: 'It seems like we did not log your 5-minute reflection yesterday.',
        buttonText: '>',
        // This page only shows if yesterday's evening sequence is empty
        // After this, user fills yesterday's evening questions
    },
    {
        key: 'v1-m-22',
        type: 'text',
        text: '', // Dynamic: final page with reflection time, audio player, feature links
        buttonText: '',
    },
]

export const morningSequence = {
    key: 'morning',
    pages: morningPages,
}

export const FEATURE_LINKS = [
    { key: 'scientific_background', label: 'Scientific Background of the M246-Program' },
    { key: 'community_call', label: 'Join a Community Call' },
    { key: 'accountability_partner', label: 'Get an Accountability Partner' },
    { key: 'structure', label: 'Get more structure in my day' },
    { key: 'invite_friends', label: 'Invite-Link for my Friends join M246' },
    { key: 'edit_audio', label: 'Edit my Reality-Defining Audio' },
]
