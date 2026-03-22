import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
} from '../components/info-screen-layout'
import { ExampleVideosLink } from '../components/example-videos-link'
import { DrillIdeasLink } from '../components/drill-ideas-link'

export function EntryBuddyInfoScreen() {
  return (
    <InfoScreenLayout title="EntryBuddy">
      <InfoEmphasis>
        Your smart handstand entry counter
      </InfoEmphasis>

      <InfoParagraph>
        EntryBuddy guides you through handstand entries with precision and timing.
        Set your reps, interval between reps, sets, rest time, and hold times — and train with structure and flow.
      </InfoParagraph>

      <InfoParagraph>
        The feature gives clear voice cues — helping you build a strong connection between verbal
        command and physical action. Because there's no time to mentally prepare before each rep,
        you train sharper control, rhythm, and precision.
      </InfoParagraph>

      <InfoParagraph>
        Perfect for refining entry styles such as kick-ups, tucks, straddles, or pike entries —
        all with consistent timing and structured rest between sets.
        Get creative with slow press entries, kneeling entries, and more.
      </InfoParagraph>

      <ExampleVideosLink featureKey="entryBuddy" />
      <DrillIdeasLink featureKey="entryBuddy" />
    </InfoScreenLayout>
  )
}
