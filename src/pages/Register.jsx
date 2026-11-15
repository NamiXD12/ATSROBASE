/* ─── Register page ────────────────────────────────────────────────────────
   Route: /register  (public)
   Creates a new trainee profile and stores it in localStorage.
   Redirects to /dashboard on success.
   If a profile already exists, redirects straight to /dashboard.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import StarField               from '../components/StarField'
import useTrainee              from '../hooks/useTrainee'

/* Callsign format hint shown beneath the input */
const CALLSIGN_HINT = 'Letters and numbers only, e.g. EAGLE-07 or NOVA-3'

/* Simple validation */
function validate(name, callsign) {
  const errors = {}
  if (!name.trim())
    errors.name = 'Full name is required.'
  if (!callsign.trim())
    errors.callsign = 'Callsign is required.'
  else if (!/^[A-Za-z0-9\-]{2,20}$/.test(callsign.trim()))
    errors.callsign = 'Callsign must be 2–20 characters (letters, numbers, hyphens).'
  return errors
}

export default function Register() {
  const navigate               = useNavigate()
  const { trainee, saveTrainee } = useTrainee()

  const [name,     setName]     = useState('')
  const [callsign, setCallsign] = useState('')
  const [errors,   setErrors]   = useState({})
  const [submitting, setSubmitting] = useState(false)

  /* If a profile already exists, skip registration */
  useEffect(() => {
    if (trainee) navigate('/dashboard', { replace: true })
  }, [trainee, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate(name, callsign)
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    setErrors({})
    setSubmitting(true)
    saveTrainee(name, callsign)
    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="register-page">
      <StarField />

      <div className="register-container">
        {/* ── Left panel: branding ── */}
        <div className="register-brand" aria-hidden="true">
          <div className="register-planet">
            <div className="register-planet-ring" />
            <span className="register-planet-icon">🧑‍🚀</span>
          </div>
          <h2 className="register-brand-title">JOIN THE CREW</h2>
          <p className="register-brand-sub">
            Begin your astronaut training programme. Complete modules, run
            simulations, and earn your rank aboard ASTROBASE.
          </p>
          <ul className="register-perks" aria-label="Programme highlights">
            <li><span aria-hidden="true">🛰️</span> Two educational training modules</li>
            <li><span aria-hidden="true">🚀</span> Live mission simulation</li>
            <li><span aria-hidden="true">🏆</span> Rank progression and achievements</li>
            <li><span aria-hidden="true">📡</span> Real space science content</li>
          </ul>
        </div>

        {/* ── Right panel: form ── */}
        <div className="register-form-panel">
          <div className="register-form-header">
            <span className="register-form-icon" aria-hidden="true">✦</span>
            <span className="register-form-label">ASTROBASE INTAKE FORM</span>
          </div>

          <h1 className="register-title">Create Your Profile</h1>
          <p className="register-subtitle">
            Enter your details to receive your astronaut credentials.
          </p>

          <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Astronaut registration form"
          >
            {/* Full Name */}
            <div className="form-field">
              <label className="form-label" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                className={`form-input${errors.name ? ' form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-describedby={errors.name ? 'reg-name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span id="reg-name-error" className="form-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Callsign */}
            <div className="form-field">
              <label className="form-label" htmlFor="reg-callsign">
                Astronaut Callsign
              </label>
              <input
                id="reg-callsign"
                className={`form-input${errors.callsign ? ' form-input--error' : ''}`}
                type="text"
                placeholder="e.g. EAGLE-07"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                autoComplete="off"
                aria-describedby={errors.callsign ? 'reg-callsign-error' : 'reg-callsign-hint'}
                aria-invalid={!!errors.callsign}
              />
              {errors.callsign ? (
                <span id="reg-callsign-error" className="form-error" role="alert">
                  {errors.callsign}
                </span>
              ) : (
                <span id="reg-callsign-hint" className="form-hint">
                  {CALLSIGN_HINT}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary register-submit"
              disabled={submitting}
            >
              <span aria-hidden="true">🚀</span>
              {submitting ? 'Registering…' : 'Begin Training'}
            </button>
          </form>

          <p className="register-login-hint">
            Already registered?{' '}
            <Link to="/dashboard" className="register-link">Go to Dashboard →</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
