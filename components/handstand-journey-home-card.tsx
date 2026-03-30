import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { HANDSTAND_JOURNEY_TITLE } from '../data/handstand-journey'
import { homeSuggestionCardStyles as s } from './home-suggestion-card-styles'

const JOURNEY_CARD_IMAGE = require('../assets/imgs/handstand-journey.png')

type Props = {
  inGrid?: boolean
}

export function HandstandJourneyHomeCard({ inGrid }: Props) {
  const navigation = useNavigation<any>()

  return (
    <TouchableOpacity
      style={[s.card, inGrid && s.cardInGrid]}
      activeOpacity={0.75}
      onPress={() => navigation.navigate('HandstandJourney')}
      accessibilityRole="button"
      accessibilityLabel={`${HANDSTAND_JOURNEY_TITLE}: open progression guide`}
    >
      <Image source={JOURNEY_CARD_IMAGE} style={s.thumb} resizeMode="cover" />
      <View style={s.textCol}>
        <Text style={s.kicker}>Progression guide</Text>
        <Text style={s.title}>{HANDSTAND_JOURNEY_TITLE}</Text>
        <Text style={s.subtitle}>Chest-to-wall to free balance, with demos and links</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#5B9A8B" style={s.chevron} />
    </TouchableOpacity>
  )
}
