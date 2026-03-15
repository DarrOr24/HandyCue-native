import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
  InfoSectionTitle,
  InfoBold,
} from '../components/info-screen-layout'

export function CueCraftInfoScreen() {
  return (
    <InfoScreenLayout title="CueCraft">
      <InfoEmphasis>
        Build your own voice-guided sequence from scratch
      </InfoEmphasis>

      <InfoParagraph>
        CueCraft lets you create custom flows by combining get-ready countdowns, timers, rest
        periods, and your own custom text. Add steps in any order, reorder with the grip icon
        (≡), and the voice will guide you through. Save your favorite sequences for quick access.
      </InfoParagraph>

      <InfoSectionTitle>Reps</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Reps</InfoBold> repeats the steps that follow it — until the next Reps or Sets —
        a set number of times, with no rest between. For example, if you put Reps (5) before
        "Tuck handstand" and a 5-second timer, the voice will say "Tuck handstand", run the timer,
        then do that again five times in a row.
      </InfoParagraph>
      <InfoParagraph>
        Use the <InfoBold>Say reps</InfoBold> toggle to choose whether the voice announces "5 reps"
        at the start. Turn it off for a smooth, flowing sequence where the voice goes straight
        into your cues without interruption.
      </InfoParagraph>

      <InfoSectionTitle>Sets</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Sets</InfoBold> repeats the steps that follow it — until the next Sets — a set
        number of times, with optional rest between each round. Sets can wrap Reps, so you can
        build complex flows like "2 sets of 5 reps each, with rest between sets".
      </InfoParagraph>
      <InfoParagraph>
        When you set 2 or more sets, you can add rest time between them. The rest phase includes
        a countdown in the last 10 seconds, just like the other HandyCue features.
      </InfoParagraph>

      <InfoSectionTitle>Example flow</InfoSectionTitle>
      <InfoParagraph>
        Here's a handstand shape flow you could build:
      </InfoParagraph>
      <InfoParagraph>
        • <InfoBold>Get ready</InfoBold> — countdown to start{'\n'}
        • <InfoBold>Sets (2)</InfoBold> — run the whole sequence twice, with rest between{'\n'}
        • <InfoBold>Reps (5)</InfoBold>, Say reps: off — Tuck handstand → Timer 5 → Straighten right leg → Timer 5{'\n'}
        • <InfoBold>Reps (5)</InfoBold> — Tuck handstand → Timer 5 → Straighten left leg → Timer 5{'\n'}
        • <InfoBold>Reps (1)</InfoBold> — Straddle handstand → Timer 30
      </InfoParagraph>
      <InfoParagraph>
        The voice will flow through: "Tuck handstand" (timer), "Straighten right leg" (timer),
        repeated 5 times, then "Tuck handstand" (timer), "Straighten left leg" (timer), repeated
        5 times, then "Straddle handstand" (30-second timer). After a rest, the whole thing runs
        again for set 2.
      </InfoParagraph>

      <InfoSectionTitle>Reorder steps</InfoSectionTitle>
      <InfoParagraph>
        Long-press the grip icon (≡) on the left of each step, then drag to reorder. You can
        also use the up/down arrows to move steps one at a time.
      </InfoParagraph>
    </InfoScreenLayout>
  )
}
