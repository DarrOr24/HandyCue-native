import { StyleSheet, View } from 'react-native'
import { ReactNode } from 'react'

/**
 * Shared inputs grid layout for feature screens (HoldOn, DrillDJ, EntryBuddy, ShapeJam).
 * Use SingleInput to wrap inputs that may be alone in the last row so they stay left-aligned.
 */
export function FeatureInputsGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>
}

function SingleInput({ children }: { children: ReactNode }) {
  return <View style={styles.singleInputWrapper}>{children}</View>
}

FeatureInputsGrid.SingleInput = SingleInput

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    columnGap: 12,
    rowGap: 24,
  },
  singleInputWrapper: {
    alignSelf: 'flex-start',
    width: '48%',
  },
})
