/**
 * EntryBuddy service - get ready, run entries (Up/Down), rest cycle.
 */

import { delay, speak, type StoredVoice } from './core.service'
import {
  runGetReadyCountdown,
  runRestCycle,
} from './holdOn.service'

export { runGetReadyCountdown, runRestCycle }

export async function runEntries(options: {
  setNum: number
  numSets: number
  numEntries: number
  holdTime: number
  timeBetween: number
  storedVoice: StoredVoice | null
  onDisplay: (content: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const {
    setNum,
    numSets,
    numEntries,
    holdTime,
    timeBetween,
    storedVoice,
    onDisplay,
    isCancelled,
  } = options

  const isFinal = setNum === numSets
  const holdMs = holdTime * 1000
  const betweenMs = timeBetween * 1000

  if (numSets === 1) {
    onDisplay(`${numEntries}!`)
    await speak(`${numEntries} ${numEntries === 1 ? 'entry' : 'entries'}`, storedVoice)
  } else {
    const ordinals = ['st', 'nd', 'rd']
    const suffix = ordinals[setNum - 1] ?? 'th'
    const label = isFinal ? 'Final Set' : `${setNum}${suffix} Set`
    onDisplay(label)
    await speak(`${label}: ${numEntries} ${numEntries === 1 ? 'entry' : 'entries'}`, storedVoice)
  }
  if (isCancelled()) return

  for (let i = 1; i <= numEntries; i++) {
    if (isCancelled()) return
    onDisplay(`Up ${i}`)
    await speak(`Up ${i}`, storedVoice)
    if (isCancelled()) return
    await delay(holdMs)
    if (isCancelled()) return

    onDisplay('Down')
    await speak('Down', storedVoice)
    if (isCancelled()) return
    if (i < numEntries) {
      await delay(betweenMs)
    }
  }
}
