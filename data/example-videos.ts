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
      { title: 'Float - L shape', url: 'Float drill - l shape float.mp4', available: false },
      { title: 'Slide - L shape', url: 'Slide drill - l shape slide.mp4', available: false },
      { title: 'Slide - Tuck to straight', url: 'Slide drill - tuck to straight.mp4', available: false },
      { title: 'Switch - Twinkle toes', url: 'Switch drill - twinkle toes.mp4', available: false },
    ],
  },
}
