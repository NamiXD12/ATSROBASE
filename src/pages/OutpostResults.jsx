/* ─── OutpostResults.jsx — Lunar Outpost Chapter 2 Debrief ─────────────────
   Route: /outpost/results  (protected)
   Reads from localStorage key 'astrobase_outpost_result'.
   Completely separate from /results (RISING TIDE).
─────────────────────────────────────────────────────────────────────────── */
import { useEffect }         from 'react'
import { Link }              from 'react-router-dom'
import StarField             from '../components/StarField'
import useTrainee            from '../hooks/useTrainee'
import { RESOURCE_META, ANDROIDS } from '../data/outpostMissions'
import { ALL_ACHIEVEMENTS }  from '../data/constants'

function formatResource(key, value) {
  const meta = RESOURCE_META[key]
  return { label: meta?.label ?? key, value, color: meta?.color ?? '#fff' }
}

export default function OutpostResults() {
  const { trainee, loadOutpostResult } = useTrainee()
  const result = loadOutpostResult()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  /* No result yet */
  if (!result) {
    return (
      <main className="fg-rs-page">
        <StarField />
        <div className="fg-rs-no-result">
          <p className="fg-eyebrow">Lunar Outpost</p>
          <h1 className="fg-rs-no-result-title">No Results Yet</h1>
          <p className="fg-rs-no-result-desc">
            Complete the Lunar Outpost mission to view your debrief here.
          </p>
          <Link to="/outpost" className="fg-ms-launch-btn">Go to Outpost →</Link>
        </div>
      </main>
    )
  }

  const { survived, scienceScore, finalResources, chapters,
          newAchievements, rankAfter, savedAt } = result

  const perfect      = chapters?.every(c => c.choiceKind === 'success') ?? false
  const totalChapters = chapters?.length ?? 0

  return (
    <main className={`fg-rs-page${survived ? '' : ' fg-rs-page--fail'}`}>
      <StarField />

      {/* Header */}
      <div className="fg-rs-topbar">
        <div>
          <p className="fg-eyebrow">Chapter 2 — Lunar Outpost</p>
          <h1 className="fg-rs-topbar-title">MISSION DEBRIEF</h1>
          {trainee && (
            <p className="fg-rs-topbar-trainee">{trainee.callsign} · {trainee.rank}</p>
          )}
        </div>
        <Link to="/dashboard" className="fg-ms-back-btn">← Dashboard</Link>
      </div>

      {/* Two-column layout */}
      <div className="fg-rs-cols">

        {/* Left — outcome summary */}
        <div className="fg-rs-summary">
          {/* Result symbol */}
          <div className={`fg-ms-result-symbol${survived ? '' : ' fg-ms-result-symbol--fail'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {survived
                ? <polyline points="20 6 9 17 4 12" />
                : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
            </svg>
          </div>

          <p className="fg-rs-verdict">
            {survived ? (perfect ? 'PERFECT RUN' : 'OUTPOST SECURED') : 'OUTPOST LOST'}
          </p>
          <h2 className="fg-rs-title">
            {survived
              ? perfect ? 'Flawless Command' : 'Mission Complete'
              : 'Crew Evacuated'}
          </h2>
          <p className="fg-rs-desc">
            {survived
              ? `Station K-12 survived all ${totalChapters} chapters.${perfect ? ' Every decision was optimal.' : ''}`
              : 'A critical resource failure forced crew evacuation. Review the chapter log and try again.'}
          </p>

          {/* Score */}
          <div className="fg-rs-score-block">
            <span className="fg-rs-score-num">{scienceScore}/{totalChapters}</span>
            <span className="fg-rs-score-label">science questions correct</span>
          </div>

          {/* Final resources */}
          {finalResources && (
            <div className="fg-rs-deltas">
              {Object.entries(finalResources).map(([key, val]) => {
                const meta = RESOURCE_META[key]
                const bad  = val <= 25
                return (
                  <div key={key} className="fg-rs-delta-row">
                    <span>{meta?.label ?? key}</span>
                    <strong style={{ color: bad ? 'var(--fg-red)' : meta?.color ?? 'inherit',
                                     font: `500 10px var(--fg-mono)` }}>
                      {val}
                    </strong>
                  </div>
                )
              })}
            </div>
          )}

          {/* New achievements */}
          {newAchievements?.length > 0 && (
            <div className="fg-rs-achievements" role="status">
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
          )}

          {/* Actions */}
          <div className="fg-rs-actions">
            <Link to="/outpost" className="fg-ms-launch-btn">↺ RETRY OUTPOST</Link>
            <Link to="/dashboard" className="fg-ms-back-btn">← Dashboard</Link>
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

        {/* Right — chapter-by-chapter log */}
        <div className="fg-rs-science">
          <span className="fg-ms-science-label">CHAPTER LOG — ALL {totalChapters} CHAPTERS</span>
          <p className="fg-ms-science-intro">
            Every chapter reviewed: Android assignment, decision outcome, and science check.
          </p>

          {chapters?.map((ch, idx) => (
            <div
              key={ch.number}
              className={`fg-ms-debrief-item${ch.choiceKind === 'success' ? ' fg-ms-debrief-item--correct' : ' fg-ms-debrief-item--wrong'}`}
            >
              {/* Chapter header */}
              <div className="fg-ms-debrief-header">
                <span className="fg-ms-debrief-act">
                  CH {ch.number} — {ch.title?.toUpperCase()}
                </span>
                <span className={`fg-ms-debrief-verdict${ch.choiceKind === 'success' ? ' fg-ms-debrief-verdict--correct' : ' fg-ms-debrief-verdict--wrong'}`}>
                  {ch.choiceKind === 'success' ? '✓ Optimal' : ch.choiceKind === 'warning' ? '⚠ Warning' : '✗ Fatal'}
                </span>
              </div>

              {/* Android */}
              <p className="fg-ms-debrief-situation" style={{ fontSize: '9px', color: 'var(--fg-muted)' }}>
                Android assigned: <strong style={{ color: ch.androidCorrect ? 'var(--fg-green)' : 'var(--fg-amber)' }}>
                  {ch.androidAssigned}{ch.androidCorrect ? ' ✓ Correct' : ' ○ Suboptimal'}
                </strong>
              </p>

              {/* Decision */}
              <p className="fg-ms-debrief-situation">{ch.choiceText}</p>

              {/* Science */}
              <p className="fg-ms-debrief-explanation">{ch.science}</p>

              {/* Quiz */}
              <div className="fg-ms-debrief-header" style={{ marginTop: 6 }}>
                <span style={{ font: '500 7px var(--fg-mono)', color: 'var(--fg-cyan)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Science Check
                </span>
                <span className={`fg-ms-debrief-verdict${ch.quizCorrect ? ' fg-ms-debrief-verdict--correct' : ' fg-ms-debrief-verdict--wrong'}`}>
                  {ch.quizCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <p className="fg-ms-debrief-situation" style={{ fontSize: '9px' }}>{ch.quiz?.question}</p>
              <p className="fg-ms-debrief-explanation">{ch.quiz?.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
