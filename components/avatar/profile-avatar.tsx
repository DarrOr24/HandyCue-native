// components/avatar/profile-avatar.tsx
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { Image, Alert } from 'react-native'

import type { AvatarSize } from './avatar'
import { Avatar } from './avatar'
import { useAuth } from '../../contexts/AuthContext'
import { uploadProfileAvatar } from '../../services/avatar.service'
import { getProfile, upsertProfile } from '../../services/profile.service'

type ProfileAvatarProps = {
  isUpdatable?: boolean
  size?: AvatarSize
}

export function ProfileAvatar({
  isUpdatable = false,
  size = 'md',
}: ProfileAvatarProps) {
  const { session } = useAuth()
  const [uri, setUri] = useState<string | null>(null)
  const [loadedUri, setLoadedUri] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) {
      setUri(null)
      setLoadedUri(null)
      return
    }

    getProfile(session.user.id)
      .then((p) => {
        const url = p?.img_url ?? null
        setUri(url)
        if (url) {
          // Add cache buster so we don't get a cached old image (same URL, replaced file)
          const urlWithCacheBuster = `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`
          Image.prefetch(urlWithCacheBuster)
            .then(() => setLoadedUri(urlWithCacheBuster))
            .catch(() => setLoadedUri(urlWithCacheBuster))
        } else {
          setLoadedUri(null)
        }
      })
      .catch(() => {
        setUri(null)
        setLoadedUri(null)
      })
  }, [session?.user?.id])

  const handlePress = async () => {
    if (!isUpdatable || !session?.user?.id) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    })

    if (result.canceled) return

    const localUri = result.assets[0].uri
    const previousUri = uri

    setLoadedUri(localUri)
    setUri(localUri)

    try {
      const publicUrl = await uploadProfileAvatar(session.user.id, localUri)
      await upsertProfile(session.user.id, { img_url: publicUrl })
      // Add cache buster so the new image loads (CDN may cache the old one)
      const urlWithCacheBuster = `${publicUrl}${publicUrl.includes('?') ? '&' : '?'}v=${Date.now()}`
      setUri(urlWithCacheBuster)
      setLoadedUri(urlWithCacheBuster)
    } catch (err: any) {
      console.error('[ProfileAvatar] upload failed:', err)
      setLoadedUri(previousUri)
      setUri(previousUri)
      Alert.alert(
        'Upload failed',
        err?.message ?? 'Could not save your photo. Please try again.',
      )
    }
  }

  return (
    <Avatar
      uri={loadedUri ?? undefined}
      size={size}
      onPress={isUpdatable ? handlePress : undefined}
    />
  )
}
