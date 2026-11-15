/* ─── SoundProvider — Web Audio API synthesised sound effects ──────────────
   All sounds generated programmatically — no audio files, no npm packages.

   Rules:
   - Sound is OFF by default (respects autoplay restrictions).
   - User enables it via the 🔊 toggle in the navbar.
   - Preference persisted in localStorage: 'astrobase_sound' / 'astrobase_volume'.
   - All sound functions are safe no-ops when disabled or AudioContext unavailable.
   - Background ambience is a separate loop started/stopped by page components.
─────────────────────────────────────────────────────────────────────────── */
import { useState, useCallback, useRef, useEffect } from 'react'
import { SoundContext, SOUND_KEY, VOLUME_KEY }       from './useSound'

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(SOUND_KEY) === 'true' } catch { return false }
  })
  const [volume, setVolume] = useState(() => {
    try { return parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.5') } catch { return 0.5 }
  })

  const ctxRef      = useRef(null)
  const ambienceRef = useRef(null)

  /* ── AudioContext — lazy, resumed on demand ── */
  function getCtx() {
    if (!enabled) return null
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || window.webkitAudioContext)() }
      catch { return null }
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {})
    return ctxRef.current
  }

  function toggleSound() {
    const next = !enabled
    setEnabled(next)
    try { localStorage.setItem(SOUND_KEY, String(next)) } catch {}
    if (!next) stopAmbience()
  }

  function changeVolume(val) {
    const v = Math.max(0, Math.min(1, val))
    setVolume(v)
    try { localStorage.setItem(VOLUME_KEY, String(v)) } catch {}
  }

  /* ── Core synthesiser helpers ── */
  function playTone({ freq = 440, type = 'sine', duration = 0.08,
                      gain = 0.3, attack = 0.005, release = 0.05,
                      startOffset = 0 } = {}) {
    const ctx = getCtx(); if (!ctx) return
    const now = ctx.currentTime + startOffset
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    const vol = ctx.createGain()
    vol.gain.value = volume * gain
    osc.type = type
    osc.frequency.setValueAtTime(freq, now)
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(1, now + attack)
    env.gain.setValueAtTime(1, now + duration - release)
    env.gain.linearRampToValueAtTime(0, now + duration)
    osc.connect(env); env.connect(vol); vol.connect(ctx.destination)
    osc.start(now); osc.stop(now + duration)
  }

  function playNoise({ duration = 0.1, gain = 0.15, lowpass = 800 } = {}) {
    const ctx = getCtx(); if (!ctx) return
    const bufferSize = ctx.sampleRate * duration
    const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data       = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2) - 1
    const source  = ctx.createBufferSource()
    const filter  = ctx.createBiquadFilter()
    const env     = ctx.createGain()
    const vol     = ctx.createGain()
    source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = lowpass
    vol.gain.value = volume * gain
    const now = ctx.currentTime
    env.gain.setValueAtTime(0.8, now); env.gain.linearRampToValueAtTime(0, now + duration)
    source.connect(filter); filter.connect(env); env.connect(vol); vol.connect(ctx.destination)
    source.start(now)
  }

  /* ── Named sound effects ── */
  const sounds = {
    click: useCallback(() => {
      playTone({ freq: 880, type: 'sine', duration: 0.04, gain: 0.2, attack: 0.002, release: 0.03 })
    }, [enabled, volume]),

    select: useCallback(() => {
      playTone({ freq: 660, duration: 0.05, gain: 0.18, attack: 0.003 })
      playTone({ freq: 528, duration: 0.05, gain: 0.12, attack: 0.003, startOffset: 0.03 })
    }, [enabled, volume]),

    missionStart: useCallback(() => {
      [261.6, 329.6, 392, 523.3].forEach((f, i) =>
        playTone({ freq: f, duration: 0.18, gain: 0.25, attack: 0.01, startOffset: i * 0.1 }))
    }, [enabled, volume]),

    correct: useCallback(() => {
      playTone({ freq: 523.3, duration: 0.12, gain: 0.3, attack: 0.005 })
      playTone({ freq: 659.3, duration: 0.14, gain: 0.3, attack: 0.005, startOffset: 0.1 })
      playTone({ freq: 783.9, duration: 0.2,  gain: 0.25, attack: 0.005, startOffset: 0.2 })
    }, [enabled, volume]),

    wrong: useCallback(() => {
      playTone({ freq: 220, type: 'sawtooth', duration: 0.15, gain: 0.2, attack: 0.005 })
      playTone({ freq: 180, type: 'sawtooth', duration: 0.2,  gain: 0.2, attack: 0.005, startOffset: 0.12 })
    }, [enabled, volume]),

    alert: useCallback(() => {
      [0, 0.18, 0.36].forEach(offset =>
        playTone({ freq: 440, type: 'square', duration: 0.12, gain: 0.22, attack: 0.005, startOffset: offset }))
    }, [enabled, volume]),

    success: useCallback(() => {
      [[392, 0], [523.3, 0.12], [659.3, 0.24], [783.9, 0.36], [1046.5, 0.5]]
        .forEach(([f, o]) => playTone({ freq: f, duration: 0.25, gain: 0.28, attack: 0.01, startOffset: o }))
    }, [enabled, volume]),

    failure: useCallback(() => {
      [[440, 0], [392, 0.15], [349.2, 0.3], [293.7, 0.5]]
        .forEach(([f, o]) => playTone({ freq: f, type: 'sawtooth', duration: 0.25, gain: 0.22, attack: 0.01, startOffset: o }))
      playNoise({ duration: 0.4, gain: 0.1, lowpass: 300 })
    }, [enabled, volume]),

    quizCorrect: useCallback(() => {
      playTone({ freq: 783.9,  duration: 0.1,  gain: 0.25, attack: 0.005 })
      playTone({ freq: 1046.5, duration: 0.18, gain: 0.22, attack: 0.005, startOffset: 0.08 })
    }, [enabled, volume]),

    quizWrong: useCallback(() => {
      playTone({ freq: 311.1, type: 'triangle', duration: 0.2, gain: 0.2, attack: 0.01 })
    }, [enabled, volume]),

    /* Radio communication beep — played when an Android starts speaking.
       Two short tones: a high chirp followed by a lower tone,
       mimicking a walkie-talkie transmission opening. */
    radioBeep: useCallback(() => {
      playTone({ freq: 1200, type: 'sine', duration: 0.05, gain: 0.18, attack: 0.002, release: 0.04 })
      playTone({ freq: 800,  type: 'sine', duration: 0.08, gain: 0.15, attack: 0.002, release: 0.06, startOffset: 0.05 })
    }, [enabled, volume]),

    /* Confirmation beep — played when Confirm Decision is clicked.
       A short ascending two-note tone that feels like a command acknowledged. */
    confirmSound: useCallback(() => {
      playTone({ freq: 587.3, type: 'sine', duration: 0.06, gain: 0.22, attack: 0.003, release: 0.04 })
      playTone({ freq: 880,   type: 'sine', duration: 0.1,  gain: 0.25, attack: 0.003, release: 0.07, startOffset: 0.05 })
    }, [enabled, volume]),
  }

  /* ── Background ambience ── */
  function startAmbience(type = 'station') {
    if (!enabled) return
    stopAmbience()
    const ctx = getCtx(); if (!ctx) return
    const bufSecs = 2
    const buffer  = ctx.createBuffer(1, ctx.sampleRate * bufSecs, ctx.sampleRate)
    const data    = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2) - 1
    const src   = ctx.createBufferSource()
    const filt  = ctx.createBiquadFilter()
    const gainN = ctx.createGain()
    src.buffer = buffer; src.loop = true
    filt.type  = 'lowpass'; filt.frequency.value = type === 'lunar' ? 120 : 80
    gainN.gain.value = volume * (type === 'lunar' ? 0.08 : 0.06)
    src.connect(filt); filt.connect(gainN); gainN.connect(ctx.destination)
    src.start()
    const osc     = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = type === 'lunar' ? 55 : 40
    lfoGain.gain.value  = volume * (type === 'lunar' ? 0.04 : 0.03)
    osc.connect(lfoGain); lfoGain.connect(ctx.destination)
    osc.start()
    ambienceRef.current = { src, gainNode: gainN, osc, lfoGain }
  }

  function stopAmbience() {
    if (!ambienceRef.current) return
    const { src, gainNode, osc, lfoGain } = ambienceRef.current
    const ctx = ctxRef.current
    if (ctx && gainNode) gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    if (ctx && lfoGain) lfoGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    setTimeout(() => {
      try { src?.stop() } catch {}
      try { osc?.stop() } catch {}
    }, 1600)
    ambienceRef.current = null
  }

  useEffect(() => { if (!enabled) stopAmbience() }, [enabled])

  return (
    <SoundContext.Provider value={{
      enabled, volume, toggleSound, changeVolume,
      sounds, startAmbience, stopAmbience,
    }}>
      {children}
    </SoundContext.Provider>
  )
}
