import type { Demo } from '../components/demo-card'

export type DemosConfig = {
  title: string
  videos: Demo[]
}

export const DEMOS: Record<string, DemosConfig> = {
  drillDJ: {
    title: 'DrillDJ',
    videos: [
      {
        title: 'Float - Heel pulls',
        url: 'Float drill - heel pulls.mp4',
        available: true,
        thumbnailUrl: 'Float drill - heel pulls.jpeg',
        instructionId: 'heelPulls',
      },
      {
        title: 'Float - Toe pulls',
        url: 'Float drill - toe pulls.mp4',
        available: true,
        thumbnailUrl: 'Float drill - toe pulls.jpeg',
        instructionId: 'toePulls',
      },
      { title: 'Float - L shape', url: 'Float drill - L shape.mp4', available: true, thumbnailUrl: 'Float drill - L shape.jpeg' },
      { title: 'Slide - L shape', url: 'Slide drill - L shape.mp4', available: true, thumbnailUrl: 'Slide drill - L shape.jpeg' },
      { title: 'Slide - Tuck slide', url: 'Slide drill - Tuck slide.mp4', available: true, thumbnailUrl: 'Slide drill - Tuck slide.jpeg' },
      { title: 'Switch - Twinkle toes', url: 'Switch drill - Twinkle toes.mp4', available: true, thumbnailUrl: 'Switch drill - Twinkle toes.jpeg' },
    ],
  },
  entryBuddy: {
    title: 'EntryBuddy',
    videos: [
      {
        title: 'Mixed standing entries',
        url: 'EntryBuddy - mixed standing entries.mp4',
        available: true,
        thumbnailUrl: 'EntryBuddy - mixed standing entries.jpeg',
        instructionId: 'mixedStandingEntries',
      },
      { title: 'Straddle press entries', url: 'EntryBuddy - straddle press entries.mp4', available: true, thumbnailUrl: 'EntryBuddy - straddle press entries.jpeg' },
      { title: 'Pike kneeling entries', url: 'EntryBuddy - pike kneeling entries.mp4', available: true, thumbnailUrl:'EntryBuddy - pike kneeling entries.jpeg' },
    ],
  },
  shapeJam: {
    title: 'ShapeJam',
    videos: [
      { title: 'Tuck-Straddle-Straight', url: 'Tuck-Straddle-Straight.mp4', available: true, thumbnailUrl: 'Tuck-Straddle-Straight.jpeg' },
    ],
  },
  holdOn: {
    title: 'HoldOn',
    videos: [
      {
        title: 'Chest to wall hold',
        url: 'HoldOn - chest to wall hold.mp4',
        available: true,
        thumbnailUrl: 'HoldOn - chest to wall hold.jpeg',
        instructionId: 'chestToWallHold',
      },
      {
        title: 'Freestanding hold (straight)',
        url: 'HoldOn - freestanding hold.mp4',
        available: true,
        thumbnailUrl: 'HoldOn - freestanding hold.jpeg',
        instructionId: 'freeBalanceHold',
      },
    ],
  },
  cueCraft: {
    title: 'CueCraft',
    videos: [],
  },
}

/** Resolve a clip from a feature’s demo list (e.g. deep links from Handstand Journey). */
export function findDemoVideo(featureKey: string, videoUrl: string): Demo | undefined {
  const config = DEMOS[featureKey]
  if (!config) return undefined
  return config.videos.find((v) => v.url === videoUrl)
}
