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
        CueCraft lets you create custom flows by combining get-ready countdowns and audio cues
        (your own text with optional timers). Add steps in any order, reorder with the grip icon
        (≡), and the voice will guide you through. Save your favorite sequences for quick access.
      </InfoParagraph>
      <InfoParagraph>
        Like in regular training, we have sets and reps.
      </InfoParagraph>

      <InfoSectionTitle>Reps</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Reps</InfoBold> are repetitions of an exercise — you can have several different
        exercises with different rep numbers in a sequence. Reps repeat the steps below it the number
        of times you choose. For example, Reps (5) before "L sit" and "V snap" will run those two
        cues five times in a row.{'\n'}
        Use the <InfoBold>Say reps</InfoBold> toggle to choose whether the voice announces "5 reps"
        at the start. Turn it off for a smooth, flowing sequence.
      </InfoParagraph>

      <InfoSectionTitle>Sets</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Sets</InfoBold> repeat the whole sequence. Between sets, you can set your rest —
        the recovery time. When you set 2 or more sets, you can add rest time between them.{'\n'}
        Use <InfoBold>Say countdown</InfoBold> to choose whether the voice calls out the countdown
        in the final seconds of rest.
      </InfoParagraph>

      <InfoSectionTitle>Audio Cue</InfoSectionTitle>
      <InfoParagraph>
        Audio Cues can have a duration: enter your text (e.g. "L sit" or "Hollow body") and set
        duration to 0 for a quick voice cue, or to a number of seconds for a timed hold. When
        duration is greater than 0, you'll see <InfoBold>Callout every (sec)</InfoBold> — how often
        the voice says elapsed time — and <InfoBold>Countdown from</InfoBold> — when it switches to
        counting down (e.g. 10, 9, 8...).
      </InfoParagraph>

      <InfoSectionTitle>Reorder steps</InfoSectionTitle>
      <InfoParagraph>
        Long-press the grip icon (≡) on the left of each step, then drag to reorder. You can
        also use the up/down arrows to move steps one at a time.
      </InfoParagraph>

      <InfoSectionTitle>Example flow</InfoSectionTitle>
      <InfoParagraph>
        A conditioning drill with V snap and L sit:{'\n'}
        • Get ready countdown{'\n'}
        • 2 sets with 60 seconds rest between{'\n'}
        • 5 reps:{'\n'}
        {'   '}– 1st position: Hollow body (duration 0){'\n'}
        {'   '}– 2nd position: V snap (duration 0){'\n'}
        {'   '}– 3rd position: L sit (duration 3){'\n'}
        {'   '}– 4th position: V snap (duration 0)
      </InfoParagraph>
      <InfoParagraph>
        The voice guides you through 5 reps of hollow body → V snap → L sit (3 sec) → V snap.
        That completes the first set. After a 60-second rest with countdown, the whole thing runs
        again for the second set.
      </InfoParagraph>
      <InfoParagraph>
        In CueCraft you can edit any step and/or add your own. Be creative — especially useful for{' '}
        <InfoBold>conditioning exercises</InfoBold>.
      </InfoParagraph>
    </InfoScreenLayout>
  )
}
