export type JourneyDemosLink = {
  featureKey: string
  label: string
}

export type HandstandJourneyStage = {
  stage: number
  title: string
  goal: string
  bullets: string[]
  moveOn: string
  demosLink?: JourneyDemosLink
}

export const HANDSTAND_JOURNEY_TITLE = 'The handstand journey to balance'

export const HANDSTAND_JOURNEY_INTRO =
  'A progression from chest-to-wall through heel and toe work to freestanding balance — with clear goals and when to move on. Drill demos and written guides live under each feature’s Demos screen.'

export const HANDSTAND_JOURNEY_STAGES: HandstandJourneyStage[] = [
  {
    stage: 1,
    title: 'Chest-to-wall hold',
    goal: 'Build alignment, control, and shoulder strength',
    bullets: ['Target: 60 seconds of high-quality hold (tight line, active shoulders)'],
    moveOn: 'Move on when you can hold 60 seconds calmly for 1–2 sets',
    demosLink: { featureKey: 'holdOn', label: 'Chest-to-wall demo' },
  },
  {
    stage: 2,
    title: 'Heel pulls',
    goal: 'Develop balance and weight shift using small controlled lifts',
    bullets: [
      'Start with 10 × 1s heel pulls, then:',
      '2s × 8 reps',
      '3s × 7 reps',
      '4s × 6 reps',
    ],
    moveOn: 'Move on when you can do 5 solid sets of 4-second heel pulls',
    demosLink: { featureKey: 'drillDJ', label: 'Heel pulls demo' },
  },
  {
    stage: 3,
    title: 'Accumulate time off the wall in heel pulls',
    goal: 'Float away and hold balance with control',
    bullets: [
      'Target: 15 seconds average per float',
      'Progression: Accumulate 3 minutes in fewer than 10 floats',
    ],
    moveOn: 'Move on when 3-minute total feels clean and consistent',
  },
  {
    stage: 4,
    title: 'Toe pulls',
    goal: 'Learn fingertip pressure control for freestanding balance',
    bullets: [
      'Use the same protocol as heel pulls:',
      '1s × 10 reps',
      '2s × 8 reps',
      '3s × 7 reps',
      '4s × 6 reps',
    ],
    moveOn: 'Move on when 4-second toe floats feel consistent',
    demosLink: { featureKey: 'drillDJ', label: 'Toe pulls demo' },
  },
  {
    stage: 5,
    title: 'Partner spot',
    goal: 'Hold a handstand without the wall, with light support',
    bullets: [
      'The partner acts like two walls — gentle contact on both sides to reduce fatigue and build confidence',
      'Start with 20 seconds per set',
    ],
    moveOn:
      'Move on when you feel calm and stable and only rarely need your partner for a light balance touch',
  },
  {
    stage: 6,
    title: 'Freehandstand hold',
    goal: 'Perform measurable freestanding handstand holds',
    bullets: [
      'Accumulate 30–60 seconds total, then build to:',
      '3–5 sets of 30–60 second holds',
      'When you can hold 5 clean sets of 60 seconds, you have built a strong foundation — and you are ready for whatever comes next.',
    ],
    moveOn: '',
    demosLink: { featureKey: 'holdOn', label: 'Freestanding handstand demo' },
  },
]

export const HANDSTAND_JOURNEY_FOOTNOTE =
  'Progress slowly, track your sets in HandyCue, and enjoy the process. Control and confidence come with time, patience, and smart practice.'
