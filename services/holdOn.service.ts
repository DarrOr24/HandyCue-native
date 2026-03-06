import { delay, formatTime, speak, type StoredVoice } from './core.service'

/** Run get-ready countdown with voice callouts. Each tick is exactly 1 second apart. */
export async function runGetReadyCountdown(options: {
  getReadyTime: number
  storedVoice: StoredVoice | null
  onTick: (value: string) => void
  isCancelled: () => boolean
}): Promise<void> {
  const { getReadyTime, storedVoice, onTick, isCancelled } = options
  if (getReadyTime === 0) return

  onTick('Ready!')
  await speak('Get ready in...', storedVoice)
  if (isCancelled()) return

  let countdown = getReadyTime
  while (countdown > 0) {
    if (isCancelled()) return
    const tickStart = Date.now()
    onTick(String(countdown))
    await speak(String(countdown), storedVoice)
    if (isCancelled()) return
    const elapsed = Date.now() - tickStart
    await delay(Math.max(0, 1000 - elapsed))
    if (isCancelled()) return
    countdown--
  }
}

/** Run hold phase - returns cleanup function. Timer ticks exactly every second using wall-clock time. */
export function runHoldInterval(options: {
  holdTime: number
  calloutStep: number
  storedVoice: StoredVoice | null
  startAt?: number
  onTick: (elapsed: number, displayContent: string) => void
  onHoldComplete: () => void
  isCancelled: () => boolean
}): () => void {
  const { holdTime, calloutStep, storedVoice, startAt = 0, onTick, onHoldComplete, isCancelled } = options
  const startTime = Date.now() - startAt * 1000
  let lastElapsed = startAt - 1

  const interval = setInterval(() => {
    if (isCancelled()) {
      clearInterval(interval)
      return
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    if (elapsed === lastElapsed) return
    lastElapsed = elapsed

    if (elapsed >= holdTime) {
      clearInterval(interval)
      onHoldComplete()
      return
    }

    onTick(elapsed, formatTime(elapsed))

    const remaining = holdTime - elapsed

    if (calloutStep && elapsed > 0 && elapsed % calloutStep === 0 && remaining > 10) {
      speak(String(elapsed), storedVoice)
    }
    if (holdTime >= 30 && elapsed === Math.floor(holdTime / 2)) {
      speak('Halfway', storedVoice)
    }
    if (remaining <= 10 && remaining > 0) {
      speak(String(remaining), storedVoice)
    }
  }, 100)

  return () => clearInterval(interval)
}

/** Run rest phase - returns cleanup function. Timer ticks exactly every second using wall-clock time. */
export function runRestCycle(options: {
  restTime: number
  storedVoice: StoredVoice | null
  onTick: (elapsed: number, displayContent: string) => void
  onRestComplete: () => void
  isCancelled: () => boolean
}): () => void {
  const { restTime, storedVoice, onTick, onRestComplete, isCancelled } = options
  const startTime = Date.now()
  let lastElapsed = -1

  const interval = setInterval(() => {
    if (isCancelled()) {
      clearInterval(interval)
      return
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    if (elapsed === lastElapsed) return
    lastElapsed = elapsed

    if (elapsed >= restTime) {
      clearInterval(interval)
      onRestComplete()
      return
    }

    onTick(elapsed, formatTime(elapsed))

    const remaining = restTime - elapsed
    if (remaining <= 10 && remaining > 0) {
      speak(String(remaining), storedVoice)
    }
  }, 100)

  return () => clearInterval(interval)
}
