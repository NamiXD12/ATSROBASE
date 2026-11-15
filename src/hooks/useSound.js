/* ─── useSound — shared Context definition ─────────────────────────────────
   The SoundContext and useSound hook live here (.js — no JSX).
   The SoundProvider component (JSX) lives in SoundProvider.jsx.
   All sound synthesis and playback logic is in SoundProvider.jsx.

   localStorage keys:
     'astrobase_sound'  — 'true' | 'false'
     'astrobase_volume' — '0.0'–'1.0'
─────────────────────────────────────────────────────────────────────────── */
import { createContext, useContext } from 'react'

export const SOUND_KEY  = 'astrobase_sound'
export const VOLUME_KEY = 'astrobase_volume'

export const SoundContext = createContext(null)

export default function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound must be used inside <SoundProvider>')
  return ctx
}
