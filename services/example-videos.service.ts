/**
 * Example videos service – Supabase storage URLs for example video assets.
 */

const EXAMPLE_VIDEOS_BUCKET_PATH = '/storage/v1/object/public/example-videos/'

export const EXAMPLE_VIDEOS_STORAGE_BASE =
  (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '') + EXAMPLE_VIDEOS_BUCKET_PATH

export function getExampleVideoUrl(filename: string): string {
  return EXAMPLE_VIDEOS_STORAGE_BASE + encodeURIComponent(filename)
}

export function getExampleThumbnailUrl(filename: string): string {
  return EXAMPLE_VIDEOS_STORAGE_BASE + encodeURIComponent(filename)
}
