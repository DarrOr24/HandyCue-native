/**
 * CueCraft - user-defined sequence builder.
 * Step types and sequence structure.
 */

export type CueStepType = 'getReady' | 'timer' | 'rest' | 'reps' | 'sets' | 'customText'

export interface CueStepBase {
  id: string
  type: CueStepType
}

export interface GetReadyStep extends CueStepBase {
  type: 'getReady'
  duration: number
}

export interface TimerStep extends CueStepBase {
  type: 'timer'
  duration: number
  /** How often to say elapsed (sec). 0 = no callouts during, only countdown. */
  calloutInterval?: number
  /** When to start countdown (e.g. 10 = say 10, 9, 8... at the end). */
  countdownFrom?: number
}

export interface RestStep extends CueStepBase {
  type: 'rest'
  duration: number
  /** If true, voice says countdown in last 10 sec. If false, display only. Off for short rests. */
  announceCountdown?: boolean
}

/** Reps: repeat the following steps N times (no rest between). */
export interface RepsStep extends CueStepBase {
  type: 'reps'
  count: number
  /** If true, say "X reps" at the start. If false, flow silently. */
  announceReps?: boolean
}

/** Sets: repeat the following steps N times, with optional rest between each set. */
export interface SetsStep extends CueStepBase {
  type: 'sets'
  count: number
  restBetween: number
  /** If true, voice says countdown during rest between sets. If false, display only. */
  announceRestCountdown?: boolean
}

export interface CustomTextStep extends CueStepBase {
  type: 'customText'
  text: string
}

export type CueStep = GetReadyStep | TimerStep | RestStep | RepsStep | SetsStep | CustomTextStep

export interface CueCraftSequence {
  steps: CueStep[]
}

export type CueCraftInputs = CueCraftSequence
