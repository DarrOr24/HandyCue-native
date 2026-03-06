import {
  getFavoritesForFeature,
  checkIsDuplicateName,
  saveFavoriteForFeature,
} from './cueCoach.favorites.service'

export type DrillDJInputs = {
  getReadyTime: number
  numReps: number
  numSets: number
  restTime: number
  drillType: 'slide' | 'float' | 'switch'
  slideTime?: number
  timeBetweenSlides?: number
  floatTime?: number
  timeBetweenFloats?: number
  switchTime?: number
  timeBetweenSwitches?: number
  sayRepCount?: boolean
  metronomeEnabled?: boolean
}

export { getFavoritesForFeature, checkIsDuplicateName, saveFavoriteForFeature }
