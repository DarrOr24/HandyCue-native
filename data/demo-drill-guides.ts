export type DemoDrillGuideSection = {
  heading: string
  bullets?: string[]
  /** Optional titled blocks (e.g. progression stages). */
  blocks?: Array<{ title: string; lines: string[] }>
}

export type DemoDrillGuide = {
  /** Short title for the nav header */
  pageTitle: string
  intro: string
  sections: DemoDrillGuideSection[]
  summary?: string
}

export const DEMO_DRILL_GUIDES: Record<string, DemoDrillGuide> = {
  heelPulls: {
    pageTitle: 'Heel pulls',
    intro:
      'Heel pulls are a foundational drill for building control, balance, and weight-shifting awareness in handstand. Practiced with your back to the wall, this drill helps you transition from passive wall reliance to active balance using subtle fingertip engagement.',
    sections: [
      {
        heading: 'Key benefits',
        bullets: [
          'Teaches weight shift and timing for balance',
          'Builds strength in fingers, shoulders, and core',
          'Develops proprioception and subtle correction skills',
          'Bridges the gap between wall drills and free balancing',
        ],
      },
      {
        heading: 'Technique & tips',
        bullets: [
          'Start about 1–1.5 hands away from the wall',
          'Hands 15–20 cm from the wall, fingers spread ~80%',
          'Index fingers parallel and pointing forward',
          'Shoulders elevated, core engaged, legs active',
          'Pull chest and shoulders slightly off the wall before initiating',
          'Use fingertip pressure to lift off gently — just enough to hover',
          'As soon as heels leave the wall, release excess finger pressure',
          'If returning toward the wall, gently press again to rebound outward',
          'Repeat small forward/back adjustments until balance stabilizes',
        ],
      },
      {
        heading: 'Form & progressions',
        blocks: [
          {
            title: 'Stage 1 – Controlled touch-and-go',
            lines: ['10 reps × 1-second float, return to wall between each'],
          },
          {
            title: 'Stage 2 – Increasing float time',
            lines: [
              '2 seconds × 8 reps',
              '3 seconds × 7 reps',
              '4 seconds × 6 reps',
              '(Optional) 5 sec × 5 reps → 6 sec × 4 → 7 sec × 3',
            ],
          },
          {
            title: 'Stage 3 – Accumulated hold',
            lines: [
              'Target: 15 seconds average per float',
              'Progression: Accumulate 3 minutes in under 10 floats',
              'Goal: Calm, steady balance with minimal adjustments',
            ],
          },
        ],
      },
      {
        heading: 'Common pitfalls',
        bullets: [
          'Rushing off the wall without stacking',
          'Over-pressing with the fingers, causing a fall',
          'Arching the back or passive shoulders',
          'Holding tension in the legs or neck unnecessarily',
        ],
      },
    ],
    summary:
      'Heel pulls teach you to control your balance, not just survive it. By mastering this drill, you gain the awareness and finger control needed to transition from wall support to confident freestanding handstands.',
  },
  toePulls: {
    pageTitle: 'Toe pulls',
    intro:
      'Toe pulls are an essential drill for developing fingertip control and precise weight management. Performed facing the wall, this drill simulates freestanding handstand balance by teaching how to shift the center of gravity using only subtle finger and palm pressure.',
    sections: [
      {
        heading: 'Key benefits',
        bullets: [
          'Develops fingertip pressure control',
          'Builds fine-tuned balance adjustments',
          'Bridges the gap between wall and freestanding handstands',
          'Deepens body awareness and weight distribution sensitivity',
        ],
      },
      {
        heading: 'Technique & tips',
        bullets: [
          'Start in a chest-to-wall handstand with toes gently touching the wall',
          'Slowly shift the center of gravity forward using your fingers',
          'Initiate the pull by releasing toe pressure—not by kicking off',
          'Apply just enough fingertip push to create a small gap from the wall',
          'As toes lift, maintain vertical alignment and active shoulders',
          'Use alternating pressure and release to rebalance if drifting',
          'Aim for smooth exits and returns to the wall as needed',
        ],
      },
      {
        heading: 'Form & progressions',
        blocks: [
          {
            title: 'Stage 1 – Short controlled floats',
            lines: ['10 reps × 1 second each'],
          },
          {
            title: 'Stage 2 – Gradual time increase',
            lines: [
              '8 reps × 2 seconds',
              '7 reps × 3 seconds',
              '6 reps × 4 seconds',
              '(Optional) 5 sec × 5 reps → 6 sec × 4 → 7 sec × 3',
            ],
          },
          {
            title: 'Stage 3 – Accumulated hold',
            lines: [
              'Target: 15 seconds average per float',
              'Progression: Accumulate 3 minutes in under 10 floats',
              'Goal: Calm, steady balance with minimal adjustments',
            ],
          },
        ],
      },
      {
        heading: 'Progress tip',
        bullets: [
          'Most students progress quickly at this stage due to improved awareness and control from earlier drills.',
        ],
      },
      {
        heading: 'Common pitfalls',
        bullets: [
          'Kicking off the wall instead of using finger pressure',
          'Collapsing shoulders or core when toes leave the wall',
          'Overcorrecting with fingers, causing loss of balance',
          'Holding breath or tensing up unnecessarily',
        ],
      },
    ],
    summary:
      'Toe pulls train the subtle, powerful control needed for freestanding handstands. By learning to manage balance through fingertip adjustments, you gain the precision and confidence needed to float away from the wall — one toe at a time.',
  },
  chestToWallHold: {
    pageTitle: 'Chest-to-wall hold',
    intro:
      'Chest-to-wall handstand is a key drill for building control, shoulder strength, and spatial awareness. Facing the wall encourages correct alignment with minimal risk.',
    sections: [
      {
        heading: 'Key benefits',
        bullets: [
          'Teaches gradual weight shift onto the hands',
          'Promotes correct alignment of hips, shoulders, and legs',
          'Strengthens shoulders, core, and wrists',
          'Builds proprioception and micro-adjustment skill',
        ],
      },
      {
        heading: 'Technique & tips',
        bullets: [
          'Hand placement: 1–1.5 palms away from the wall — not too close to avoid pushing off, not too far to lose alignment',
          'Gaze: Slightly forward toward the floor (around thumbs). Avoid extreme angles that strain the neck',
          'Fingers & shoulders: Spread fingers, press through palm center. Keep elbows locked and shoulders elevated (not passive)',
        ],
      },
      {
        heading: 'Form & alignment',
        bullets: [
          'Shoulders stacked over wrists',
          'Core and glutes engaged (posterior pelvic tilt)',
          'Legs together, tight and pointed',
          'Calm breathing throughout',
        ],
      },
      {
        heading: 'Suggested hold times',
        bullets: [
          'Beginner: 10–20 seconds × 3–5 sets',
          'Intermediate: 30–45 seconds × 3–5 sets',
          'Advanced: 60+ seconds × 2–3 sets, with focus on stillness and breath',
        ],
      },
      {
        heading: 'Exit strategy',
        bullets: [
          'Step one leg down or reverse the entry slowly',
          'Practice smooth, controlled dismounts for safety and confidence',
        ],
      },
      {
        heading: 'Common pitfalls',
        bullets: [
          'Arching the back',
          'Wide or bent legs',
          'Shoulders not fully elevated',
          'Overusing the neck',
          'Disengaged core',
        ],
      },
      {
        heading: 'Pro tips',
        bullets: [
          'Gently activate glutes to protect the lower back',
          'Use diaphragmatic breathing for balance and focus',
          'Fingers are your brakes — apply pressure when tipping forward',
        ],
      },
    ],
    summary:
      'Chest-to-wall is one of the most effective tools for building a strong, aligned, and confident handstand. Mastering this drill will carry over into every other part of your handstand practice.',
  },
  mixedStandingEntries: {
    pageTitle: 'Mixed standing entries',
    intro:
      'The kick-up is the most common entry into a freestanding handstand. It builds coordination, timing, and alignment between the hands, shoulders, core, and legs. Once the basics are established, progressions refine awareness, balance, and efficiency — leading to smoother, quieter, and more consistent entries.',
    sections: [
      {
        heading: 'Key benefits',
        bullets: [
          'Teaches the mechanics of entering handstand',
          'Develops strength in shoulders, core, and wrists',
          'Improves awareness of balance and weight transfer',
          'Builds versatility with variations like straddle, tuck, and pike',
        ],
      },
      {
        heading: 'Hand placement & arm engagement',
        bullets: [
          'Hands shoulder-width apart (slightly wider if needed)',
          'Index fingers parallel and pointing forward',
          'Spread fingers, press actively through palms and fingertips',
          'Lock elbows straight and rotate arms outward (elbows point back)',
          'Keep arms strong — they bear most of the load',
        ],
      },
      {
        heading: 'Shoulders & core',
        bullets: [
          'Elevate shoulders (“shrug”) and add slight protraction for stability',
          'Cue: “Push the floor as hard as you can!”',
          'Engage the core — close the ribs and maintain a slight pelvic tuck',
          'Prevents over-arching in the lower back',
        ],
      },
      {
        heading: 'Hip transfer & leg action',
        bullets: [
          'Lean slightly forward so hips can stack over shoulders',
          'Bottom leg: controlled push off the floor (think “press,” not “kick”)',
          'Top leg: guides the line smoothly — avoid wild swinging',
          'Both legs work together in a coordinated lift',
        ],
      },
      {
        heading: 'Balancing in the catch',
        bullets: [
          'As hips stack, let the legs rise with control',
          'Avoid over-kicking — use wrists and fingertips for micro-corrections',
          'Focus on a soft, stable arrival in handstand',
        ],
      },
      {
        heading: 'Progressions: refinement & awareness',
        bullets: [
          'Weight distribution: shift smoothly from feet → hands',
          'Quiet landings: absorb with core and bent knee, land softly like a spring',
          'Drill: partner calls a landing spot — aim to land quietly exactly there',
        ],
      },
      {
        heading: 'Entry variations',
        bullets: [
          'Switch-leg kick-up — push from one leg, switch in mid-air before stabilizing',
          'Straddle kick-up — legs open wide, easiest entry, great for control',
          'Tuck kick-up — knees to chest, requires strong shoulder elevation and core compression',
          'Pike kick-up — legs straight together, hardest due to leverage; hips must stack before opening',
        ],
      },
      {
        heading: 'Common pitfalls',
        bullets: [
          'Over-swinging top leg — focus on bottom leg push + controlled top leg guide',
          'Collapsing shoulders or bent elbows — lock out arms, elevate scapula',
          'Over-arching lower back — engage core, close ribs',
          'Heavy, noisy landings — absorb softly, control descent',
        ],
      },
      {
        heading: 'Pro tips',
        bullets: [
          'Think of the kick-up as placing yourself into handstand, not throwing yourself',
          'Train “quiet exits and landings” as much as the entry itself',
          'Explore straddle/tuck before pike — build control step by step',
        ],
      },
    ],
    summary:
      'Kick-up is the gateway to freestanding handstands. By refining hand placement, shoulder strength, and core engagement, you’ll learn to enter with confidence. Progressions like straddle, tuck, and pike variations add precision and versatility, transforming the kick-up from a lucky jump into a reliable, repeatable entry.',
  },
  freeBalanceHold: {
    pageTitle: 'Free balance',
    intro:
      'This is the ultimate goal of your foundational handstand training: holding a freestanding handstand with no assistance. Free balance marks the shift from accumulation-based floats to deliberate, measured sets — showing real control.',
    sections: [
      {
        heading: 'Key benefits',
        bullets: [
          'Tests full-body alignment and endurance',
          'Develops consistency and calm under pressure',
          'Builds trust in your own balance reactions',
          'Prepares the body and mind for advanced handstand work',
        ],
      },
      {
        heading: 'Technique & tips',
        bullets: [
          'Start from your strongest entry (kick-up, press, or partner assist)',
          'Aim to find stillness quickly — avoid constant micro-movements',
          'Focus on breathing and soft gaze — eyes fix on one spot',
          'Hands remain active, but pressure shifts should feel minimal',
          'Use your core and glutes for subtle shape control',
        ],
      },
      {
        heading: 'Form & alignment',
        bullets: [
          'Shoulders, hips, and heels in one vertical line',
          'Fingers gently adjusting — not gripping or pushing',
          'Soft gaze, steady breath, calm transitions',
        ],
      },
      {
        heading: 'Suggested hold times',
        bullets: [
          'Beginner: Accumulate 30–60 seconds total (in 3–5 attempts)',
          'Intermediate: 3–5 sets × 30 seconds',
          'Advanced: 3–5 sets × 60 seconds in clean, aligned form',
          'Benchmark for mastery: 5 sets of 60 seconds in clean, aligned form',
        ],
      },
      {
        heading: 'Common pitfalls',
        bullets: [
          'Relying on speed or momentum in the entry',
          'Overusing the fingers or constantly correcting',
          'Losing shape integrity (arching, banana back, soft shoulders)',
          'Giving up on balance too early',
        ],
      },
    ],
    summary:
      'Free balance is where training meets freedom. When you can hold steady handstands without the wall, even for 30–60 seconds, you’ve earned access to the world of advanced inversions — from presses to transitions to one-arm work.',
  },
}
