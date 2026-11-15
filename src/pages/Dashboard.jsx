/* ─── Dashboard — Command Centre (Figma visual integration) ────────────────
   Route: /dashboard  (protected)
   Layout from ASTROBASEfigma: fg-game-interface two-column grid.
   All data wired to real trainee state — nothing invented.
─────────────────────────────────────────────────────────────────────────── */
import { useNavigate, Link }  from 'react-router-dom'
import StarField               from '../components/StarField'
import useTrainee              from '../hooks/useTrainee'
import { RANK_META, ALL_ACHIEVEMENTS, TRAINING_MODULES, MISSION_META, OUTPOST_META } from '../data/constants'

const MODULES = TRAINING_MODULES
const MISSION = MISSION_META

/* ── Progress helper ── */
function calcProgress(trainee) {
  const total     = MODULES.length + 1
  const completed = (trainee.completedModules?.length ?? 0) +
                    (trainee.completedMissions?.length ?? 0)
  return Math.round((completed / total) * 100)
}

/* ════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════ */
function Sidebar({ trainee, onReset }) {
  const rank    = RANK_META[trainee.rank] ?? RANK_META['Cadet']
  const initials = trainee.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const completedModules  = trainee.completedModules  ?? []
  const completedMissions = trainee.completedMissions ?? []

  const steps = [
    ...MODULES.map(m => ({
      id:       m.id,
      label:    m.title,
      sub:      'Training module',
      done:     completedModules.includes(m.id),
      active:   !completedModules.includes(m.id) &&
                completedModules.length === MODULES.indexOf(m),
      href:     `/training/${m.id}`,
    })),
    {
      id:     'rising-tide',
      label:  'RISING TIDE',
      sub:    'Mission simulation',
      done:   completedMissions.includes('rising-tide'),
      active: completedModules.length >= 2 &&
              !completedMissions.includes('rising-tide'),
      href:   '/mission/rising-tide',
    },
  ]

  return (
    <aside className="fg-dashboard-sidebar">
      {/* Commander card */}
      <div className="fg-commander-card">
        <div className="fg-commander-avatar">
          <span>{initials || '??'}</span>
          <i aria-hidden="true" />
        </div>
        <div>
          <strong>{trainee.name}</strong>
          <small>{trainee.callsign}</small>
          <small style={{ color: rank.color, marginTop: 2 }}>
            {rank.icon} {rank.label}
          </small>
        </div>
      </div>

      {/* Chapter / progress nav */}
      <nav className="fg-chapter-nav" aria-label="Training progress">
        <span className="fg-nav-label">Progress</span>
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`fg-chapter-step${step.done ? ' fg-step--complete' : step.active ? ' fg-step--active' : ''}`}
          >
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <p>
              <b>{step.label}</b>
              <small>{step.done ? 'Complete' : step.active ? 'In progress' : 'Locked'}</small>
            </p>
          </div>
        ))}
      </nav>

      {/* Reset profile button */}
      <button className="fg-reset-btn" onClick={onReset} aria-label="Reset profile">
        ⟳ Reset Profile
      </button>
    </aside>
  )
}

/* ════════════════════════════════════════════════════════════════
   RESOURCE GRID — wired to real trainee progress
════════════════════════════════════════════════════════════════ */
function resourcesFromTrainee(trainee) {
  const modules  = trainee.completedModules?.length  ?? 0
  const missions = trainee.completedMissions?.length ?? 0
  const achievs  = trainee.achievements?.length      ?? 0
  const progress = calcProgress(trainee)

  return [
    {
      key:   'training',
      short: 'TRN',
      label: 'Training',
      value: `${modules}/${MODULES.length}`,
      pct:   Math.round((modules / MODULES.length) * 100),
      color: '#5ad8f5',
      warn:  false,
    },
    {
      key:   'missions',
      short: 'MSN',
      label: 'Missions',
      value: missions > 0 ? `${missions} complete` : 'Not started',
      pct:   missions > 0 ? 100 : 0,
      color: '#66df9c',
      warn:  false,
    },
    {
      key:   'progress',
      short: 'PRG',
      label: 'Overall',
      value: `${progress}%`,
      pct:   progress,
      color: '#ffc861',
      warn:  progress < 30,
    },
    {
      key:   'achievements',
      short: 'ACH',
      label: 'Achievements',
      value: `${achievs}/${ALL_ACHIEVEMENTS.length}`,
      pct:   Math.round((achievs / ALL_ACHIEVEMENTS.length) * 100),
      color: '#b494ff',
      warn:  false,
    },
    {
      key:   'rank',
      short: 'RNK',
      label: 'Rank',
      value: trainee.rank,
      pct:   ({ Cadet: 0, 'Junior Astronaut': 33, 'Mission Specialist': 66, 'Senior Astronaut': 100 })[trainee.rank] ?? 0,
      color: (RANK_META[trainee.rank] ?? RANK_META['Cadet']).color,
      warn:  false,
    },
  ]
}

function ResourceGrid({ trainee }) {
  const resources = resourcesFromTrainee(trainee)
  return (
    <div className="fg-systems-grid" role="list" aria-label="Training status">
      {resources.map(r => (
        <div
          key={r.key}
          className={`fg-resource${r.warn ? ' fg-resource--warning' : ''}`}
          role="listitem"
        >
          <div className="fg-resource__top">
            <div className="fg-resource__name">
              <i>{r.short}</i>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <strong style={{ color: r.color }}>{r.value}</strong>
          </div>
          <div className="fg-resource__track" role="progressbar"
            aria-valuenow={r.pct} aria-valuemin="0" aria-valuemax="100"
            aria-label={`${r.label}: ${r.value}`}
          >
            <span style={{ width: `${r.pct}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MISSION FEATURE CARD
════════════════════════════════════════════════════════════════ */
function MissionFeature({ trainee }) {
  const completedModules  = trainee.completedModules  ?? []
  const completedMissions = trainee.completedMissions ?? []
  const prereqsMet  = MISSION.requiredModules.every(id => completedModules.includes(id))
  const missionDone = completedMissions.includes(MISSION.id)

  return (
    <div className="fg-mission-feature">
      {/* Lunar scene background */}
      <div className="fg-lunar-scene fg-mission-bg" aria-hidden="true">
        <div className="fg-stars" />
        <div className="fg-earth"><span /></div>
        <div className="fg-moon-horizon"><i /><i /><i /></div>
      </div>

      <div className="fg-mission-overlay">
        <span className="fg-chapter-chip">MISSION · RISING TIDE</span>
        <h2 className="fg-mission-title">CO₂ SCRUBBER<br />FAILURE</h2>
        <p className="fg-mission-desc">
          Station Helix-1 is losing atmospheric control. Diagnose the fault and
          restore CO₂ removal before the crew is at risk. Six decisions. Real science.
        </p>

        {!prereqsMet ? (
          <div className="fg-mission-locked">
            🔒 Complete both training modules to unlock
          </div>
        ) : missionDone ? (
          <Link to="/results" className="fg-launch-btn fg-launch-btn--done">
            VIEW MISSION RESULTS
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link to="/mission/rising-tide" className="fg-launch-btn">
            LAUNCH MISSION
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   LOWER GRID — training modules + achievements
════════════════════════════════════════════════════════════════ */
function ModuleRoster({ trainee }) {
  const completed = trainee.completedModules ?? []
  return (
    <div className="fg-panel fg-module-roster">
      <div className="fg-section-title">
        <span>
          <i aria-hidden="true" />
          Training Modules
        </span>
        <small>{completed.length}/{MODULES.length} complete</small>
      </div>
      <div className="fg-roster-grid">
        {MODULES.map((mod) => {
          const done = completed.includes(mod.id)
          return (
            <Link
              key={mod.id}
              to={`/training/${mod.id}`}
              className={`fg-roster-unit${done ? ' fg-roster-unit--done' : ''}`}
              aria-label={`${mod.title}${done ? ' — completed' : ''}`}
            >
              <span className="fg-roster-icon" aria-hidden="true">{mod.icon}</span>
              <span>
                <b>{mod.title}</b>
                <small>{done ? '✓ Completed' : 'Available'}</small>
              </span>
              {done && <i aria-hidden="true" />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function AchievementPanel({ trainee }) {
  const unlocked = trainee.achievements ?? []
  const progress = Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100)

  return (
    <div className="fg-panel fg-achievement-panel">
      <div className="fg-section-title">
        <span>Achievements</span>
        <small>{unlocked.length}/{ALL_ACHIEVEMENTS.length}</small>
      </div>

      {/* Progress ring */}
      <div
        className="fg-progress-ring"
        style={{ '--fg-progress': `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Achievement progress: ${progress}%`}
      >
        <span>{progress}%</span>
      </div>

      {/* Achievement tiles */}
      <div className="fg-achievement-tiles">
        {ALL_ACHIEVEMENTS.map((a) => {
          const earned = unlocked.includes(a.id)
          return (
            <div
              key={a.id}
              className={`fg-achievement-tile${earned ? ' fg-achievement-tile--earned' : ''}`}
              title={earned ? a.desc : `Locked — ${a.desc}`}
            >
              <span aria-hidden="true">{earned ? a.icon : '🔒'}</span>
              <span>{a.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   OUTPOST FEATURE CARD — Chapter 2 entry point
════════════════════════════════════════════════════════════════ */
function OutpostFeature({ trainee }) {
  const completedMissions = trainee.completedMissions ?? []
  const risingTideDone    = completedMissions.includes('rising-tide')
  const outpostDone       = completedMissions.includes('lunar-outpost')

  return (
    <div className="fg-outpost-feature">
      <div className="fg-outpost-feature-overlay">
        <span className="fg-chapter-chip" style={{ borderColor: '#50ca7c', color: '#66df9c' }}>
          CHAPTER 2 · LUNAR OUTPOST
        </span>
        <h2 className="fg-mission-title" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)' }}>
          STATION K-12
        </h2>
        <p className="fg-mission-desc">
          Five chapters. Three Androids. Manage electricity, food, oxygen, water
          and radiation. Keep the lunar outpost alive.
        </p>

        {!risingTideDone ? (
          <div className="fg-mission-locked">
            🔒 Complete Chapter 1 (RISING TIDE) to unlock
          </div>
        ) : outpostDone ? (
          <Link to="/outpost/results" className="fg-launch-btn fg-launch-btn--done">
            VIEW OUTPOST RESULTS
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <Link to="/outpost" className="fg-launch-btn" style={{ borderColor: '#50ca7c', background: 'linear-gradient(90deg, #165534, #0e2e1a)' }}>
            LAUNCH OUTPOST
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate              = useNavigate()
  const { trainee, clearTrainee } = useTrainee()

  if (!trainee) {
    navigate('/register', { replace: true })
    return null
  }

  const progress = calcProgress(trainee)

  function handleReset() {
    if (window.confirm(
      'Reset your trainee profile? All progress will be lost.'
    )) {
      clearTrainee()
      navigate('/register', { replace: true })
    }
  }

  return (
    <main className="fg-game-interface">
      <StarField />

      {/* Save indicator (cosmetic, matches Figma) */}
      <div className="fg-save-indicator" aria-live="polite" aria-atomic="true" />

      <div className="fg-dashboard-layout">
        {/* ── Sidebar ── */}
        <Sidebar trainee={trainee} onReset={handleReset} />

        {/* ── Main content ── */}
        <div className="fg-dashboard-main">
          {/* Heading row */}
          <div className="fg-dashboard-heading">
            <div>
              <p className="fg-eyebrow">Mission Control</p>
              <h1 className="fg-dashboard-title">COMMAND CENTRE</h1>
            </div>
            <div className="fg-status-pill">
              <i aria-hidden="true" />
              {progress < 100 ? `${progress}% complete` : 'All objectives met'}
            </div>
          </div>

          {/* Resource / status grid */}
          <ResourceGrid trainee={trainee} />

          {/* Mission feature card — Chapter 1 */}
          <MissionFeature trainee={trainee} />

          {/* Outpost feature card — Chapter 2 */}
          <OutpostFeature trainee={trainee} />

          {/* Lower panels: modules + achievements */}
          <div className="fg-dashboard-lower">
            <ModuleRoster     trainee={trainee} />
            <AchievementPanel trainee={trainee} />
          </div>
        </div>
      </div>
    </main>
  )
}
