import { StyleSheet, View } from 'react-native'
import { ReactNode } from 'react'

const CELL_WIDTH = '48%'
const GAP = 12

/**
 * Grid layout for feature screens. All cells are the same size (48% width).
 * Wrap each input in GridItem. Use SingleInput for a single cell in the last row (left-aligned).
 */
export function FeatureInputsGrid({ children }: { children: ReactNode }) {
  return <View style={styles.grid}>{children}</View>
}

function GridItem({ children }: { children: ReactNode }) {
  return <View style={styles.cell}>{children}</View>
}

function SingleInput({ children }: { children: ReactNode }) {
  return <View style={[styles.cell, styles.singleCell]}>{children}</View>
}

FeatureInputsGrid.GridItem = GridItem
FeatureInputsGrid.SingleInput = SingleInput

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    columnGap: GAP,
    rowGap: 24,
  },
  cell: {
    width: CELL_WIDTH,
    minWidth: CELL_WIDTH,
    maxWidth: CELL_WIDTH,
    flexGrow: 0,
    flexShrink: 0,
  },
  singleCell: {
    alignSelf: 'flex-start',
  },
})
