import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
  InfoSectionTitle,
  InfoBold,
} from '../components/info-screen-layout'
import { DemosLink } from '../components/demos-link'
import { DrillIdeasLink } from '../components/drill-ideas-link'

export function DrillDJInfoScreen() {
  return (
    <InfoScreenLayout title="DrillDJ">
      <InfoEmphasis>
        Your voice-guided, tempo-driven handstand drill companion
      </InfoEmphasis>

      <InfoParagraph>
        DrillDJ guides you through handstand drills with audio prompts and timed cues.
        There are three kinds of drills, each with its own rhythm and focus.
      </InfoParagraph>

      <InfoSectionTitle>The three drills</InfoSectionTitle>
      <InfoParagraph>
        <InfoBold>Slide</InfoBold> — Slide down (timed), hold, then slide up. You control slide-down time, hold time, and slide-up time separately. Great for controlled wall slides and L-shapes.
      </InfoParagraph>
      <InfoParagraph>
        <InfoBold>Float</InfoBold> — Float for a set duration, then return. The voice says "Return" and you have time between floats to reset. Builds float control and consistency.
      </InfoParagraph>
      <InfoParagraph>
        <InfoBold>Switch</InfoBold> — Hold, then switch. Ideal for one-arm prep: time your hold on each hand accurately. Adjust time between switches and switch duration to match your practice.
      </InfoParagraph>

      <InfoSectionTitle>More cues</InfoSectionTitle>
      <InfoParagraph>
        For Slide and Float, you can add extra cues after the main reps. Choose "Switch legs" to do additional reps on one leg at a time, or "Both legs" for reps on both legs. You can chain them — e.g. switch legs for a few reps, then both legs for a few more. This helps balance training and adds variety without changing your main drill.
      </InfoParagraph>

      <InfoParagraph>
        The feature gives clear voice commands — helping you build control by responding to external cues.
        This strengthens your timing, sharpens transitions, and removes the mental delay between decision and action.
      </InfoParagraph>

      <InfoParagraph>
        Enable Voice count to hear the count spoken aloud during longer phases — keeping your rhythm consistent.
      </InfoParagraph>

      <DemosLink featureKey="drillDJ" />
      <DrillIdeasLink featureKey="drillDJ" />
    </InfoScreenLayout>
  )
}
