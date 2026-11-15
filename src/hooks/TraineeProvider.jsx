/* ─── TraineeProvider ──────────────────────────────────────────────────────
   React Context provider — single shared trainee state for the whole app.

   BUG FIXES applied here:
   1. readAndNormalize() re-derives rank from actual progress on every read,
      so stale rank strings in localStorage never display incorrectly.
   2. saveMissionResult only adds to completedMissions when the run passed,
      preventing failed retries from recording mission completion.
   3. All writes derive rank from actual arrays, never from a stored string.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useCallback }             from 'react'
import { TraineeContext }                    from './useTrainee'
import { deriveRank, computeNewAchievements, computeOutpostAchievements, OUTPOST_RESULT_KEY } from './useTrainee'

const STORAGE_KEY        = 'astrobase_trainee'
const RESULT_STORAGE_KEY = 'astrobase_last_result'

/* ── Read and immediately re-derive rank so stale stored values never show ── */
function readAndNormalize() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const profile = JSON.parse(raw)
    // Always recompute rank from actual progress — never trust the stored string
    profile.rank = deriveRank(profile)
    // Write it back so the stored value stays in sync
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return profile
  } catch { return null }
}

function writeProfile(profile) {
  // Always store with a freshly derived rank
  const toWrite = { ...profile, rank: deriveRank(profile) }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toWrite))
}

export function TraineeProvider({ children }) {
  // On mount, re-derive rank from actual progress — fixes stale localStorage data
  const [trainee, setTrainee] = useState(() => readAndNormalize())

  /* Register — only creates if no profile exists */
  const saveTrainee = useCallback((name, callsign) => {
    const existing = readAndNormalize()
    if (existing) {
      setTrainee(existing)
      return existing
    }
    const profile = {
      name:              name.trim(),
      callsign:          callsign.trim().toUpperCase(),
      rank:              'Cadet',
      completedModules:  [],
      completedMissions: [],
      achievements:      [],
      registeredAt:      new Date().toISOString(),
    }
    writeProfile(profile)
    setTrainee({ ...profile, rank: deriveRank(profile) })
    return profile
  }, [])

  /* Merge partial updates — always re-derives rank from actual arrays */
  const updateTrainee = useCallback((changes) => {
    setTrainee((prev) => {
      const updated = { ...prev, ...changes }
      updated.rank  = deriveRank(updated)
      writeProfile(updated)
      return updated
    })
  }, [])

  /* Save a completed mission result ────────────────────────────────────────
     IMPORTANT: completedMissions is only updated when the run PASSED.
     A failed run earns first_mission but does NOT record mission completion.
  ─────────────────────────────────────────────────────────────────────────── */
  const saveMissionResult = useCallback((resultPayload) => {
    const { score, total, missionId } = resultPayload
    const passed  = score >= 4
    const perfect = score === total

    setTrainee((prev) => {
      const rankBefore      = prev.rank
      const newAchievements = computeNewAchievements(prev, { score, total, missionId })

      const updatedAchievements = [...new Set([...(prev.achievements ?? []), ...newAchievements])]

      // Only record mission as completed when the run passed (score >= 4)
      const updatedMissions = passed
        ? [...new Set([...(prev.completedMissions ?? []), missionId])]
        : [...(prev.completedMissions ?? [])]

      const updated = {
        ...prev,
        completedMissions: updatedMissions,
        achievements:      updatedAchievements,
      }
      // Rank is derived from actual arrays — never stored manually
      updated.rank = deriveRank(updated)
      writeProfile(updated)

      // Persist full result for /results page
      const result = {
        ...resultPayload,
        passed,
        perfect,
        newAchievements,
        rankBefore,
        rankAfter: updated.rank,
        savedAt:   new Date().toISOString(),
      }
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result))

      return updated
    })
  }, [])

  /* Read the last saved result for /results page */
  const loadLastResult = useCallback(() => {
    try {
      const raw = localStorage.getItem(RESULT_STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }, [])

  /* ── Chapter 2 (Lunar Outpost) ─────────────────────────────────────────
     saveOutpostResult writes to 'astrobase_outpost_result' only.
     It appends new Chapter 2 achievements to the shared trainee profile
     but never touches astrobase_last_result or any existing field.

     resultPayload: {
       chapterResults: [ { chapterNumber, choiceKind, androidCorrect, quizCorrect } ],
       finalResources: { electricity, food, oxygen, water, radiation },
       survived:       boolean,
       scienceScore:   number (0–5),
     }
  ─────────────────────────────────────────────────────────────────────── */
  const saveOutpostResult = useCallback((resultPayload) => {
    setTrainee((prev) => {
      const newAchievements = computeOutpostAchievements(prev, {
        chapterResults: resultPayload.chapterResults,
        survived:       resultPayload.survived,
      })

      const updatedAchievements = [...new Set([...(prev.achievements ?? []), ...newAchievements])]

      // Mark outpost as completed in completedMissions only if survived
      const updatedMissions = resultPayload.survived
        ? [...new Set([...(prev.completedMissions ?? []), 'lunar-outpost'])]
        : [...(prev.completedMissions ?? [])]

      const updated = {
        ...prev,
        completedMissions: updatedMissions,
        achievements:      updatedAchievements,
      }
      updated.rank = deriveRank(updated)
      writeProfile(updated)

      // Write full outpost result to its own separate key
      const result = {
        ...resultPayload,
        newAchievements,
        rankAfter: updated.rank,
        savedAt:   new Date().toISOString(),
      }
      localStorage.setItem(OUTPOST_RESULT_KEY, JSON.stringify(result))

      return updated
    })
  }, [])

  /* Read the last saved Outpost result for /outpost/results page */
  const loadOutpostResult = useCallback(() => {
    try {
      const raw = localStorage.getItem(OUTPOST_RESULT_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }, [])

  /* Wipe everything — clears profile, result, and resets state to null */
  const clearTrainee = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(RESULT_STORAGE_KEY)
    localStorage.removeItem(OUTPOST_RESULT_KEY)
    setTrainee(null)
  }, [])

  return (
    <TraineeContext.Provider value={{
      trainee,
      saveTrainee,
      updateTrainee,
      clearTrainee,
      saveMissionResult,
      loadLastResult,
      saveOutpostResult,
      loadOutpostResult,
    }}>
      {children}
    </TraineeContext.Provider>
  )
}
