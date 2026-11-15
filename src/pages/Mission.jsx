/* ─── Mission page — Figma visual integration ──────────────────────────────
   Route: /mission  and  /mission/:missionId   (protected)

   ALL LOGIC IS UNCHANGED from the previous version:
   - useReducer with missionReducer
   - buildInitialState, calcScore, formatTime
   - All event handlers (handleStart, handleNextScene, etc.)
   - saveMissionResult, localStorage, routing

   Phase 2 changes are VISUAL ONLY:
   - Disclaimer: Figma's briefing-panel layout
   - Briefing: Figma's story-screen / lunar scene background
   - Decisions: Figma's story-screen with compact resource HUD
   - Outcome: Figma's result-screen / victory/ending-card layout
─────────────────────────────────────────────────────────────────────────── */
import { useReducer, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link }  from 'react-router-dom'
import DialogueBox   from '../components/DialogueBox'
import DecisionPanel from '../components/DecisionPanel'
import useTrainee    from '../hooks/useTrainee'
import useSound      from '../hooks/useSound'
import missions      from '../data/missions'

/* ════════════════════════════════════════════════════════════════
   STATE — UNCHANGED
════════════════════════════════════════════════════════════════ */
function buildInitialState(mission) {
  return {
    phase:        'disclaimer',
    sceneIndex:   0,
    decisionIndex:0,
    answers:      [],
    co2Level:     mission.initialResources.co2Level,
    stability:    mission.initialResources.stability,
    timeLeft:     mission.initialResources.timeLeft,
    timerActive:  false,
  }
}

/* ════════════════════════════════════════════════════════════════
   REDUCER — UNCHANGED
════════════════════════════════════════════════════════════════ */
function missionReducer(state, action) {
  switch (action.type) {
    case 'START_MISSION':
      return { ...state, phase: 'briefing', timerActive: true }

    case 'NEXT_SCENE': {
      if (state.sceneIndex < action.totalScenes - 1)
        return { ...state, sceneIndex: state.sceneIndex + 1 }
      return { ...state, phase: 'decision', sceneIndex: 0 }
    }
    case 'PREV_SCENE':
      return { ...state, sceneIndex: Math.max(0, state.sceneIndex - 1) }

    case 'CONFIRM_DECISION': {
      const { chosenIndex, isCorrect, penalty } = action
      const newAnswers    = [...state.answers, { chosenIndex, isCorrect }]
      const co2Delta      = isCorrect ? 0 : 0.1
      const nextCo2       = Math.min(parseFloat((state.co2Level + co2Delta).toFixed(2)), 4.0)
      const nextStability = Math.max(state.stability + (isCorrect ? 0 : penalty.stability), 0)
      const nextTime      = Math.max(state.timeLeft  + (isCorrect ? 0 : penalty.timeLeft),  0)
      if (state.decisionIndex >= 5) {
        return { ...state, answers: newAnswers, co2Level: nextCo2, stability: nextStability, timeLeft: nextTime, phase: 'outcome', timerActive: false }
      }
      return { ...state, answers: newAnswers, co2Level: nextCo2, stability: nextStability, timeLeft: nextTime, decisionIndex: state.decisionIndex + 1 }
    }

    case 'TICK':
      if (!state.timerActive || state.timeLeft <= 0) return state
      return { ...state, timeLeft: state.timeLeft - 1 }

    case 'RESET':
      return buildInitialState(action.mission)

    default:
      return state
  }
}

/* ════════════════════════════════════════════════════════════════
   HELPERS — UNCHANGED
════════════════════════════════════════════════════════════════ */
function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}
function calcScore(answers) { return answers.filter(a => a.isCorrect).length }

/* ════════════════════════════════════════════════════════════════
   COMPACT HUD  (Figma .story-resources style)
════════════════════════════════════════════════════════════════ */
function CompactHUD({ co2Level, stability, timeLeft }) {
  const isAlert  = co2Level >= 1.0 || stability <= 50 || timeLeft <= 120
  const co2Pct   = Math.min((co2Level / 4.0) * 100, 100)
  const stabPct  = stability
  const timePct  = (timeLeft / 720) * 100

  const resources = [
    { key: 'co2',   label: 'CO₂',      value: `${co2Level.toFixed(1)}%`,  pct: co2Pct,  color: co2Level >= 1 ? 'var(--fg-red)' : 'var(--fg-cyan)',  danger: co2Level >= 1.0  },
    { key: 'stab',  label: 'STABILITY', value: `${stability}%`,           pct: stabPct, color: stability <= 50 ? 'var(--fg-red)' : 'var(--fg-green)', danger: stability <= 50  },
    { key: 'time',  label: 'TIME',      value: formatTime(timeLeft),      pct: timePct, color: timeLeft <= 120 ? 'var(--fg-amber)' : 'var(--fg-cyan)', danger: timeLeft <= 120  },
  ]

  return (
    <div
      className={`fg-ms-hud${isAlert ? ' fg-ms-hud--alert' : ''}`}
      aria-label="Mission status"
    >
      {resources.map(r => (
        <div key={r.key} className="fg-ms-hud-item">
          <div className="fg-ms-hud-top">
            <i className="fg-ms-hud-label">{r.label}</i>
            <strong
              className={`fg-ms-hud-value${r.danger ? ' fg-ms-hud-value--danger' : ''}`}
              style={{ color: r.color }}
            >
              {r.value}
            </strong>
          </div>
          <div className="fg-ms-hud-track" role="meter"
            aria-valuenow={r.pct} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${r.pct}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   DISCLAIMER SCREEN  (Figma briefing-panel style)
════════════════════════════════════════════════════════════════ */
function DisclaimerScreen({ mission, onStart }) {
  return (
    <div className="fg-ms-disclaimer">
      {/* Left: lunar scene visual */}
      <div className="fg-ms-disclaimer-scene">
        <div className="fg-lunar-scene" style={{ height: '100%' }}>
          <div className="fg-stars" />
          <div className="fg-earth"><span /></div>
          <div className="fg-moon-horizon"><i /><i /><i /></div>
        </div>
        {/* Scene tag */}
        <div className="fg-ms-scene-tag">
          <span>LOCATION</span>
          <b>Station HELIX-1 · Module B</b>
        </div>
        <div className="fg-ms-scene-coords" aria-hidden="true">
          <span>CO₂ RISING</span>
          <span>CREW AT RISK</span>
        </div>
      </div>

      {/* Right: briefing panel */}
      <div className="fg-ms-briefing-panel">
        <p className="fg-eyebrow">Training Simulation</p>
        <h1 className="fg-ms-mission-title">{mission.title}</h1>
        <p className="fg-ms-mission-subtitle">{mission.subtitle}</p>

        {/* Objective box */}
        <div className="fg-ms-objective">
          <span>OBJECTIVE</span>
          <p>
            Diagnose the CO₂ scrubber fault, stabilise the crew environment,
            and restore life-support systems before atmospheric conditions
            become hazardous. Six decisions. Real science.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="fg-ms-disclaimer-note">
          <span>⚠️ DISCLAIMER</span>
          <p>{mission.disclaimer}</p>
        </div>

        <button className="fg-ms-launch-btn" onClick={onStart}>
          ACCEPT &amp; BEGIN MISSION
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <Link to="/dashboard" className="fg-ms-back-btn">
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   OUTCOME SCREEN  (Figma result-screen / victory card style)
   Logic: calcScore, passed/perfect thresholds — UNCHANGED
════════════════════════════════════════════════════════════════ */
function OutcomeScreen({ mission, state, trainee, onRetry, onSave, alreadySaved }) {
  const { sounds } = useSound()
  const score   = calcScore(state.answers)
  const total   = state.answers.length
  const passed  = score >= 4
  const perfect = score === 6
  const pct     = Math.round((score / total) * 100)
  const decisionActs = mission.acts.filter(a => a.type === 'decision')

  // Play outcome sound once on mount
  useEffect(() => {
    if (passed) sounds.success(); else sounds.failure()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`fg-ms-result${passed ? '' : ' fg-ms-result--fail'}`}>

      {/* Two-column: summary | science panel */}
      <div className="fg-ms-result-cols">

        {/* Left — outcome summary */}
        <div className="fg-ms-result-summary">
          {/* Result symbol */}
          <div className={`fg-ms-result-symbol${passed ? '' : ' fg-ms-result-symbol--fail'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {passed
                ? <><polyline points="20 6 9 17 4 12" /></>
                : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              }
            </svg>
          </div>

          <p className="fg-ms-result-label">
            {passed ? (perfect ? 'PERFECT RUN' : 'MISSION SUCCESS') : 'MISSION FAILED'}
          </p>
          <h2 className="fg-ms-result-title">
            {passed
              ? perfect ? 'Flawless Execution' : 'Mission Complete'
              : 'Crew Evacuated'}
          </h2>
          <p className="fg-ms-result-desc">
            {passed
              ? `CO₂ levels restored to safe range. Station HELIX-1 secure. ${
                  perfect ? 'Every decision was scientifically correct.' : 'Well handled.'
                }`
              : 'Too many incorrect decisions destabilised the station. The crew was evacuated as a precaution. Review the decisions below.'}
          </p>

          {/* Resource deltas */}
          <div className="fg-ms-result-deltas">
            {[
              { label: 'Final CO₂',      value: `${state.co2Level.toFixed(1)}%`, good: state.co2Level < 1 },
              { label: 'Crew Stability', value: `${state.stability}%`,           good: state.stability >= 50 },
              { label: 'Time Remaining', value: formatTime(state.timeLeft),      good: true },
              { label: 'Score',          value: `${score}/${total} (${pct}%)`,   good: passed },
            ].map(d => (
              <div key={d.label} className="fg-ms-delta-row">
                <span>{d.label}</span>
                <strong className={d.good ? 'fg-ms-positive' : 'fg-ms-negative'}>{d.value}</strong>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="fg-ms-result-actions">
            <button className="fg-ms-launch-btn" onClick={onRetry}>
              ↺ RETRY MISSION
            </button>
            {passed && !alreadySaved && (
              <button
                className="fg-ms-launch-btn fg-ms-launch-btn--save"
                onClick={onSave}
              >
                ✓ SAVE &amp; DASHBOARD
              </button>
            )}
            <Link to="/dashboard" className="fg-ms-back-btn">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Right — science debrief panel */}
        <div className="fg-ms-science-panel">
          <span className="fg-ms-science-label">MISSION DEBRIEF</span>
          <h3 className="fg-ms-science-title">All 6 Decisions Reviewed</h3>
          <p className="fg-ms-science-intro">
            Every decision is reviewed below with the correct answer and its scientific basis.
          </p>

          {decisionActs.map((act, idx) => {
            const answer     = state.answers[idx]
            if (!answer) return null
            const chosen     = act.choices[answer.chosenIndex]
            const correct    = act.choices.find(c => c.isCorrect)
            const wasCorrect = answer.isCorrect

            return (
              <div
                key={act.id}
                className={`fg-ms-debrief-item${wasCorrect ? ' fg-ms-debrief-item--correct' : ' fg-ms-debrief-item--wrong'}`}
              >
                <div className="fg-ms-debrief-header">
                  <span className="fg-ms-debrief-act">{act.actLabel} · D{act.decisionNumber}</span>
                  <span className={`fg-ms-debrief-verdict${wasCorrect ? ' fg-ms-debrief-verdict--correct' : ' fg-ms-debrief-verdict--wrong'}`}>
                    {wasCorrect ? '✓' : '✗'}
                  </span>
                </div>
                <p className="fg-ms-debrief-situation">{act.situation}</p>
                {!wasCorrect && (
                  <p className="fg-ms-debrief-your">
                    Your answer: <em>{chosen?.text}</em>
                  </p>
                )}
                <p className="fg-ms-debrief-correct">
                  {wasCorrect ? 'Your answer' : 'Correct'}: <strong>{correct?.text}</strong>
                </p>
                <p className="fg-ms-debrief-explanation">{correct?.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE ROOT — LOGIC UNCHANGED, structure updated
════════════════════════════════════════════════════════════════ */
export default function Mission() {
  const { missionId }                             = useParams()
  const navigate                                  = useNavigate()
  const { trainee, saveMissionResult }            = useTrainee()
  const { sounds, startAmbience, stopAmbience }   = useSound()

  const targetId = missionId ?? 'rising-tide'
  const mission  = missions.find(m => m.id === targetId)

  const [state, dispatch] = useReducer(
    missionReducer,
    null,
    () => buildInitialState(mission ?? missions[0])
  )

  const timerRef = useRef(null)

  // Countdown ticker — UNCHANGED
  useEffect(() => {
    if (state.timerActive && state.timeLeft > 0) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [state.timerActive, state.timeLeft])

  // Scroll to top on phase / decision change — UNCHANGED
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [state.phase, state.decisionIndex, state.sceneIndex])

  // Sound: start ambience when briefing begins, stop when done
  useEffect(() => {
    if (state.phase === 'briefing' || state.phase === 'decision') {
      startAmbience('station')
    } else {
      stopAmbience()
    }
    return () => { if (state.phase === 'outcome') stopAmbience() }
  }, [state.phase])

  // Sound: alert when CO₂ goes critical
  const prevAlert = useRef(false)
  useEffect(() => {
    const nowAlert = state.co2Level >= 1.0 || state.stability <= 50 || state.timeLeft <= 120
    if (nowAlert && !prevAlert.current) sounds.alert()
    prevAlert.current = nowAlert
  }, [state.co2Level, state.stability, state.timeLeft])

  if (!mission) { navigate('/dashboard', { replace: true }); return null }

  const alreadySaved   = trainee?.completedMissions?.includes(mission.id)
  const briefingAct    = mission.acts.find(a => a.type === 'briefing')
  const decisionActs   = mission.acts.filter(a => a.type === 'decision')
  const currentDecision = decisionActs[state.decisionIndex]
  const isAlert        = state.co2Level >= 1.0 || state.stability <= 50 || state.timeLeft <= 120

  /* ── Event handlers — ALL UNCHANGED ── */
  function handleStart()      { sounds.missionStart(); dispatch({ type: 'START_MISSION' }) }
  function handleNextScene()  { dispatch({ type: 'NEXT_SCENE', totalScenes: briefingAct.scenes.length }) }
  function handlePrevScene()  { dispatch({ type: 'PREV_SCENE' }) }
  function handleDecision(idx) {
    dispatch({ type: 'CONFIRM_DECISION', chosenIndex: idx,
      isCorrect: currentDecision.choices[idx].isCorrect, penalty: mission.wrongChoicePenalty })
  }
  function handleRetry()      { dispatch({ type: 'RESET', mission }) }
  function handleSave() {
    const score = calcScore(state.answers)
    saveMissionResult({
      missionId:       mission.id,
      missionTitle:    mission.title,
      missionSubtitle: mission.subtitle,
      score,
      total:           state.answers.length,
      answers:         state.answers,
      resources: { co2Level: state.co2Level, stability: state.stability, timeLeft: state.timeLeft },
      decisionActs:    mission.acts
        .filter(a => a.type === 'decision')
        .map(a => ({ id: a.id, actLabel: a.actLabel, decisionNumber: a.decisionNumber, situation: a.situation, choices: a.choices })),
    })
    navigate('/results')
  }

  const showHUD = state.phase === 'briefing' || state.phase === 'decision'

  return (
    <main className={`fg-ms-page${isAlert && showHUD ? ' fg-ms-page--alert' : ''}`}>

      {/* Alert pulse overlay */}
      {isAlert && showHUD && (
        <div className="fg-ms-alert-overlay" aria-hidden="true" />
      )}

      {/* Top bar — always visible during active mission */}
      {state.phase !== 'disclaimer' && state.phase !== 'outcome' && (
        <div className="fg-ms-topbar">
          <div className="fg-ms-topbar-brand">
            <span className="fg-eyebrow">ASTROBASE</span>
          </div>
          <div className="fg-ms-topbar-mission">
            <span>TRAINING SIMULATION</span>
            <strong>{mission.title} — {mission.subtitle}</strong>
          </div>
          <div className="fg-ms-topbar-actions">
            <Link to="/dashboard" className="fg-ms-topbar-exit" aria-label="Exit mission">
              ✕
            </Link>
          </div>
        </div>
      )}

      {/* Phase content */}
      {state.phase === 'disclaimer' && (
        <DisclaimerScreen mission={mission} onStart={handleStart} />
      )}

      {state.phase === 'briefing' && briefingAct && (
        <div className="fg-ms-story-screen">
          {/* Lunar scene background */}
          <div className="fg-lunar-scene fg-ms-story-bg" aria-hidden="true">
            <div className="fg-stars" />
            <div className="fg-earth"><span /></div>
            <div className="fg-moon-horizon"><i /><i /><i /></div>
          </div>
          {/* Story HUD overlay */}
          <div className="fg-ms-story-hud" aria-hidden="true">
            <span>
              <i style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                background: 'var(--fg-red)', boxShadow: '0 0 8px var(--fg-red)', marginRight: 6 }}
              />
              LIVE · HELIX-1 ATMOSPHERIC ADVISORY
            </span>
            <span>ACT 1 — MISSION BRIEFING</span>
          </div>
          {/* Compact HUD */}
          <CompactHUD co2Level={state.co2Level} stability={state.stability} timeLeft={state.timeLeft} />
          {/* Dialogue */}
          <div className="fg-ms-dialogue-area">
            <DialogueBox
              scene={briefingAct.scenes[state.sceneIndex]}
              sceneIndex={state.sceneIndex}
              totalScenes={briefingAct.scenes.length}
              onNext={handleNextScene}
              onBack={handlePrevScene}
              traineeCallsign={trainee?.callsign}
            />
          </div>
        </div>
      )}

      {state.phase === 'decision' && currentDecision && (
        <div className="fg-ms-story-screen">
          {/* Lunar scene background — tinted red on alert */}
          <div className={`fg-lunar-scene fg-ms-story-bg${isAlert ? ' fg-ms-story-bg--alert' : ''}`} aria-hidden="true">
            <div className="fg-stars" />
            <div className="fg-earth"><span /></div>
            <div className="fg-moon-horizon"><i /><i /><i /></div>
          </div>
          <div className="fg-ms-story-hud" aria-hidden="true">
            <span>
              <i style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                background: isAlert ? 'var(--fg-red)' : 'var(--fg-green)',
                boxShadow: `0 0 8px ${isAlert ? 'var(--fg-red)' : 'var(--fg-green)'}`,
                marginRight: 6 }}
              />
              {isAlert ? 'ALERT · CO₂ ELEVATED' : 'ACTIVE · HELIX-1'}
            </span>
            <span>{currentDecision.actLabel}</span>
          </div>
          <CompactHUD co2Level={state.co2Level} stability={state.stability} timeLeft={state.timeLeft} />
          <div className="fg-ms-dialogue-area">
            <DecisionPanel
              decision={currentDecision}
              onConfirm={handleDecision}
              decisionIndex={state.decisionIndex}
            />
          </div>
        </div>
      )}

      {state.phase === 'outcome' && (
        <OutcomeScreen
          mission={mission}
          state={state}
          trainee={trainee}
          onRetry={handleRetry}
          onSave={handleSave}
          alreadySaved={alreadySaved}
        />
      )}
    </main>
  )
}
