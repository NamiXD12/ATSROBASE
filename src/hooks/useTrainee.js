/* ─── useTrainee — Context-based trainee store ─────────────────────────────
   The entire app shares ONE trainee state via React Context.
   Any call to updateTrainee / saveMissionResult / saveOutpostResult updates
   every subscribed component simultaneously.

   Keys:
     'astrobase_trainee'       — trainee profile
     'astrobase_last_result'   — last RISING TIDE result  (for /results)
     'astrobase_outpost_result'— last Lunar Outpost result (for /outpost/results)
─────────────────────────────────────────────────────────────────────────── */
import { createContext, useContext } from 'react'

export const STORAGE_KEY        = 'astrobase_trainee'
export const RESULT_STORAGE_KEY = 'astrobase_last_result'
export const OUTPOST_RESULT_KEY = 'astrobase_outpost_result'

/* ── Rank derivation ── */
export function deriveRank(profile) {
  if (!profile) return 'Cadet'
  const modules  = profile.completedModules?.length  ?? 0
  const missions = profile.completedMissions?.length ?? 0
  const perfect  = profile.achievements?.includes('perfect_decision_maker') ?? false

  // Each level requires ALL previous conditions.
  if (modules >= 2 && missions >= 1 && perfect) return 'Senior Astronaut'
  if (modules >= 2 && missions >= 1)            return 'Mission Specialist'
  if (modules >= 2)                             return 'Junior Astronaut'
  return 'Cadet'
}

/* ── Chapter 1 (RISING TIDE) achievement computation ──────────────────────
   - first_mission:          any attempt, first time only
   - mission_survivor:       passed run (score >= 4) on rising-tide only
   - perfect_decision_maker: all 6 correct
   Module achievements (life_support_specialist, spacewalk_certified) are
   awarded separately in Training.jsx.
─────────────────────────────────────────────────────────────────────────── */
export function computeNewAchievements(trainee, { score, total, missionId }) {
  const existing = trainee.achievements ?? []
  const earned   = []
  const passed   = score >= 4
  const perfect  = score === total

  if (!existing.includes('first_mission'))
    earned.push('first_mission')

  if (passed && missionId === 'rising-tide' && !existing.includes('mission_survivor'))
    earned.push('mission_survivor')

  if (perfect && !existing.includes('perfect_decision_maker'))
    earned.push('perfect_decision_maker')

  return [...new Set(earned)]
}

/* ── Chapter 2 (Lunar Outpost) achievement computation ────────────────────
   Called by TraineeProvider.saveOutpostResult.
   Entirely independent of computeNewAchievements.

   chapterResults: array of { chapterNumber, choiceKind, androidCorrect, quizCorrect }
   survived:       true if the player completed all 5 chapters without gameover
─────────────────────────────────────────────────────────────────────────── */
export function computeOutpostAchievements(trainee, { chapterResults, survived }) {
  const existing = trainee.achievements ?? []
  const earned   = []

  if (survived && !existing.includes('outpost_commander'))
    earned.push('outpost_commander')

  const allAndroidCorrect = chapterResults.every(r => r.androidCorrect)
  if (survived && allAndroidCorrect && !existing.includes('android_synergy'))
    earned.push('android_synergy')

  const allQuizCorrect = chapterResults.every(r => r.quizCorrect)
  if (survived && allQuizCorrect && !existing.includes('science_ace'))
    earned.push('science_ace')

  return [...new Set(earned)]
}

/* ══════════════════════════════════════════════════════════════
   CONTEXT — provider lives in TraineeProvider.jsx
══════════════════════════════════════════════════════════════ */
export const TraineeContext = createContext(null)

export default function useTrainee() {
  const ctx = useContext(TraineeContext)
  if (!ctx) throw new Error('useTrainee must be used inside <TraineeProvider>')
  return ctx
}
