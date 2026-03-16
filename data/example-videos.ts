import type { ExampleVideo } from '../components/example-video-card'

export type ExampleVideosConfig = {
  title: string
  videos: ExampleVideo[]
}

export const EXAMPLE_VIDEOS: Record<string, ExampleVideosConfig> = {
  drillDJ: {
    title: 'DrillDJ',
    videos: [
      { title: 'Float - Heel pulls', url: 'Float drill - heel pulls.mp4', available: true, thumbnailUrl: 'Float drill - heel pulls.jpeg' },
      { title: 'Float - Toe pulls', url: 'Float drill - toe pulls.mp4', available: true, thumbnailUrl: 'Float drill - toe pulls.jpeg' },
      { title: 'Float - L shape', url: 'Float drill - L shape.mp4', available: true, thumbnailUrl: 'Float drill - L shape.jpeg' },
      { title: 'Slide - L shape', url: 'Slide drill - L shape.mp4', available: true, thumbnailUrl: 'Slide drill - L shape.jpeg' },
      { title: 'Slide - Tuck slide', url: 'Slide drill - Tuck slide.mp4', available: true, thumbnailUrl: 'Slide drill - Tuck slide.jpeg' },
      { title: 'Switch - Twinkle toes', url: 'Switch drill - Twinkle toes.mp4', available: true, thumbnailUrl: 'Switch drill - Twinkle toes.jpeg' },
    ],
  },
  entryBuddy: {
    title: 'EntryBuddy',
    videos: [
      { title: 'Mixed standing entries', url: 'EntryBuddy - mixed standing entries.mp4', available: true, thumbnailUrl: 'EntryBuddy - mixed standing entries.jpeg' },
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
      { title: 'Chest to wall hold', url: 'HoldOn - chest to wall hold.mp4', available: false },
    ],
  },
  cueCraft: {
    title: 'CueCraft',
    videos: [],
  },
}
