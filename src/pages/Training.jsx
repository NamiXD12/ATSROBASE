/* ─── Training page ────────────────────────────────────────────────────────
   Route: /training  and  /training/:moduleId   (protected)

   Three views, all rendered within this one component:
     1. Hub       — lists both modules, shows completion status
     2. Module    — intro → lessons (with progress dots) → quiz → result
   The URL param :moduleId selects which module to open.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect }     from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import StarField                   from '../components/StarField'
import useTrainee                  from '../hooks/useTrainee'
import trainingModules             from '../data/trainingModules'

const PASS_SCORE = 0.6   // 60% required to pass

/* ════════════════════════════════════════════════════════════════
   TRAINING HUB — module selection screen
════════════════════════════════════════════════════════════════ */
function TrainingHub({ trainee }) {
  const completed = trainee?.completedModules ?? []
  const allDone   = trainingModules.every(m => completed.includes(m.id))

  return (
    <main className="training-page">
      <StarField />
      <div className="training-inner">

        {/* Header */}
        <div className="training-hub-header">
          <p className="training-hub-eyebrow">
            <span aria-hidden="true">📚</span> ASTRONAUT TRAINING ACADEMY
          </p>
          <h1 className="training-hub-title">
            Select Your <span className="gradient-text">Training Module</span>
          </h1>
          <p className="training-hub-sub">
            Complete both modules to unlock the mission simulation. Each module
            includes educational lessons and a five-question quiz. A score of
            60% or higher is required to pass.
          </p>
          {allDone && (
            <div className="training-all-done" role="status">
              🎉 Both modules complete — your mission is now unlocked!{' '}
              <Link to="/dashboard" className="training-all-done-link">
                Go to Dashboard →
              </Link>
            </div>
          )}
        </div>

        {/* Module cards */}
        <div className="training-hub-grid">
          {trainingModules.map((mod) => {
            const done = completed.includes(mod.id)
            return (
              <ModuleCard
                key={mod.id}
                module={mod}
                done={done}
              />
            )
          })}
        </div>

        <div className="training-hub-back">
          <Link to="/dashboard" className="btn-secondary">
            ← Mission Control
          </Link>
        </div>
      </div>
    </main>
  )
}

function ModuleCard({ module, done }) {
  return (
    <Link
      to={`/training/${module.id}`}
      className={`tm-card tm-card--${module.color}${done ? ' tm-card--done' : ''}`}
      aria-label={`${module.title}${done ? ' — completed' : ''}`}
    >
      <div className="tm-card-top">
        <span className="tm-card-icon" aria-hidden="true">{module.icon}</span>
        {done ? (
          <span className="tm-badge tm-badge--done">✓ Completed</span>
        ) : (
          <span className="tm-badge tm-badge--open">Open →</span>
        )}
      </div>
      <h2 className="tm-card-title">{module.title}</h2>
      <p className="tm-card-subtitle">{module.subtitle}</p>
      <p className="tm-card-desc">{module.description}</p>
      <div className="tm-card-meta">
        <span>📖 {module.lessons.length} lessons</span>
        <span>❓ {module.quiz.length} questions</span>
        <span>🎯 60% to pass</span>
      </div>
    </Link>
  )
}

/* ════════════════════════════════════════════════════════════════
   MODULE FLOW — intro → lessons → quiz → result
════════════════════════════════════════════════════════════════ */

/* ── Phase: Intro ─────────────────────────────────────────────── */
function ModuleIntro({ module, onStart }) {
  return (
    <div className="mf-intro">
      <div className="mf-intro-icon" aria-hidden="true">{module.icon}</div>
      <p className="mf-intro-label">MODULE BRIEFING</p>
      <h2 className="mf-title">{module.title}</h2>
      <p className="mf-subtitle">{module.subtitle}</p>
      <p className="mf-intro-desc">{module.description}</p>

      <div className="mf-intro-steps">
        <div className="mf-intro-step">
          <span aria-hidden="true">📖</span>
          <span>{module.lessons.length} Lesson Screens</span>
        </div>
        <div className="mf-intro-step">
          <span aria-hidden="true">❓</span>
          <span>{module.quiz.length} Multiple-Choice Questions</span>
        </div>
        <div className="mf-intro-step">
          <span aria-hidden="true">🎯</span>
          <span>Pass mark: 60% ({Math.ceil(module.quiz.length * PASS_SCORE)}/{module.quiz.length} correct)</span>
        </div>
      </div>

      <div className="mf-intro-note">
        <strong>📌 Note:</strong> Lesson content is based on publicly available NASA
        educational resources, simplified for this training simulation. It does
        not represent official NASA procedures.
      </div>

      <button className="btn-primary mf-btn" onClick={onStart}>
        <span aria-hidden="true">▶</span> Begin Module
      </button>
    </div>
  )
}

/* ── Phase: Lesson ────────────────────────────────────────────── */
function LessonScreen({ module, lessonIndex, onNext, onBack }) {
  const lesson   = module.lessons[lessonIndex]
  const total    = module.lessons.length
  const isLast   = lessonIndex === total - 1

  // Scroll to top when lesson changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [lessonIndex])

  return (
    <div className="mf-lesson">
      {/* Progress dots */}
      <div className="mf-progress" aria-label={`Lesson ${lessonIndex + 1} of ${total}`}>
        {module.lessons.map((_, i) => (
          <span
            key={i}
            className={`mf-dot${i === lessonIndex ? ' mf-dot--active' : i < lessonIndex ? ' mf-dot--done' : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mf-lesson-header">
        <span className="mf-lesson-num">
          Lesson {lessonIndex + 1} of {total}
        </span>
        <span className="mf-lesson-icon" aria-hidden="true">{lesson.icon}</span>
      </div>

      <h2 className="mf-title">{lesson.title}</h2>

      <div className="mf-lesson-body">
        {lesson.body.map((para, i) => (
          <p
            key={i}
            className={`mf-lesson-para${para.startsWith('⚠️') ? ' mf-lesson-para--note' : ''}`}
          >
            {para}
          </p>
        ))}
      </div>

      <div className="mf-nav">
        <button className="btn-secondary mf-btn" onClick={onBack}>
          ← {lessonIndex === 0 ? 'Intro' : 'Previous'}
        </button>
        <button className="btn-primary mf-btn" onClick={onNext}>
          {isLast ? 'Start Quiz →' : 'Next Lesson →'}
        </button>
      </div>
    </div>
  )
}

/* ── Phase: Quiz ──────────────────────────────────────────────── */
function QuizScreen({ module, onComplete }) {
  const [qIndex,    setQIndex]    = useState(0)
  const [selected,  setSelected]  = useState(null)   // index of chosen option
  const [revealed,  setRevealed]  = useState(false)   // show feedback?
  const [answers,   setAnswers]   = useState([])      // { chosen, correct }[]

  const question = module.quiz[qIndex]
  const total    = module.quiz.length
  const isLast   = qIndex === total - 1

  // Scroll to top on each new question
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [qIndex])

  function handleSelect(idx) {
    if (revealed) return   // prevent changing after reveal
    setSelected(idx)
  }

  function handleConfirm() {
    if (selected === null) return
    setRevealed(true)
  }

  function handleNext() {
    const record = { chosen: selected, correct: question.correctIndex }
    const newAnswers = [...answers, record]

    if (isLast) {
      onComplete(newAnswers)
    } else {
      setAnswers(newAnswers)
      setQIndex(q => q + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const isCorrect = revealed && selected === question.correctIndex

  return (
    <div className="mf-quiz">
      {/* Quiz progress bar */}
      <div className="mf-quiz-header">
        <span className="mf-quiz-label">Question {qIndex + 1} of {total}</span>
        <div className="mf-quiz-track" role="progressbar"
          aria-valuenow={qIndex + 1} aria-valuemin="1" aria-valuemax={total}
          aria-label={`Question ${qIndex + 1} of ${total}`}
        >
          <div
            className="mf-quiz-fill"
            style={{ width: `${((qIndex) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="mf-quiz-icon" aria-hidden="true">❓</div>
      <h2 className="mf-quiz-question">{question.question}</h2>

      {/* Answer options */}
      <div className="mf-options" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt, idx) => {
          let cls = 'mf-option'
          if (revealed) {
            if (idx === question.correctIndex) cls += ' mf-option--correct'
            else if (idx === selected)         cls += ' mf-option--wrong'
          } else if (idx === selected) {
            cls += ' mf-option--selected'
          }

          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              aria-pressed={selected === idx}
              role="radio"
              aria-checked={selected === idx}
            >
              <span className="mf-option-letter" aria-hidden="true">
                {['A', 'B', 'C', 'D'][idx]}
              </span>
              <span className="mf-option-text">{opt}</span>
              {revealed && idx === question.correctIndex && (
                <span className="mf-option-tick" aria-hidden="true">✓</span>
              )}
              {revealed && idx === selected && idx !== question.correctIndex && (
                <span className="mf-option-cross" aria-hidden="true">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback panel */}
      {revealed && (
        <div
          className={`mf-feedback${isCorrect ? ' mf-feedback--correct' : ' mf-feedback--wrong'}`}
          role="status"
          aria-live="polite"
        >
          <p className="mf-feedback-verdict">
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="mf-feedback-explanation">{question.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="mf-quiz-actions">
        {!revealed ? (
          <button
            className="btn-primary mf-btn"
            onClick={handleConfirm}
            disabled={selected === null}
          >
            Confirm Answer
          </button>
        ) : (
          <button className="btn-primary mf-btn" onClick={handleNext}>
            {isLast ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Phase: Result ────────────────────────────────────────────── */
function ModuleResult({ module, answers, onRetry, onDone }) {
  const correct = answers.filter(a => a.chosen === a.correct).length
  const total   = answers.length
  const pct     = Math.round((correct / total) * 100)
  const passed  = correct / total >= PASS_SCORE

  // Scroll to top
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  return (
    <div className="mf-result">
      <div
        className={`mf-result-banner${passed ? ' mf-result-banner--pass' : ' mf-result-banner--fail'}`}
        role="status"
        aria-live="polite"
      >
        <span className="mf-result-emoji" aria-hidden="true">
          {passed ? '🏆' : '📋'}
        </span>
        <div>
          <p className="mf-result-verdict">{passed ? 'MODULE PASSED' : 'MODULE INCOMPLETE'}</p>
          <p className="mf-result-score">
            {correct}/{total} correct &mdash; {pct}%
          </p>
          {passed ? (
            <p className="mf-result-msg">
              Well done! You have demonstrated understanding of <strong>{module.title}</strong>.
            </p>
          ) : (
            <p className="mf-result-msg">
              You need {Math.ceil(total * PASS_SCORE)}/{total} correct to pass. Review the lessons and try again.
            </p>
          )}
        </div>
      </div>

      {/* Answer breakdown */}
      <div className="mf-result-breakdown">
        <h3 className="mf-result-breakdown-title">Answer Review</h3>
        {answers.map((a, i) => {
          const q       = module.quiz[i]
          const correct = a.chosen === a.correct
          return (
            <div
              key={i}
              className={`mf-review-item${correct ? ' mf-review-item--correct' : ' mf-review-item--wrong'}`}
            >
              <div className="mf-review-top">
                <span className="mf-review-num">Q{i + 1}</span>
                <span className={`mf-review-verdict${correct ? ' mf-review-verdict--correct' : ' mf-review-verdict--wrong'}`}>
                  {correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <p className="mf-review-question">{q.question}</p>
              {!correct && (
                <p className="mf-review-your-answer">
                  Your answer: <em>{q.options[a.chosen]}</em>
                </p>
              )}
              <p className="mf-review-correct-answer">
                Correct: <strong>{q.options[a.correct]}</strong>
              </p>
              <p className="mf-review-explanation">{q.explanation}</p>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mf-result-actions">
        {!passed && (
          <button className="btn-primary mf-btn" onClick={onRetry}>
            ↺ Retry Quiz
          </button>
        )}
        {passed && (
          <button className="btn-primary mf-btn" onClick={onDone}>
            ✓ Save & Continue
          </button>
        )}
        <Link to="/training" className="btn-secondary mf-btn">
          ← Training Hub
        </Link>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MODULE WRAPPER — manages phase state for a single module
════════════════════════════════════════════════════════════════ */
// Phases: 'intro' | 'lesson' | 'quiz' | 'result'
function ModuleFlow({ module, trainee, updateTrainee }) {
  const navigate = useNavigate()
  const alreadyDone = trainee?.completedModules?.includes(module.id)

  const [phase,       setPhase]       = useState('intro')
  const [lessonIndex, setLessonIndex] = useState(0)
  const [answers,     setAnswers]     = useState([])

  function startModule() {
    setPhase('lesson')
    setLessonIndex(0)
  }

  function handleLessonNext() {
    if (lessonIndex < module.lessons.length - 1) {
      setLessonIndex(i => i + 1)
    } else {
      setPhase('quiz')
    }
  }

  function handleLessonBack() {
    if (lessonIndex === 0) {
      setPhase('intro')
    } else {
      setLessonIndex(i => i - 1)
    }
  }

  function handleQuizComplete(finalAnswers) {
    setAnswers(finalAnswers)
    setPhase('result')
  }

  function handleRetry() {
    setAnswers([])
    setPhase('quiz')
  }

  function handleSave() {
    const correct = answers.filter(a => a.chosen === a.correct).length
    const passed  = correct / answers.length >= PASS_SCORE
    if (!passed) return

    // Build achievement ID for this module
    const achievementId = module.id === 'life-support' ? 'life_support_specialist' : 'spacewalk_certified'

    // Update trainee profile
    const current = trainee
    const newModules      = [...new Set([...(current.completedModules ?? []), module.id])]
    const newAchievements = [...new Set([...(current.achievements ?? []), achievementId])]

    updateTrainee({
      completedModules: newModules,
      achievements:     newAchievements,
    })

    navigate('/dashboard')
  }

  // If the module is already completed, show intro with a "review" note
  return (
    <div className="mf-container">
      {/* Back link */}
      <Link to="/training" className="mf-back-link">
        ← Training Hub
      </Link>

      {/* Already-completed banner */}
      {alreadyDone && phase === 'intro' && (
        <div className="mf-already-done" role="status">
          ✓ You have already passed this module. You can review the content below.
        </div>
      )}

      {/* Phase renderer */}
      {phase === 'intro'  && <ModuleIntro  module={module} onStart={startModule} />}
      {phase === 'lesson' && (
        <LessonScreen
          module={module}
          lessonIndex={lessonIndex}
          onNext={handleLessonNext}
          onBack={handleLessonBack}
        />
      )}
      {phase === 'quiz'   && <QuizScreen   module={module} onComplete={handleQuizComplete} />}
      {phase === 'result' && (
        <ModuleResult
          module={module}
          answers={answers}
          onRetry={handleRetry}
          onDone={alreadyDone ? () => navigate('/dashboard') : handleSave}
        />
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE ROOT — decides Hub or Module view from URL param
════════════════════════════════════════════════════════════════ */
export default function Training() {
  const { moduleId }                    = useParams()
  const { trainee, updateTrainee }      = useTrainee()
  const navigate                        = useNavigate()

  // Find module by ID if one is in the URL
  const activeModule = moduleId
    ? trainingModules.find(m => m.id === moduleId)
    : null

  // Unknown moduleId — go back to hub
  if (moduleId && !activeModule) {
    navigate('/training', { replace: true })
    return null
  }

  return (
    <main className="training-page">
      <StarField />
      <div className="training-inner">
        {activeModule ? (
          <ModuleFlow
            module={activeModule}
            trainee={trainee}
            updateTrainee={updateTrainee}
          />
        ) : (
          <TrainingHub trainee={trainee} />
        )}
      </div>
    </main>
  )
}
