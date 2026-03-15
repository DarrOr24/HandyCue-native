import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
} from '../components/info-screen-layout'
import { ExampleVideosLink } from '../components/example-videos-link'

export function CueCraftInfoScreen() {
  return (
    <InfoScreenLayout title="CueCraft">
      <InfoEmphasis>
        Build your own voice-guided sequence from scratch
      </InfoEmphasis>

      <InfoParagraph>
        CueCraft lets you create custom flows by combining get-ready countdowns, timers, rest
        periods, and your own custom text. Use Reps to repeat a group of steps (e.g. “Ariel count
        till 10” + Timer) multiple times. Use Sets to do the same with rest between each round.
        Add steps in any order, reorder with the grip icon, and the voice will guide you through.
      </InfoParagraph>

      <InfoParagraph>
        Save your favorite sequences for quick access. Perfect for handstand flows, conditioning
        circuits, or any drill where you want full control over the structure and wording.
      </InfoParagraph>

      <InfoParagraph>
        To reorder steps: long-press the grip icon (≡) on the left of each step, then drag.
      </InfoParagraph>

      <ExampleVideosLink featureKey="cueCraft" />
    </InfoScreenLayout>
  )
}
