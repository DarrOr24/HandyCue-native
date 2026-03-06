import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system/legacy'
import { supabase } from '../lib/supabase'

const BUCKET = 'avatars'

/**
 * Upload avatar image and return public URL.
 * Requires Supabase Storage bucket "avatars" with public read access.
 */
export async function uploadProfileAvatar(userId: string, fileUri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  const fileBuffer = decode(base64)
  const path = `profiles/${userId}.jpg`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg',
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
