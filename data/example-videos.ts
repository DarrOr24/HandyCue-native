import type { ExampleVideo } from '../components/example-video-card'

export type ExampleVideoSection = {
  section: string
  videos: ExampleVideo[]
}

export type ExampleVideosConfig = {
  title: string
  sections: ExampleVideoSection[]
}

export const EXAMPLE_VIDEOS: Record<string, ExampleVideosConfig> = {
  drillDJ: {
    title: 'DrillDJ',
    sections: [
      {
        section: 'Float drills',
        videos: [
          { title: 'Heel pulls', url: 'Float drill - heel pulls.mp4', available: false },
          { title: 'Toe pulls', url: 'Float drill - toe pulls.mp4', available: true },
          { title: 'L Shape Float', url: 'Float drill - l shape float.mp4', available: false },
        ],
      },
      {
        section: 'Slide drills',
        videos: [
          { title: 'L Shape Slide', url: 'Slide drill - l shape slide.mp4', available: false },
          { title: 'Tuck to straight', url: 'Slide drill - tuck to straight.mp4', available: false },
        ],
      },
      {
        section: 'Switch drill',
        videos: [{ title: 'Twinkle toes', url: 'Switch drill - twinkle toes.mp4', available: false }],
      },
    ],
  },
}
