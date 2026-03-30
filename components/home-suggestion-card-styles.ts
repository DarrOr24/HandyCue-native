import { StyleSheet } from 'react-native'

/**
 * Shared row layout for home “Suggestions” (progression, demos, drill ideas).
 * Tuned for larger font scales: no fixed title heights, text column flex-shrinks.
 */
export const homeSuggestionCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c5ddd4',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInGrid: {
    width: '100%',
    alignSelf: 'stretch',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#e8ebe9',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 8,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B9A8B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  chevron: { marginRight: 2, flexShrink: 0 },
})
