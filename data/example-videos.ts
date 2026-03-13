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
      { title: 'Slide - L shape', url: 'Slide drill - l shape slide.mp4', available: false },
      { title: 'Slide - Tuck to straight', url: 'Slide drill - tuck to straight.mp4', available: false },
      { title: 'Switch - Twinkle toes', url: 'Switch drill - twinkle toes.mp4', available: false },
    ],
  },
  entryBuddy: {
    title: 'EntryBuddy',
    videos: [
      { title: 'Mixed standing entries', url: 'EntryBuddy - mixed standing entries.mp4', available: false },
      { title: 'Straddle press entries', url: 'EntryBuddy - straddle press entries.mp4', available: false },
      { title: 'Pike kneeling entries', url: 'EntryBuddy - pike kneeling entries.mp4', available: false },
    ],
  },
  shapeJam: {
    title: 'ShapeJam',
    videos: [
      { title: 'Tuck-Straddle-Straight', url: 'ShapeJam - tuck straddle straight.mp4', available: false },
    ],
  },
  holdOn: {
    title: 'HoldOn',
    videos: [
      { title: 'Chest to wall hold', url: 'HoldOn - chest to wall hold.mp4', available: false },
    ],
  },
}
