/**
 * Drill ideas content for each feature.
 * Used by the Drill Ideas screen.
 */

export type DrillIdeasFeatureKey = 'holdOn' | 'entryBuddy' | 'shapeJam' | 'drillDJ'

export type DrillIdeasSection = {
  title?: string
  content: string
  items?: string[]
  subItems?: string[]
  /** When true, renders as a major section divider (e.g. Slide Drills, Float Drills) */
  majorSection?: boolean
}

export type DrillIdeasConfig = {
  title: string
  intro: string
  sections: DrillIdeasSection[]
}

export const DRILL_IDEAS: Record<DrillIdeasFeatureKey, DrillIdeasConfig> = {
  holdOn: {
    title: 'HoldOn',
    intro: 'Build endurance with a variety of holds — use HoldOn to practice control, time under tension, and body awareness.',
    sections: [
      {
        title: 'Chest-to-Wall Handstand Hold',
        content: 'Builds control, shoulder strength, and spatial awareness. Facing the wall encourages correct alignment.',
      },
      {
        title: 'Back-to-Wall Handstand Hold',
        content: 'Builds time under tension and teaches how to manage balance near the wall.',
      },
      {
        title: 'Freestanding Handstand Hold',
        content: 'Practice tuck, straight, or straddle shapes to improve control and balance.',
      },
      {
        title: 'Plank Hold Variations',
        content: 'Strengthen core and shoulder endurance with straight-arm or forearm planks.',
      },
      {
        title: 'Passive Hang',
        content: 'Supports grip strength, shoulder mobility, and recovery after handstand training.',
      },
    ],
  },
  entryBuddy: {
    title: 'EntryBuddy',
    intro: 'Refine your handstand entries with EntryBuddy — use the timer to practice control, timing, and alignment. Tempo-based entry practice is the handstander\'s cardio.',
    sections: [
      {
        content: 'Mastering various entry types builds coordination, strength, and confidence in your transitions into a handstand.',
        title: 'Why Practice Entries',
      },
      {
        title: 'Standing Entries',
        content: 'Best place to start. Offers more momentum and control for beginners.',
        items: ['Right-leg kick-up', 'Left-leg kick-up', 'Tuck entry', 'Straddle entry', 'Pike entry'],
      },
      {
        title: 'Kneeling Entries',
        content: 'Adds a challenge due to lower base and more compression demand.',
        items: ['Tuck entry from kneeling', 'Straddle entry from kneeling', 'Pike entry from kneeling'],
      },
      {
        title: 'Press-Up Entries',
        content: 'The most advanced type of entry, requiring full-body integration, strength, and control.',
        items: ['Straddle press', 'Tuck press', 'Pike press', 'Stalder press (advanced)'],
      },
      {
        title: 'Progression Suggestion',
        content: 'Start with standing entries → add kneeling entries → challenge yourself with press-ups.',
      },
    ],
  },
  shapeJam: {
    title: 'ShapeJam',
    intro:
      'Create your own flow with ShapeJam — a timer for moving between classic handstand shapes while building control, consistency, and endurance. Pick your shapes, set an interval for each row, choose whether you want Voice count (same style as Drill DJ), and let the cues guide you. Shuffle mode (when every interval matches) keeps the order unpredictable. ShapeJam is also a natural fit for group routines — everyone on the same timed sequence with other handstanders.',
    sections: [
      {
        content: 'ShapeJam is about clean, consistent, time-accurate segments — whether you hold a shape or use the time to transition.',
        items: [
          'Choose 2–4 shapes (avoid starting and ending with the same shape)',
          'Set an interval per shape (seconds)',
          'Turn Voice count on for spoken countdown on longer intervals, or off for quiet timing',
          'Repeat the sequence for reps or sets',
          'Let the cue guide you',
        ],
      },
      {
        title: 'Shuffle surprise drill',
        content:
          'Pick several shapes, make every interval the same (use Same interval), then turn on Shuffle. The app calls shapes in random order and never the same shape twice in a row — so you practice responding to the cue instead of anticipating the next shape. Great when you know the movements but want a little chaos.',
      },
      {
        title: 'Group routine',
        content:
          'Training with other handstanders? Build one sequence in ShapeJam and run it together — everyone hears the same voice cues on the same clock, so you stay coordinated without counting each other in. Handy for partner or small-group sessions where you want one shared rhythm.',
      },
      {
        title: 'Slow counted shape transitions',
        content:
          'Slow counted shape transitions build control and endurance through every stage of the movement, not just the final shape. They help you move with precision and learn to pause with strength in each position along the way.',
        items: [
          'Example: straddle → straight with a 10 second interval — use the interval to complete the transition with control; Voice count matches Drill DJ rules on longer segments.',
          'Builds control in the transitions, not only in the end shape.',
        ],
      },
      {
        title: 'Sample sequences',
        items: ['Tuck → Diamond → Straddle', 'Straddle → Pike → Tuck', 'Diamond → Straight → Straddle → Tuck'],
      },
      {
        content:
          'Experiment with tempo: longer intervals for strength and shape quality, shorter ones for coordination and quick switches. For fully custom steps and wording, use CueCraft.',
      },
    ],
  },
  drillDJ: {
    title: 'DrillDJ',
    intro: '',
    sections: [
      {
        title: 'Slide Drills',
        content: 'Build control, compression, and body line precision with slow, deliberate leg slides using the DrillDJ timer.',
        majorSection: true,
      },
      {
        title: 'Why Slide Drills',
        content: "These drills develop strength, hip flexor engagement, and spatial awareness. They're excellent for improving entries, float transitions, and cultivating a clean, stacked handstand line.",
      },
      {
        title: 'Tuck Slides',
        items: ['Chest-to-wall tuck slide', 'Freestanding tuck slide', 'Plank tuck slide', 'Hanging tuck slide'],
      },
      {
        title: 'Pike Slides',
        items: ['Chest-to-wall pike slide', 'Freestanding pike slide', 'Plank pike slide', 'Hanging pike slide'],
      },
      {
        title: 'Progression Suggestion',
        content: 'Start with chest-to-wall for support, then move to freestanding. Use plank and hanging drills to isolate core and shoulder control.',
      },
      {
        title: 'Float Drills',
        content: 'Float drills teach how to reduce reliance on the wall and discover balance through controlled weight shifting. They develop core compression, shoulder push, and body awareness without using momentum.',
        majorSection: true,
      },
      {
        title: 'L-Shaped Float Drill',
        content: 'Performed with the wall or some high surface. Focus on shifting forward while keeping one leg low and the other stacked. Great for building awareness in asymmetrical positions.',
      },
      {
        title: 'Toe Pulls',
        content: 'Pull toes off the wall by pressing through the fingertips. Trains delicate balance adjustments and strengthens finger control.',
      },
      {
        title: 'Heel Pulls',
        content: 'Shift hips and body forward until the heels float away. Builds awareness of core engagement, shoulder position, and body stacking.',
      },
      {
        title: 'Back-Facing Wall Open Tuck Float',
        content: 'Begin in tuck against the wall and float off while maintaining shape. Combines compression, alignment, and timing in a compact form.',
      },
      {
        title: 'Switch Drills',
        content: 'Use the DrillDJ timer to train control and rhythm as you switch between legs, shapes, or weight-bearing sides during a handstand.',
        majorSection: true,
      },
      {
        title: 'Why Switch Drills',
        content: "These drills build coordination, timing, and control during movement — not just static holds. They help you break symmetry, learn to adjust mid-air, and develop the dynamic awareness needed for advanced entries, presses, and transitions.",
      },
      {
        title: 'Handstand Switch Drills',
        items: [
          'Front- or back-facing wall switch drill – switch legs off the wall one at a time with subtle hip shifts',
          'L-shape switch drills – free balance or with the wall',
          'One arm drills',
          'Flags (side bends)',
        ],
      },
      {
        title: 'Hanging Switch Drills',
        items: ['Hanging L-shaped switch drill – performed from a bar or rings, alternating leg positions to build control and symmetry awareness'],
      },
      {
        title: 'Ground-Based Switch Drills',
        items: [
          'Plank single-leg tuck switch – builds entry mechanics, compression, and quick weight transfer from a grounded setup',
        ],
      },
    ],
  },
}
