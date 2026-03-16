import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native'
import { ReactNode, createContext, useContext } from 'react'

const GAP = 12
const CELL_WIDTH_2COL = '48%'
const CELL_WIDTH_3COL = '31%'

const CellWidthContext = createContext<string>(CELL_WIDTH_2COL)

/**
 * Grid layout for feature screens. 2 columns in portrait, 3 columns on Android landscape.
 * Wrap each input in GridItem. Use SingleInput for a single cell in the last row (left-aligned).
 */
export function FeatureInputsGrid({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions()
  const use3Col = Platform.OS === 'android' && width > height
  const cellWidth = use3Col ? CELL_WIDTH_3COL : CELL_WIDTH_2COL

  return (
    <CellWidthContext.Provider value={cellWidth}>
      <View style={styles.grid}>{children}</View>
    </CellWidthContext.Provider>
  )
}

function GridItem({ children }: { children: ReactNode }) {
  const cellWidth = useContext(CellWidthContext)
  return (
    <View
      style={[styles.cell, { width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth }]}
    >
      {children}
    </View>
  )
}

function SingleInput({ children }: { children: ReactNode }) {
  const cellWidth = useContext(CellWidthContext)
  return (
    <View
      style={[
        styles.cell,
        styles.singleCell,
        { width: cellWidth, minWidth: cellWidth, maxWidth: cellWidth },
      ]}
    >
      {children}
    </View>
  )
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
    flexGrow: 0,
    flexShrink: 0,
  },
  singleCell: {
    alignSelf: 'flex-start',
  },
})
