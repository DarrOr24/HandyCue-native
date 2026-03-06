/**
 * Favorites service for HoldOn.
 */

import {
  getFavoritesForFeature as getFavorites,
  checkIsDuplicateName as checkDuplicate,
  saveFavoriteForFeature as saveFavorite,
  deleteFavorite as deleteFav,
  type Favorite,
} from './cueCoach.favorites.service'

export type HoldOnInputs = {
  getReadyTime: number
  holdTime: number
  numSets: number
  restTime: number
  calloutStep: number
}

export type HoldOnFavorite = Favorite<HoldOnInputs>

export const getFavoritesForFeature = getFavorites<HoldOnInputs>
export const checkIsDuplicateName = (name: string, favorites: HoldOnFavorite[]) =>
  checkDuplicate(name, favorites)
export const saveFavoriteForFeature = saveFavorite<HoldOnInputs>
export const deleteFavorite = deleteFav
