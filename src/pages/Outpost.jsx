/* ─── Outpost.jsx — Lunar Outpost Chapter 2 ────────────────────────────────
   Route: /outpost  (protected)

   Five-chapter experience from the ASTROBASEfigma design, fully connected
   to ASTROBASE's existing trainee profile, achievements and localStorage.

   Flow per chapter:
     intro (briefing + android assignment)
     → story (situation report + choice)
     → quiz  (science check)
     → [next chapter or outcome]

   Game state is local (useState). Results are persisted via
   useTrainee().saveOutpostResult() on completion.

   DOES NOT touch missions.js, RISING TIDE state, or /results page.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import StarField               from '../components/StarField'
import useTrainee              from '../hooks/useTrainee'
import useSound                from '../hooks/useSound'
import LUNAR_OUTPOST, {
  ANDROIDS,
  RESOURCE_META,
  INITIAL_RESOURCES,
  OUTPOST_CHAPTERS,
  OUTPOST_PASS_RESOURCE_MIN,
} from '../data/outpostMissions'

/* ════════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════════ */
function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, val))
}

function applyChanges(resources, changes) {
  const next = { ...resources }
  for (const [key, delta] of Object.entries(changes ?? {})) {
    if (key in next) next[key] = clamp(next[key] + delta)
  }
  return next
}

function isGameOver(resources) {
  return Object.values(resources).some(v => v <= OUTPOST_PASS_RESOURCE_MIN)
}

/* ════════════════════════════════════════════════════════════════
   LUNAR SCENE BACKGROUND  (Figma CSS classes, scene variant prop)
════════════════════════════════════════════════════════════════ */
function LunarScene({ scene = '', children }) {
  return (
    <div className={`fg-lunar-scene fg-op-scene${scene ? ` fg-op-scene--${scene}` : ''}`}>
      <div className="fg-stars" aria-hidden="true" />
      <div className="fg-earth" aria-hidden="true"><span /></div>
      <div className="fg-moon-horizon" aria-hidden="true"><i /><i /><i /></div>
      {/* Scene-specific structure elements */}
      <div className="fg-op-scene-structure" aria-hidden="true">
        <span /><span /><span />
      </div>
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESOURCE BARS  (Figma .systems-grid / .resource style)
════════════════════════════════════════════════════════════════ */
function ResourceGrid({ resources }) {
  const keys = Object.keys(RESOURCE_META)
  return (
    <div className="fg-op-resources" role="list" aria-label="Outpost resource levels">
      {keys.map(key => {
        const meta = RESOURCE_META[key]
        const val  = resources[key] ?? 0
        const warn = val <= 25
        const crit = val <= 10
        return (
          <div
            key={key}
            className={`fg-op-resource${warn ? ' fg-op-resource--warning' : ''}${crit ? ' fg-op-resource--critical' : ''}`}
            role="listitem"
          >
            <div className="fg-op-resource-top">
              <span className="fg-op-resource-label">{meta.short}</span>
              <strong
                className="fg-op-resource-value"
                style={{ color: crit ? 'var(--fg-red)' : warn ? 'var(--fg-amber)' : meta.color }}
              >
                {val}
              </strong>
            </div>
            <div
              className="fg-op-resource-track"
              role="meter"
              aria-valuenow={val} aria-valuemin="0" aria-valuemax="100"
              aria-label={`${meta.label}: ${val}`}
            >
              <span style={{
                width: `${val}%`,
                background: crit ? 'var(--fg-red)' : warn ? 'var(--fg-amber)' : meta.color,
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   ANDROID PORTRAIT  (Figma CSS .android-portrait)
════════════════════════════════════════════════════════════════ */
function AndroidPortrait({ androidId, large = false, selected = false }) {
  const android = ANDROIDS[androidId]
  if (!android) return null
  const colorVar = androidId === 'ANDROID-01' ? 'var(--fg-cyan)'
                 : androidId === 'ANDROID-02' ? 'var(--fg-amber)'
                 : 'var(--fg-green)'
  return (
    <div
      className={`fg-op-android${large ? ' fg-op-android--large' : ''}${selected ? ' fg-op-android--selected' : ''}`}
      style={{ '--android-color': colorVar }}
      aria-label={`${androidId} — ${android.role}`}
    >
      <div className="fg-op-android-head">
        <div className="fg-op-android-eye fg-op-android-eye--left" />
        <div className="fg-op-android-eye fg-op-android-eye--right" />
        <div className="fg-op-android-mouth" />
        <div className="fg-op-android-antenna"><i /></div>
      </div>
      <div className="fg-op-android-neck" />
      <div className="fg-op-android-chassis">
        {large && (
          <>
            <span>{androidId}</span>
            <i />
          </>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   DISCLAIMER SCREEN
════════════════════════════════════════════════════════════════ */
function DisclaimerScreen({ onStart }) {
  return (
    <div className="fg-ms-disclaimer">
      {/* Left — lunar scene */}
      <div className="fg-ms-disclaimer-scene">
        <LunarScene scene="solar" />
        <div className="fg-ms-scene-tag">
          <span>LOCATION</span>
          <b>Station K-12 · Lunar Surface</b>
        </div>
        <div className="fg-ms-scene-coords" aria-hidden="true">
          <span>SYSTEMS FAILING</span>
          <span>CREW AT RISK</span>
        </div>
      </div>
      {/* Right — briefing panel */}
      <div className="fg-ms-briefing-panel">
        <p className="fg-eyebrow">Chapter 2</p>
        <h1 className="fg-ms-mission-title">LUNAR OUTPOST</h1>
        <p className="fg-ms-mission-subtitle">{LUNAR_OUTPOST.subtitle}</p>

        <div className="fg-ms-objective">
          <span>MISSION</span>
          <p>
            Station K-12 on the lunar surface is facing five cascading system failures.
            Command three Android specialists, manage five critical resources, and keep
            the outpost alive through every chapter.
          </p>
        </div>

        <div className="fg-op-android-intro" aria-label="Your Android crew">
          {Object.values(ANDROIDS).map(a => (
            <div key={a.id} className="fg-op-android-intro-item">
              <AndroidPortrait androidId={a.id} />
              <div>
                <b>{a.id}</b>
                <span>{a.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fg-ms-disclaimer-note">
          <span>⚠️ DISCLAIMER</span>
          <p>{LUNAR_OUTPOST.disclaimer}</p>
        </div>

        <button className="fg-ms-launch-btn" onClick={onStart}>
          ACCEPT &amp; BEGIN MISSION
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        <Link to="/dashboard" className="fg-ms-back-btn">← Mission Control</Link>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   INTRO SCREEN — Android assignment briefing per chapter
════════════════════════════════════════════════════════════════ */
function ChapterIntro({ chapter, chapterIndex, assignedAndroid, onAssign, onConfirm }) {
  const { sounds } = useSound()
  const speakerAndroid = ANDROIDS[chapter.speaker]

  // Radio beep when the Android's report first appears
  useEffect(() => {
    sounds.radioBeep()
  }, [chapter.number])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fg-op-intro">
      {/* Scene panel */}
      <div className="fg-op-intro-scene">
        <LunarScene scene={chapter.scene} />
        <div className="fg-ms-scene-tag">
          <span>{chapter.system}</span>
          <b>{chapter.location}</b>
        </div>
        <div className="fg-op-chapter-chip" aria-hidden="true">
          CHAPTER {chapter.number}
        </div>
      </div>

      {/* Briefing panel */}
      <div className="fg-ms-briefing-panel">
        <p className="fg-eyebrow">Chapter {chapter.number} of {OUTPOST_CHAPTERS.length}</p>
        <h2 className="fg-ms-mission-title" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)' }}>
          {chapter.title}
        </h2>

        {/* Android report */}
        <div className="fg-ms-objective">
          <span>{chapter.speaker} REPORTS</span>
          <p>{chapter.report}</p>
        </div>

        {/* Objective */}
        <div className="fg-op-objective-box">
          <span>OBJECTIVE</span>
          <p>{chapter.objective}</p>
        </div>

        {/* Android assignment */}
        <div className="fg-op-assignment">
          <div className="fg-op-assignment-header">
            <span>Assign Android</span>
            <small>Select the most suitable specialist</small>
          </div>
          <div className="fg-op-android-options">
            {Object.values(ANDROIDS).map(a => (
              <button
                key={a.id}
                className={`fg-op-android-option${assignedAndroid === a.id ? ' fg-op-android-option--selected' : ''}`}
                onClick={() => { sounds.select(); onAssign(a.id) }}
                aria-pressed={assignedAndroid === a.id}
              >
                <AndroidPortrait androidId={a.id} selected={assignedAndroid === a.id} />
                <span>
                  <b>{a.id}</b>
                  <small>{a.role}</small>
                  <em>{a.specialty}</em>
                </span>
                <i aria-hidden="true">{assignedAndroid === a.id ? '✓' : '○'}</i>
              </button>
            ))}
          </div>
        </div>

        <button
          className="fg-ms-launch-btn"
          onClick={() => { sounds.confirmSound(); onConfirm() }}
          disabled={!assignedAndroid}
          aria-disabled={!assignedAndroid}
        >
          DEPLOY ANDROID &amp; BEGIN
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   STORY SCREEN — situation + three choices
════════════════════════════════════════════════════════════════ */
function StoryScreen({ chapter, resources, assignedAndroid, onChoice }) {
  const { sounds } = useSound()
  const [selected,  setSelected]  = useState(null)
  const [revealed,  setRevealed]  = useState(false)

  // Reset on chapter change + play radio beep when Android begins dialogue
  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    sounds.radioBeep()
  }, [chapter.number])  // eslint-disable-line react-hooks/exhaustive-deps

  const chosen    = revealed ? chapter.choices[selected] : null
  const isSuccess = chosen?.kind === 'success'
  const isFatal   = chosen?.kind === 'fatal'

  function confirm() {
    if (selected === null) return
    sounds.confirmSound()
    setRevealed(true)
    // Play result sound after a short delay so the state updates first
    setTimeout(() => {
      const kind = chapter.choices[selected]?.kind
      if (kind === 'success') sounds.correct()
      else if (kind === 'fatal') sounds.failure()
      else sounds.wrong()
    }, 100)
  }

  return (
    <div className="fg-ms-story-screen">
      {/* Scene background */}
      <LunarScene scene={chapter.scene} />

      {/* Story HUD */}
      <div className="fg-ms-story-hud" aria-hidden="true">
        <span>
          <i style={{ display:'inline-block', width:5, height:5, borderRadius:'50%',
            background:'var(--fg-red)', boxShadow:'0 0 8px var(--fg-red)', marginRight:6 }} />
          CHAPTER {chapter.number} — {chapter.title.toUpperCase()}
        </span>
        <span>{chapter.system.toUpperCase()}</span>
      </div>

      {/* Compact resource bars */}
      <ResourceGrid resources={resources} />

      {/* Android portrait — right side of scene */}
      <div className="fg-op-story-portrait" aria-hidden="true">
        <AndroidPortrait androidId={assignedAndroid} large />
      </div>

      {/* Dialogue + choices overlay */}
      <div className="fg-ms-dialogue-area">
        <div className="fg-dlg-wrap">
          {/* Speaker */}
          <div className="fg-dlg-speaker">
            <i style={{ background: ANDROIDS[chapter.speaker]?.color ?? 'var(--fg-cyan)',
                        boxShadow: `0 0 8px ${ANDROIDS[chapter.speaker]?.color ?? 'var(--fg-cyan)'}` }}
              aria-hidden="true" />
            <span className="fg-dlg-speaker-name"
              style={{ color: ANDROIDS[chapter.speaker]?.color ?? 'var(--fg-cyan)' }}>
              {chapter.speaker}
            </span>
            <span className="fg-dlg-speaker-role">
              {ANDROIDS[chapter.speaker]?.role ?? 'Android'}
            </span>
          </div>

          <p className="fg-dlg-text">{chapter.report}</p>

          {/* Choices */}
          {!revealed && (
            <>
              <div className="fg-dp-choices" role="radiogroup" aria-label="Choose your action">
                {chapter.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    className={`fg-dp-choice${selected === idx ? ' fg-dp-choice--selected' : ''}`}
                    onClick={() => { sounds.select(); setSelected(idx) }}
                    aria-pressed={selected === idx}
                  >
                    <span className="fg-dp-choice-key" aria-hidden="true">
                      {['A','B','C'][idx]}
                    </span>
                    <p className="fg-dp-choice-text">{choice.text}</p>
                  </button>
                ))}
              </div>
              <div className="fg-dp-actions">
                <button
                  className="fg-dp-btn fg-dp-btn--confirm"
                  onClick={confirm}
                  disabled={selected === null}
                >
                  Confirm Decision
                </button>
              </div>
            </>
          )}

          {/* Result reveal */}
          {revealed && chosen && (
            <>
              <div
                className={`fg-dp-feedback${isSuccess ? '' : isFatal ? ' fg-dp-feedback--fatal' : ' fg-dp-feedback--wrong'}`}
                role="status"
                aria-live="polite"
              >
                <strong className="fg-dp-feedback-verdict">
                  {isSuccess ? '✓ SUCCESS' : isFatal ? '✗ CRITICAL FAILURE' : '⚠ WARNING'}
                </strong>
                <p className="fg-dp-feedback-text">{chosen.result}</p>
              </div>
              <div className="fg-op-science-note">
                <span className="fg-ms-science-label">SCIENCE</span>
                <p>{chosen.science}</p>
              </div>
              <div className="fg-dp-actions">
                <button className="fg-dp-btn fg-dp-btn--next" onClick={() => { sounds.click(); onChoice(selected) }}>
                  {isFatal ? 'View Outcome →' : 'Continue to Science Check →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   QUIZ SCREEN — per-chapter science check
════════════════════════════════════════════════════════════════ */
function QuizScreen({ chapter, androidId, onAnswer }) {
  const { sounds } = useSound()
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const { question, options, correct, explanation } = chapter.quiz
  const isCorrect = selected === correct

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    sounds.radioBeep()
  }, [chapter.number])  // eslint-disable-line react-hooks/exhaustive-deps

  function confirm() {
    if (selected === null) return
    sounds.confirmSound()
    setRevealed(true)
    // Play quiz result sound after reveal
    setTimeout(() => {
      if (selected === correct) sounds.quizCorrect()
      else sounds.quizWrong()
    }, 100)
  }

  return (
    <div className="fg-op-quiz-screen">
      {/* Left — quiz card */}
      <div className="fg-op-quiz-card">
        <div className="fg-op-quiz-number" aria-hidden="true">
          {chapter.number}
          <span>SCIENCE CHECK</span>
        </div>

        <p className="fg-eyebrow">{chapter.system}</p>
        <h2 className="fg-op-quiz-question">{question}</h2>

        <div className="fg-op-quiz-options" role="radiogroup" aria-label="Quiz options">
          {options.map((opt, idx) => {
            let cls = 'fg-op-quiz-option'
            if (revealed) {
              if (idx === correct)   cls += ' fg-op-quiz-option--correct'
              else if (idx === selected) cls += ' fg-op-quiz-option--wrong'
            } else if (idx === selected) {
              cls += ' fg-op-quiz-option--selected'
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => { if (!revealed) { sounds.select(); setSelected(idx) } }}
                disabled={revealed}
                aria-pressed={selected === idx}
              >
                <span aria-hidden="true">{['A','B','C'][idx]}</span>
                <p>{opt}</p>
              </button>
            )
          })}
        </div>

        {revealed && (
          <div
            className={`fg-dp-feedback${isCorrect ? '' : ' fg-dp-feedback--wrong'}`}
            role="status"
            aria-live="polite"
          >
            <strong className="fg-dp-feedback-verdict">
              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </strong>
            <p className="fg-dp-feedback-text">{explanation}</p>
          </div>
        )}

        <div className="fg-dp-actions" style={{ marginTop: 16 }}>
          {!revealed ? (
            <button
              className="fg-dp-btn fg-dp-btn--confirm"
              onClick={confirm}
              disabled={selected === null}
            >
              Confirm Answer
            </button>
          ) : (
            <button
              className="fg-dp-btn fg-dp-btn--next"
              onClick={() => { sounds.click(); onAnswer(selected === correct) }}
            >
              Next Chapter →
            </button>
          )}
        </div>
      </div>

      {/* Right — android display */}
      <div className="fg-op-quiz-aside">
        <AndroidPortrait androidId={androidId} large />
        <div>
          <strong>{androidId}</strong>
          <small>{ANDROIDS[androidId]?.role}</small>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   GAME OVER SCREEN
════════════════════════════════════════════════════════════════ */
function GameOverScreen({ chapter, resources, onRetry }) {
  // find which resource hit 0
  const failedResource = Object.entries(resources).find(([,v]) => v <= 0)
  const failedLabel = failedResource
    ? RESOURCE_META[failedResource[0]]?.label ?? failedResource[0]
    : 'Unknown'

  return (
    <div className="fg-op-ending fg-op-ending--gameover">
      <div className="fg-op-failure-grid" aria-hidden="true" />
      <div className="fg-op-ending-card">
        <div className="fg-op-ending-icon fg-op-ending-icon--fail">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <p className="fg-op-ending-label">MISSION FAILED</p>
        <h1 className="fg-op-ending-title">OUTPOST LOST</h1>
        <p className="fg-op-ending-desc">
          A critical failure in Chapter {chapter.number} — {chapter.title} —
          depleted <strong>{failedLabel}</strong> to zero.
          The crew was forced to evacuate Station K-12.
        </p>
        <div className="fg-op-failure-code">
          ERROR · RESOURCE DEPLETION · {failedLabel.toUpperCase()} = 0
        </div>
        <button className="fg-ms-launch-btn fg-op-retry-btn" onClick={onRetry}>
          ↺ RETRY MISSION
        </button>
        <Link to="/dashboard" className="fg-ms-back-btn" style={{ marginTop: 10 }}>
          ← Mission Control
        </Link>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   VICTORY SCREEN
════════════════════════════════════════════════════════════════ */
function VictoryScreen({ resources, chapterResults, newAchievements }) {
  const perfect     = chapterResults.every(r => r.choiceKind === 'success')
  const scienceScore = chapterResults.filter(r => r.quizCorrect).length

  return (
    <div className="fg-op-ending fg-op-ending--victory">
      <div className="fg-lunar-scene fg-op-victory-scene">
        <div className="fg-stars" /><div className="fg-earth"><span /></div>
        <div className="fg-moon-horizon"><i /><i /><i /></div>
      </div>
      <div className="fg-lunar-scene" style={{ position:'absolute', inset:0, background:'rgba(2,8,12,0.7)', backdropFilter:'blur(3px)' }} />

      <div className="fg-op-ending-card fg-op-ending-card--victory">
        <div className="fg-op-ending-icon fg-op-ending-icon--success">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="fg-op-ending-label">{perfect ? 'PERFECT RUN' : 'MISSION COMPLETE'}</p>
        <h1 className="fg-op-ending-title">OUTPOST SECURED</h1>
        <p className="fg-op-ending-desc">
          Station K-12 has survived all five chapter crises.
          {perfect ? ' Every decision was optimal.' : ' Good work, Commander.'}
        </p>

        {/* Stats */}
        <div className="fg-op-victory-stats">
          {[
            { label: 'Science Score',  value: `${scienceScore}/5` },
            { label: 'Chapters',       value: '5/5' },
            { label: 'Run',            value: perfect ? 'PERFECT' : 'COMPLETE' },
          ].map(s => (
            <div key={s.label} className="fg-op-victory-stat">
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>

        {/* New achievements */}
        {newAchievements?.length > 0 && (
          <div className="fg-op-victory-achievements" role="status" aria-live="polite">
            <span className="fg-eyebrow">🏆 Achievements Unlocked</span>
            {newAchievements.map(id => (
              <p key={id} className="fg-op-victory-ach">{id.replace(/_/g, ' ').toUpperCase()}</p>
            ))}
          </div>
        )}

        <Link to="/outpost/results" className="fg-ms-launch-btn" style={{ marginTop: 20 }}>
          VIEW FULL DEBRIEF →
        </Link>
        <Link to="/dashboard" className="fg-ms-back-btn" style={{ marginTop: 10 }}>
          ← Mission Control
        </Link>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════════════════ */
// Phases: 'disclaimer' | 'intro' | 'story' | 'quiz' | 'gameover' | 'victory'
export default function Outpost() {
  const navigate                              = useNavigate()
  const { trainee, saveOutpostResult }        = useTrainee()
  const { sounds, startAmbience, stopAmbience } = useSound()

  const [phase,          setPhase]          = useState('disclaimer')
  const [chapterIndex,   setChapterIndex]   = useState(0)
  const [resources,      setResources]      = useState({ ...INITIAL_RESOURCES })
  const [assignedAndroid,setAssignedAndroid]= useState(null)
  const [chapterResults, setChapterResults] = useState([])
  const [lastChoiceKind, setLastChoiceKind] = useState(null)
  const [newAchievements,setNewAchievements]= useState([])

  const chapter = OUTPOST_CHAPTERS[chapterIndex]

  // Scroll to top on phase / chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase, chapterIndex])

  // Ambience: start on story/quiz phases, stop on endings
  useEffect(() => {
    if (phase === 'story' || phase === 'quiz' || phase === 'intro') {
      startAmbience('lunar')
    } else {
      stopAmbience()
    }
    return () => { if (phase === 'gameover' || phase === 'victory') stopAmbience() }
  }, [phase])

  // Alert: warn when any resource drops low
  const prevLowRef = useRef(false)
  useEffect(() => {
    const isLow = Object.values(resources).some(v => v <= 25)
    if (isLow && !prevLowRef.current) sounds.alert()
    prevLowRef.current = isLow
  }, [resources])

  /* ── Handlers ── */
  function handleStart() {
    sounds.missionStart()
    setPhase('intro')
    setChapterIndex(0)
    setResources({ ...INITIAL_RESOURCES })
    setAssignedAndroid(null)
    setChapterResults([])
  }

  function handleAssign(androidId) {
    setAssignedAndroid(androidId)
  }

  function handleConfirmAssignment() {
    if (!assignedAndroid) return
    setPhase('story')
  }

  function handleChoice(choiceIndex) {
    const choice = chapter.choices[choiceIndex]
    const isFatal = choice.kind === 'fatal'

    // Apply resource changes
    const nextResources = applyChanges(resources, choice.changes)

    // Android synergy bonus/penalty
    const correctAndroid = assignedAndroid === chapter.android
    const synergyDelta   = { electricity: correctAndroid ? +3 : -3 }
    if (choice.kind !== 'fatal') {
      nextResources.electricity = clamp(nextResources.electricity + synergyDelta.electricity)
    }

    setResources(nextResources)
    setLastChoiceKind(choice.kind)

    // Check gameover: fatal choice OR any resource at 0
    if (isFatal || isGameOver(nextResources)) {
      setChapterResults(prev => [...prev, {
        chapterNumber:  chapter.number,
        choiceIndex,
        choiceKind:     choice.kind,
        androidCorrect: assignedAndroid === chapter.android,
        quizCorrect:    false,
      }])
      sounds.failure()
      setPhase('gameover')
      return
    }

    // Record partial result, move to quiz
    setChapterResults(prev => [...prev, {
      chapterNumber:  chapter.number,
      choiceIndex,
      choiceKind:     choice.kind,
      androidCorrect: assignedAndroid === chapter.android,
      quizCorrect:    false,   // updated after quiz
    }])
    setPhase('quiz')
  }

  function handleQuizAnswer(correct) {
    // Update the last chapter result with quiz correctness
    setChapterResults(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = { ...updated[updated.length - 1], quizCorrect: correct }
      return updated
    })

    const isLastChapter = chapterIndex >= OUTPOST_CHAPTERS.length - 1

    if (isLastChapter) {
      // All chapters complete — save and show victory
      finishOutpost(chapterResults.map((r, i) =>
        i === chapterResults.length - 1 ? { ...r, quizCorrect: correct } : r
      ))
    } else {
      // Next chapter
      setChapterIndex(i => i + 1)
      setAssignedAndroid(null)
      setPhase('intro')
    }
  }

  function finishOutpost(finalResults) {
    const survived = true  // reached here without gameover
    // saveOutpostResult computes achievements + writes to localStorage
    saveOutpostResult({
      chapterResults: finalResults,
      finalResources: resources,
      survived,
      scienceScore:   finalResults.filter(r => r.quizCorrect).length,
      chapters:       OUTPOST_CHAPTERS.map((ch, i) => ({
        number:    ch.number,
        title:     ch.title,
        choiceIndex: finalResults[i]?.choiceIndex ?? 0,
        choiceKind:  finalResults[i]?.choiceKind  ?? 'warning',
        choiceText:  ch.choices[finalResults[i]?.choiceIndex ?? 0]?.text ?? '',
        science:     ch.choices[finalResults[i]?.choiceIndex ?? 0]?.science ?? '',
        quiz:        ch.quiz,
        quizCorrect: finalResults[i]?.quizCorrect ?? false,
        androidAssigned: finalResults[i]?.androidCorrect
          ? ch.android : Object.keys(ANDROIDS).find(id => id !== ch.android) ?? ch.android,
        androidCorrect: finalResults[i]?.androidCorrect ?? false,
      })),
    })
    // Retrieve newly earned achievements for the victory screen
    const existing  = trainee?.achievements ?? []
    const newAchs   = [
      survived && !existing.includes('outpost_commander')       ? 'outpost_commander' : null,
      survived && finalResults.every(r => r.androidCorrect) && !existing.includes('android_synergy') ? 'android_synergy' : null,
      survived && finalResults.every(r => r.quizCorrect)    && !existing.includes('science_ace')     ? 'science_ace'     : null,
    ].filter(Boolean)
    setNewAchievements(newAchs)
    sounds.success()
    setPhase('victory')
  }

  function handleRetry() {
    setPhase('disclaimer')
    setChapterIndex(0)
    setResources({ ...INITIAL_RESOURCES })
    setAssignedAndroid(null)
    setChapterResults([])
    setLastChoiceKind(null)
  }

  /* ── Render ── */
  const showTopbar = phase === 'story' || phase === 'quiz' || phase === 'intro'

  return (
    <main className="fg-ms-page">
      {/* Mission top bar during active phases */}
      {showTopbar && (
        <div className="fg-ms-topbar">
          <div className="fg-ms-topbar-brand">
            <span className="fg-eyebrow">ASTROBASE</span>
          </div>
          <div className="fg-ms-topbar-mission">
            <span>CHAPTER 2 — LUNAR OUTPOST</span>
            <strong>Chapter {chapter.number}: {chapter.title}</strong>
          </div>
          <div className="fg-ms-topbar-actions">
            <button
              className="fg-ms-topbar-exit"
              onClick={() => {
                if (window.confirm('Exit Lunar Outpost? Progress in this run will be lost.'))
                  navigate('/dashboard')
              }}
              aria-label="Exit mission"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {phase === 'disclaimer' && (
        <DisclaimerScreen onStart={handleStart} />
      )}

      {phase === 'intro' && chapter && (
        <ChapterIntro
          chapter={chapter}
          chapterIndex={chapterIndex}
          assignedAndroid={assignedAndroid}
          onAssign={handleAssign}
          onConfirm={handleConfirmAssignment}
        />
      )}

      {phase === 'story' && chapter && (
        <StoryScreen
          chapter={chapter}
          resources={resources}
          assignedAndroid={assignedAndroid}
          onChoice={handleChoice}
        />
      )}

      {phase === 'quiz' && chapter && (
        <QuizScreen
          chapter={chapter}
          androidId={assignedAndroid ?? chapter.android}
          onAnswer={handleQuizAnswer}
        />
      )}

      {phase === 'gameover' && chapter && (
        <GameOverScreen
          chapter={chapter}
          resources={resources}
          onRetry={handleRetry}
        />
      )}

      {phase === 'victory' && (
        <VictoryScreen
          resources={resources}
          chapterResults={chapterResults}
          newAchievements={newAchievements}
        />
      )}
    </main>
  )
}
