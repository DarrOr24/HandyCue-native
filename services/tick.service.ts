/**
 * Tick/metronome for DrillDJ.
 * Uses expo-audio for tick sound; falls back to haptics only.
 */

import * as Haptics from 'expo-haptics'
import { createAudioPlayer, preload, setAudioModeAsync } from 'expo-audio'

const TICK_SOURCE = require('../assets/sounds/tick.mp3')

let tickPlayer: ReturnType<typeof createAudioPlayer> | null = null
let useAudio = true
let preloadStarted = false

async function ensureAudioMode() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
    })
  } catch {
    // ignore
  }
}

async function ensureTickPlayer() {
  if (tickPlayer) return tickPlayer
  if (!useAudio) return null
  try {
    await ensureAudioMode()
    if (!preloadStarted) {
      preloadStarted = true
      try {
        await preload(TICK_SOURCE)
      } catch {
        // continue without preload
      }
    }
    tickPlayer = createAudioPlayer(TICK_SOURCE)
    return tickPlayer
  } catch {
    useAudio = false
    return null
  }
}

export async function loadTickSound(): Promise<void> {
  await ensureTickPlayer()
}

export async function playTick(): Promise<void> {
  if (!useAudio) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // ignore
    }
    return
  }
  try {
    const player = await ensureTickPlayer()
    if (player) {
      player.seekTo(0)
      player.play()
    } else {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } catch {
        // ignore
      }
    }
  } catch {
    useAudio = false
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch {
      // ignore
    }
  }
}

export async function unloadTickSound(): Promise<void> {
  if (tickPlayer) {
    try {
      tickPlayer.release()
    } catch {
      // ignore
    }
    tickPlayer = null
  }
}
