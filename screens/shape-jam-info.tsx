import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoBold,
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
        ShapeJam runs a sequence of handstand shapes on a timer. For each shape you set an{' '}
        <InfoBold>interval</InfoBold> — how long that segment lasts before the next cue. You can use
        intervals for a clean hold in one shape, or for a slow, counted transition into the next (see{' '}
        <InfoBold>ShapeJam – Drill ideas</InfoBold> for examples).
      </InfoParagraph>

      <InfoParagraph>
        <InfoBold>Voice count</InfoBold> uses the same spoken timing rules as Drill DJ: when it is on
        and an interval is at least five seconds, you get the same countdown style (including the “last ten
        seconds” style behavior on longer intervals). Turn it off if you only want the shape name and then
        quiet timing — useful for very short switches where you do not want numbers in your ear.
      </InfoParagraph>

      <InfoParagraph>
        <InfoBold>Same interval</InfoBold> copies <InfoBold>Interval 1</InfoBold> (the time for your first
        shape) to every other shape in the list. Use it when you want every segment the same length without
        tapping each interval field.
      </InfoParagraph>

      <InfoParagraph>
        Add reps or sets, rest between sets when you use multiple sets, and customize shape names in
        settings. The app speaks each shape, then runs the interval — so your transitions stay deliberate
        and on the clock.
      </InfoParagraph>

      <InfoParagraph>
        The feature strengthens the link between verbal cue and movement: little time to drift between
        shapes, so transitions stay controlled and intentional.
      </InfoParagraph>

      <InfoParagraph>
        Focus on precision, rhythm, and flow — whether you are training symmetry, creativity, or advanced
        transitions.
      </InfoParagraph>

      <DemosLink featureKey="shapeJam" />
      <DrillIdeasLink featureKey="shapeJam" />
    </InfoScreenLayout>
  )
}
