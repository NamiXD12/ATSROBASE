/* ─── DecisionPanel — with sound effects ───────────────────────────────────
   Sound hooks added; all logic and visual markup unchanged.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import useSound from '../hooks/useSound'

export default function DecisionPanel({ decision, onConfirm, decisionIndex }) {
  const { sounds } = useSound()
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
  }, [decision])

  const chosen    = revealed && decision.choices[selected]
  const isCorrect = chosen?.isCorrect ?? false

  function handleSelect(idx) {
    if (!revealed) { sounds.select(); setSelected(idx) }
  }
  function handleConfirm() {
    if (selected !== null) {
      setRevealed(true)
      // Play result sound after a short delay so the state updates first
      setTimeout(() => {
        const correct = decision.choices[selected]?.isCorrect
        if (correct) sounds.correct(); else sounds.wrong()
      }, 80)
    }
  }
  function handleNext() { sounds.click(); onConfirm(selected) }

  const totalDecisions = 6
  const progressPct = Math.round((decisionIndex / totalDecisions) * 100)

  return (
    <div className="fg-dp-wrap">
      <div className="fg-dp-header">
        <div className="fg-dp-meta">
          <span className="fg-dp-act">{decision.actLabel}</span>
          <span className="fg-dp-counter">
            Decision {decision.decisionNumber}/{decision.totalInAct}
          </span>
        </div>
        <div className="fg-dp-progress-track" role="progressbar"
          aria-valuenow={decisionIndex} aria-valuemin="0" aria-valuemax={totalDecisions}
          aria-label={`Decision ${decisionIndex + 1} of ${totalDecisions}`}
        >
          <div className="fg-dp-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="fg-dp-situation">
        <span className="fg-dp-situation-label">⚡ SITUATION</span>
        <p className="fg-dp-situation-text">{decision.situation}</p>
      </div>

      <div className="fg-dp-context">
        <span className="fg-dp-context-label">GUIDANCE</span>
        <p className="fg-dp-context-text">{decision.context}</p>
      </div>

      <div className="fg-dp-choices" role="radiogroup" aria-label="Choose your action">
        {decision.choices.map((choice, idx) => {
          let cls = 'fg-dp-choice'
          if (revealed) {
            if (choice.isCorrect)      cls += ' fg-dp-choice--correct'
            else if (idx === selected) cls += ' fg-dp-choice--wrong'
          } else if (idx === selected) {
            cls += ' fg-dp-choice--selected'
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}
              disabled={revealed} aria-pressed={selected === idx}>
              <span className="fg-dp-choice-key" aria-hidden="true">{['A','B','C'][idx]}</span>
              <p className="fg-dp-choice-text">{choice.text}</p>
              {revealed && choice.isCorrect &&
                <span className="fg-dp-choice-tick" aria-hidden="true">✓</span>}
              {revealed && !choice.isCorrect && idx === selected &&
                <span className="fg-dp-choice-cross" aria-hidden="true">✗</span>}
            </button>
          )
        })}
      </div>

      {revealed && chosen && (
        <div
          className={`fg-dp-feedback${isCorrect ? ' fg-dp-feedback--correct' : ' fg-dp-feedback--wrong'}`}
          role="status" aria-live="polite"
        >
          <strong className="fg-dp-feedback-verdict">
            {isCorrect ? '✓ CORRECT DECISION' : '✗ INCORRECT DECISION'}
          </strong>
          <p className="fg-dp-feedback-text">{chosen.consequence}</p>
        </div>
      )}

      <div className="fg-dp-actions">
        {!revealed ? (
          <button className="fg-dp-btn fg-dp-btn--confirm" onClick={handleConfirm}
            disabled={selected === null}>
            Confirm Decision
          </button>
        ) : (
          <button className="fg-dp-btn fg-dp-btn--next" onClick={handleNext}>
            {decisionIndex >= 5 ? 'View Mission Outcome →' : 'Next Decision →'}
          </button>
        )}
      </div>
    </div>
  )
}
