/**
 * Favorites service for CueCraft sequences.
 */

import {
  getFavoritesForFeature as getFavorites,
  checkIsDuplicateName as checkDuplicate,
  saveFavoriteForFeature as saveFavorite,
  deleteFavorite as deleteFav,
  type Favorite,
} from './cueCoach.favorites.service'
import type { CueCraftSequence } from './cueCraft.types'

export type CueCraftFavorite = Favorite<CueCraftSequence>

export const getFavoritesForFeature = getFavorites<CueCraftSequence>
export const checkIsDuplicateName = (name: string, favorites: CueCraftFavorite[]) =>
  checkDuplicate(name, favorites)
export const saveFavoriteForFeature = saveFavorite<CueCraftSequence>
export const deleteFavorite = deleteFav
