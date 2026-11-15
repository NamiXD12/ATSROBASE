/* ─── Results page — Figma visual integration ──────────────────────────────
   Route: /results  (protected)
   Phase 2: restyled with Figma's result-screen / victory-card / ending-card.
   All data logic and localStorage reads unchanged.
─────────────────────────────────────────────────────────────────────────── */
import { useEffect }         from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StarField             from '../components/StarField'
import useTrainee            from '../hooks/useTrainee'
import { ALL_ACHIEVEMENTS, RANK_META } from '../data/constants'

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

/* ── Rank promotion panel ── */
function RankPromotion({ rankBefore, rankAfter }) {
  const promoted = rankBefore !== rankAfter
  const before   = RANK_META[rankBefore] ?? RANK_META['Cadet']
  const after    = RANK_META[rankAfter]  ?? RANK_META['Cadet']
  if (!promoted) return null

  return (
    <div className="fg-rs-promotion" role="status">
      <span className="fg-rs-promotion-label">🎖️ RANK PROMOTION</span>
      <div className="fg-rs-promotion-row">
        <span style={{ color: before.color, opacity: 0.5 }}>{before.icon} {rankBefore}</span>
        <span className="fg-rs-promotion-arrow">→</span>
        <span style={{ color: after.color }}>{after.icon} {rankAfter}</span>
      </div>
      <p className="fg-rs-promotion-msg">
        Your performance has earned you a promotion. This rank is reflected on your Dashboard.
      </p>
    </div>
  )
}

/* ── New achievement badges ── */
function NewAchievements({ newAchievements }) {
  if (!newAchievements?.length) return null
  return (
    <div className="fg-rs-achievements" role="status" aria-live="polite">
      <span className="fg-rs-achievement-label">🏆 ACHIEVEMENTS UNLOCKED</span>
      <div className="fg-rs-achievement-grid">
        {newAchievements.map(id => {
          const a = ALL_ACHIEVEMENTS.find(x => x.id === id)
          if (!a) return null
          return (
            <div key={id} className="fg-rs-achievement-badge">
              <span aria-hidden="true">{a.icon}</span>
              <b>{a.label}</b>
              <span>{a.desc}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════════════════ */
export default function Results() {
  const { trainee, loadLastResult } = useTrainee()
  const result                      = loadLastResult()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  /* No result yet */
  if (!result) {
    return (
      <main className="fg-rs-page">
        <StarField />
        <div className="fg-rs-no-result">
          <div className="fg-ms-result-symbol fg-ms-result-symbol--fail">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="fg-eyebrow">Mission Results</p>
          <h1 className="fg-rs-no-result-title">No Results Yet</h1>
          <p className="fg-rs-no-result-desc">Complete and save a mission to view your debrief here.</p>
          <Link to="/dashboard" className="fg-ms-launch-btn">← Return to Dashboard</Link>
        </div>
      </main>
    )
  }

  const { score, total, passed, perfect, missionTitle, missionSubtitle,
          rankBefore, rankAfter, newAchievements, resources, decisionActs, answers, savedAt } = result
  const pct = Math.round((score / total) * 100)

  return (
    <main className={`fg-rs-page${passed ? '' : ' fg-rs-page--fail'}`}>
      <StarField />

      {/* Page header */}
      <div className="fg-rs-topbar">
        <div>
          <p className="fg-eyebrow">Mission Results</p>
          <h1 className="fg-rs-topbar-title">{missionTitle}</h1>
          {trainee && (
            <p className="fg-rs-topbar-trainee">{trainee.callsign} · {trainee.rank}</p>
          )}
        </div>
        <Link to="/dashboard" className="fg-ms-back-btn">← Dashboard</Link>
      </div>

      {/* Two-column result layout */}
      <div className="fg-rs-cols">

        {/* Left — outcome summary */}
        <div className="fg-rs-summary">
          <div className={`fg-ms-result-symbol${passed ? '' : ' fg-ms-result-symbol--fail'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {passed
                ? <polyline points="20 6 9 17 4 12" />
                : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
            </svg>
          </div>

          <p className="fg-rs-verdict">
            {passed ? (perfect ? 'PERFECT RUN' : 'MISSION SUCCESS') : 'MISSION FAILED'}
          </p>
          <h2 className="fg-rs-title">
            {passed ? (perfect ? 'Flawless Execution' : 'Mission Complete') : 'Crew Evacuated'}
          </h2>
          <p className="fg-rs-desc">
            {passed
              ? perfect
                ? 'Every decision was scientifically sound. Station HELIX-1 is secure.'
                : 'CO₂ levels restored. Station HELIX-1 is secure. Well handled.'
              : 'Too many incorrect decisions destabilised the crew environment. Review the debrief.'}
          </p>

          {/* Score */}
          <div className="fg-rs-score-block">
            <span className="fg-rs-score-num">{score}/{total}</span>
            <span className="fg-rs-score-pct">({pct}%)</span>
            <span className="fg-rs-score-label">correct decisions</span>
          </div>

          {/* Resource deltas */}
          <div className="fg-rs-deltas">
            {[
              { label: 'Final CO₂',      v: `${resources.co2Level.toFixed(1)}%`, good: resources.co2Level < 1 },
              { label: 'Crew Stability', v: `${resources.stability}%`,           good: resources.stability >= 50 },
              { label: 'Time Remaining', v: formatTime(resources.timeLeft),       good: true },
            ].map(d => (
              <div key={d.label} className="fg-rs-delta-row">
                <span>{d.label}</span>
                <strong className={d.good ? 'fg-ms-positive' : 'fg-ms-negative'}>{d.v}</strong>
              </div>
            ))}
          </div>

          {/* Rank promotion */}
          <RankPromotion rankBefore={rankBefore} rankAfter={rankAfter} />

          {/* New achievements */}
          <NewAchievements newAchievements={newAchievements} />

          {/* Actions */}
          <div className="fg-rs-actions">
            <Link to="/mission/rising-tide" className="fg-ms-launch-btn">
              ↺ RETRY MISSION
            </Link>
            <Link to="/dashboard" className="fg-ms-back-btn">
              ← Dashboard
            </Link>
          </div>

          {savedAt && (
            <p className="fg-rs-saved-at">
              Saved {new Date(savedAt).toLocaleString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          )}
        </div>

        {/* Right — science debrief */}
        <div className="fg-rs-science">
          <span className="fg-ms-science-label">MISSION DEBRIEF — ALL 6 DECISIONS</span>
          <p className="fg-ms-science-intro">
            Every decision reviewed with the correct answer and its scientific basis.
          </p>

          {decisionActs?.map((act, idx) => {
            const answer     = answers?.[idx]
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
                    {wasCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="fg-ms-debrief-situation">{act.situation}</p>
                {!wasCorrect && (
                  <p className="fg-ms-debrief-your">Your answer: <em>{chosen?.text}</em></p>
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
    </main>
  )
}
