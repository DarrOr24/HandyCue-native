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
        CueCraft lets you create custom flows by combining get-ready countdowns, audio cues
        (with optional timers), and your own text. Add steps in any order, reorder with the grip icon
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
        "L sit" with a 15-second duration, the voice will say "L sit", run the timer, then do that
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

      <InfoSectionTitle>Audio Cue with duration</InfoSectionTitle>
      <InfoParagraph>
        Audio Cues can have a duration: enter your text (e.g. "L sit" or "Rest") and set duration
        to 0 for a quick voice cue, or to a number of seconds for a timed hold. When duration is
        greater than 0, you'll see <InfoBold>Callout every (sec)</InfoBold> — how often the voice says
        elapsed time — and <InfoBold>Countdown from</InfoBold> — when it switches to counting down (e.g. 10, 9, 8...).
      </InfoParagraph>

      <InfoSectionTitle>Reorder steps</InfoSectionTitle>
      <InfoParagraph>
        Long-press the grip icon (≡) on the left of each step, then drag to reorder. You can
        also use the up/down arrows to move steps one at a time.
      </InfoParagraph>

      <InfoSectionTitle>Example flow</InfoSectionTitle>
      <InfoParagraph>
        The default sequence is an L-sit hold routine you can use as a starting point:
      </InfoParagraph>
      <InfoParagraph>
        • <InfoBold>Get ready</InfoBold> — countdown to start{'\n'}
        • <InfoBold>Sets (2)</InfoBold> — run the whole sequence twice, with 60 seconds rest between{'\n'}
        • <InfoBold>Reps (5)</InfoBold> — L sit 15 sec → down → Rest 10 sec
      </InfoParagraph>
      <InfoParagraph>
        The voice guides you: 5 reps of L sit for 15 seconds, then down and rest for 10 seconds.
        That completes the first set. After a 60-second rest with countdown, the whole thing runs
        again for the second set.
      </InfoParagraph>
      <InfoParagraph>
        You can edit any step or add your own — try yoga poses, stretches, or strength holds.
      </InfoParagraph>
    </InfoScreenLayout>
  )
}
