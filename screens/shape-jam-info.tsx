import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
} from '../components/info-screen-layout'
import { DemosLink } from '../components/demos-link'
import { DrillIdeasLink } from '../components/drill-ideas-link'

export function ShapeJamInfoScreen() {
  return (
    <InfoScreenLayout title="ShapeJam">
      <InfoEmphasis>
        Your voice-guided shape flow builder
      </InfoEmphasis>

      <InfoParagraph>
        ShapeJam guides you through dynamic handstand shape transitions using voice prompts and timed holds.
        Select your shapes (like tuck, straddle, pike), assign hold times, and build your own sequence.
        You can add your own shape names through settings to customize the flow to your practice.
      </InfoParagraph>

      <InfoParagraph>
        The feature gives clear voice cues — helping you build a strong connection between verbal command and physical action.
        Because there's no time to prepare between shapes, your transitions become more controlled, intentional, and refined.
      </InfoParagraph>

      <InfoParagraph>
        Focus on precision, rhythm, and flow — whether you're training symmetry, creativity, or advanced transitions.
      </InfoParagraph>

      <DemosLink featureKey="shapeJam" />
      <DrillIdeasLink featureKey="shapeJam" />
    </InfoScreenLayout>
  )
}
