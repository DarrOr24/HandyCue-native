import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
} from './cueCoach.favorites.service'

export type ShapeJamInputs = {
  getReadyTime: number
  numReps: number
  numSets: number
  restTime: number
  voiceCountEnabled?: boolean
  shapes: { shape: string; holdTime: number }[]
}

export { getFavoritesForFeature, checkIsDuplicateName, saveFavoriteForFeature }
