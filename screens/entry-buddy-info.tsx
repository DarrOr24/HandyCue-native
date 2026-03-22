import {
  InfoScreenLayout,
  InfoEmphasis,
  InfoParagraph,
  InfoBold,
} from "../components/info-screen-layout";
import { ExampleVideosLink } from "../components/example-videos-link";
import { DrillIdeasLink } from "../components/drill-ideas-link";

export function EntryBuddyInfoScreen() {
  return (
    <InfoScreenLayout title="EntryBuddy">
      <InfoEmphasis>Your smart handstand entry counter.</InfoEmphasis>

      <InfoParagraph>
        EntryBuddy cues you up and down with clear voice prompts. Set{" "}
        <InfoBold>hold time</InfoBold> (how long you stay up),{" "}
        <InfoBold>interval</InfoBold> (time before the next rep),{" "}
        <InfoBold>reps</InfoBold>, and <InfoBold>sets</InfoBold> to match your
        practice.
      </InfoParagraph>

      <InfoParagraph>
        The feature gives clear voice cues — helping you build a strong
        connection between verbal command and physical action. Because there's
        no time to mentally prepare before each rep, you train sharper control,
        rhythm, and precision.
      </InfoParagraph>

      <InfoParagraph>
        Perfect for refining entry styles such as kick-ups, tucks, straddles, or
        pike entries — all with consistent timing and structured rest between
        sets. Get creative with slow press entries, kneeling entries, and more.
      </InfoParagraph>

      <InfoEmphasis>
        Handstand entries are the handstander's cardio — keep them paced
        accurately.
      </InfoEmphasis>

      <ExampleVideosLink featureKey="entryBuddy" />
      <DrillIdeasLink featureKey="entryBuddy" />
    </InfoScreenLayout>
  );
}
