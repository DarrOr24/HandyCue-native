import { StyleSheet, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface ExampleVideosLinkProps {
  featureKey: 'holdOn' | 'entryBuddy' | 'shapeJam' | 'drillDJ' | 'cueCraft'
}

export function ExampleVideosLink({ featureKey }: ExampleVideosLinkProps) {
  const navigation = useNavigation<any>()

  return (
    <Pressable
      onPress={() => navigation.navigate('ExampleVideos', { featureKey })}
      style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
    >
      <Text style={styles.text}>
        Check out the example videos to see this feature in action.
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
    fontSize: 17,
    color: '#5B9A8B',
    textDecorationLine: 'underline',
    lineHeight: 24,
  },
})
