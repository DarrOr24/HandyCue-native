/**
 * Demos service – Supabase storage URLs for demo video assets.
 */

const DEMOS_BUCKET_PATH = '/storage/v1/object/public/example-videos/'

export const DEMOS_STORAGE_BASE =
  (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '') + DEMOS_BUCKET_PATH

export function getDemoVideoUrl(filename: string): string {
  return DEMOS_STORAGE_BASE + encodeURIComponent(filename)
}

export function getDemoThumbnailUrl(filename: string): string {
  return DEMOS_STORAGE_BASE + encodeURIComponent(filename)
}
