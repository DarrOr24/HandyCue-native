import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
} from '../components/info-screen-layout'
import { DemosLink } from '../components/demos-link'
import { DrillIdeasLink } from '../components/drill-ideas-link'

export function HoldOnInfoScreen() {
  return (
    <InfoScreenLayout title="HoldOn">
      <InfoEmphasis>
        Your voice-guided counter for balance and endurance holds
      </InfoEmphasis>

      <InfoParagraph>
        A hands-free timer for static holds like chest-to-wall or freestanding handstands.
        Set prep and hold durations, choose your voice style, and get smart audio callouts
        — at your chosen interval and halfway — to stay focused and fully present.
        You can accurately time your holds and rest in betweens.
      </InfoParagraph>

      <InfoParagraph>
        Also great for plank holds, passive hangs, or any other endurance-based position!
      </InfoParagraph>

      <DemosLink featureKey="holdOn" />
      <DrillIdeasLink featureKey="holdOn" />
    </InfoScreenLayout>
  )
}
