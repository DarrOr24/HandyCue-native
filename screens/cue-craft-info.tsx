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
      <InfoParagraph>
        While HandyCue is built for handstands, CueCraft can be used for many things — yoga flows,
        stretching routines, strength circuits, meditation, or any activity where you want voice-guided
        timing and cues.
      </InfoParagraph>

      <InfoSectionTitle>Reps</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Reps</InfoBold> repeats the steps that follow it — until the next Reps or Sets —
        a set number of times, with no rest between. For example, if you put Reps (5) before
        "L sit" and a 15-second timer, the voice will say "L sit", run the timer, then do that
        again five times in a row.
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
        When you set 2 or more sets, you can add rest time between them. Use <InfoBold>Say countdown</InfoBold> to
        choose whether the voice announces the countdown in the last 10 seconds — turn it off for
        short rests where it can be annoying.
      </InfoParagraph>

      <InfoSectionTitle>Timer callouts</InfoSectionTitle>
      <InfoParagraph>
        Timer steps let you set <InfoBold>Callout every (sec)</InfoBold> — how often the voice says
        elapsed time during the hold (e.g. every 10 seconds: "10", "20", "30"...). Set it to
        <InfoBold>No</InfoBold> for no callouts during the hold; you'll only hear the countdown at the end.
      </InfoParagraph>
      <InfoParagraph>
        Callouts only happen before the countdown starts. <InfoBold>Countdown from</InfoBold> sets when
        the voice switches to counting down (e.g. 10, 9, 8...). For short holds (24 seconds or less), the default is no callout — the hold is brief enough that
        the countdown is all you need. For holds of 25 seconds and above, the default is every 10 seconds.
      </InfoParagraph>

      <InfoSectionTitle>Example flow</InfoSectionTitle>
      <InfoParagraph>
        The default sequence is an L-sit hold routine you can use as a starting point:
      </InfoParagraph>
      <InfoParagraph>
        • <InfoBold>Get ready</InfoBold> — countdown to start{'\n'}
        • <InfoBold>Sets (2)</InfoBold> — run the whole sequence twice, with 60 seconds rest between{'\n'}
        • <InfoBold>Reps (5)</InfoBold>, Say reps: off — L sit → Timer 15 → down → Rest 10
      </InfoParagraph>
      <InfoParagraph>
        The voice guides you: "L sit" (15-second hold), "down" (10-second rest), repeated 5 times.
        That completes set 1. After a 60-second rest with countdown, the whole thing runs again
        for set 2. You can edit any step or add your own — try yoga poses, stretches, or strength
        holds.
      </InfoParagraph>

      <InfoSectionTitle>Reorder steps</InfoSectionTitle>
      <InfoParagraph>
        Long-press the grip icon (≡) on the left of each step, then drag to reorder. You can
        also use the up/down arrows to move steps one at a time.
      </InfoParagraph>
    </InfoScreenLayout>
  )
}
