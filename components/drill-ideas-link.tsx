import { StyleSheet, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface DrillIdeasLinkProps {
  featureKey: 'holdOn' | 'entryBuddy' | 'shapeJam' | 'drillDJ'
}

export function DrillIdeasLink({ featureKey }: DrillIdeasLinkProps) {
  const navigation = useNavigation<any>()

  return (
    <Pressable
      onPress={() => navigation.navigate('DrillIdeas', { featureKey })}
      style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
    >
      <Text style={styles.text}>
        Want ideas for what to practice? See Drill Ideas.
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  link: {
    marginBottom: 16,
  },
  linkPressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    color: '#5B9A8B',
    textDecorationLine: 'underline',
    lineHeight: 22,
  },
})
