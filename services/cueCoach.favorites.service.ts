/**
 * Shared favorites service for cue coach features (HoldOn, EntryBuddy, etc.).
 */

import { getProfile, upsertProfile } from './profile.service'

export type Favorite<T = Record<string, unknown>> = {
  name: string
  dateCreated: number
  inputs: T
}

export function getFavoritesForFeature<T = Record<string, unknown>>(
  profile: { favorites?: Record<string, unknown> } | null,
  featureKey: string
): Favorite<T>[] {
  const list = profile?.favorites?.[featureKey]
  return Array.isArray(list) ? (list as Favorite<T>[]) : []
}

export function checkIsDuplicateName(name: string, favorites: { name: string }[]): boolean {
  const trimmed = name.trim()
  return favorites.some((fav) => fav.name === trimmed)
}

export async function saveFavoriteForFeature<T = Record<string, unknown>>({
  userId,
  featureKey,
  favoriteName,
  inputs,
}: {
  userId: string
  featureKey: string
  favoriteName: string
  inputs: T
}): Promise<void> {
  const trimmedName = favoriteName.trim()
  if (!trimmedName) return

  const profile = await getProfile(userId)
  const currentFavorites = (profile?.favorites as Record<string, unknown>) ?? {}
  const existing = (currentFavorites[featureKey] as Favorite<T>[]) ?? []

  const newFavorite: Favorite<T> = {
    name: trimmedName,
    dateCreated: Date.now(),
    inputs,
  }

  const updated = [
    ...existing.filter((fav) => fav.name !== trimmedName),
    newFavorite,
  ]

  await upsertProfile(userId, {
    favorites: { ...currentFavorites, [featureKey]: updated },
  })
}

export async function deleteFavorite(
  userId: string,
  featureKey: string,
  favoriteName: string
): Promise<void> {
  const profile = await getProfile(userId)
  const currentFavorites = (profile?.favorites as Record<string, unknown>) ?? {}
  const existing = (currentFavorites[featureKey] as { name: string }[]) ?? []
  const updated = existing.filter((fav) => fav.name !== favoriteName)

  await upsertProfile(userId, {
    favorites: { ...currentFavorites, [featureKey]: updated },
  })
}
