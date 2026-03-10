import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export function BillingScreen() {
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#ffffff', '#e0f0eb']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Billing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.currentPlan}>
          <Text style={styles.currentPlanLabel}>Current plan</Text>
          <Text style={styles.currentPlanName}>Unlimited</Text>
          <Text style={styles.currentPlanDesc}>
            All features are unlimited. Enjoy full access to HoldOn, EntryBuddy, ShapeJam, and DrillDJ.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>In the future</Text>
        <Text style={styles.futureIntro}>
          We may introduce Basic (free) and Pro tiers. Details will be shared when available.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '600', color: '#374151' },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  currentPlan: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  currentPlanLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532d',
    marginBottom: 8,
  },
  currentPlanDesc: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  futureIntro: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
})
