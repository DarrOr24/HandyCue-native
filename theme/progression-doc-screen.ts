import { StyleSheet } from 'react-native'

/**
 * Shared layout + typography for doc-style screens (Handstand Journey aesthetic):
 * white shell, 20px horizontal padding, teal accents, section dividers, body scale.
 */
export const progressionDocScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerSpacer: { width: 32 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  intro: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  /** Extra top spacing before a major drill group (e.g. Float after Slide). */
  sectionMajorTop: { marginTop: 20 },
  /** Major group heading (e.g. drill category). */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  /** In-section title (e.g. “Tuck Slides”). */
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 10,
  },
  bodyTightBelow: { marginBottom: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletMark: {
    fontSize: 16,
    color: '#6b7280',
    width: 18,
    lineHeight: 22,
  },
  bulletBody: { flex: 1, fontSize: 16, color: '#374151', lineHeight: 22 },
  nestedBlock: { marginTop: 12 },
  summaryBlock: { marginTop: 8, paddingTop: 8, paddingBottom: 8 },
  summaryHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
})
