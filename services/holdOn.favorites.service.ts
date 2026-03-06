/**
 * Favorites service for HoldOn (and other cue coach features).
 * Saves/loads favorites to profile.favorites.
 */

import { getProfile, upsertProfile } from './profile.service'

export type HoldOnInputs = {
  getReadyTime: number
  holdTime: number
  numSets: number
  restTime: number
  calloutStep: number
}

export type Favorite = {
  name: string
  dateCreated: number
  inputs: HoldOnInputs
}

export function getFavoritesForFeature(
  profile: { favorites?: Record<string, unknown> } | null,
  featureKey: string
): Favorite[] {
  const list = profile?.favorites?.[featureKey]
  return Array.isArray(list) ? (list as Favorite[]) : []
}

export function checkIsDuplicateName(name: string, favorites: Favorite[]): boolean {
  const trimmed = name.trim()
  return favorites.some((fav) => fav.name === trimmed)
}

export async function saveFavoriteForFeature({
  userId,
  featureKey,
  favoriteName,
  inputs,
}: {
  userId: string
  featureKey: string
  favoriteName: string
  inputs: HoldOnInputs
}): Promise<void> {
  const trimmedName = favoriteName.trim()
  if (!trimmedName) return

  const profile = await getProfile(userId)
  const currentFavorites = (profile?.favorites as Record<string, unknown>) ?? {}
  const existing = (currentFavorites[featureKey] as Favorite[]) ?? []

  const newFavorite: Favorite = {
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
  const existing = (currentFavorites[featureKey] as Favorite[]) ?? []

  const updated = existing.filter((fav) => fav.name !== favoriteName)

  await upsertProfile(userId, {
    favorites: { ...currentFavorites, [featureKey]: updated },
  })
}
