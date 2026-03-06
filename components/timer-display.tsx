import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface TimerDisplayProps {
  content?: string | React.ReactNode | null
}

export function TimerDisplay({ content }: TimerDisplayProps) {
  const isEmpty = content === null || content === undefined || content === ''

  return (
    <View style={styles.watchCell}>
      <View style={styles.inner}>
        {isEmpty ? (
          <Ionicons name="timer-outline" size={48} color="#5B9A8B" />
        ) : typeof content === 'string' ? (
          <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
          {content}
        </Text>
        ) : (
          content
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  watchCell: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    minWidth: 72,
    textAlign: 'center',
    color: '#374151',
  },
})
