/* ─── ASTROBASE shared constants ───────────────────────────────────────────
   Single source of truth for ranks, achievements, modules and missions.
   Import from here — never duplicate these definitions across pages.
─────────────────────────────────────────────────────────────────────────── */

export const RANK_META = {
  'Cadet': {
    label: 'Cadet',
    icon:  '⭐',
    color: '#64748b',
    desc:  'Beginning your astronaut journey.',
  },
  'Junior Astronaut': {
    label: 'Junior Astronaut',
    icon:  '⭐⭐',
    color: '#60a5fa',
    desc:  'Both training modules completed.',
  },
  'Mission Specialist': {
    label: 'Mission Specialist',
    icon:  '⭐⭐⭐',
    color: '#c084fc',
    desc:  'Successfully completed a mission.',
  },
  'Senior Astronaut': {
    label: 'Senior Astronaut',
    icon:  '🌟',
    color: '#fbbf24',
    desc:  'Achieved a perfect mission score.',
  },
}

export const ALL_ACHIEVEMENTS = [
  {
    id:    'first_mission',
    icon:  '🚀',
    label: 'First Mission',
    desc:  'Attempt your first mission.',
  },
  {
    id:    'life_support_specialist',
    icon:  '🌬️',
    label: 'Life-Support Specialist',
    desc:  'Complete the Spacecraft Life-Support Systems module.',
  },
  {
    id:    'spacewalk_certified',
    icon:  '🧑‍🚀',
    label: 'Spacewalk Certified',
    desc:  'Complete the Spacewalk Safety Protocols module.',
  },
  {
    id:    'perfect_decision_maker',
    icon:  '💯',
    label: 'Perfect Decision Maker',
    desc:  'Answer all 6 mission decisions correctly.',
  },
  {
    id:    'mission_survivor',
    icon:  '🏆',
    label: 'Mission Survivor',
    desc:  'Successfully complete RISING TIDE.',
  },
  /* ── Chapter 2 — Lunar Outpost achievements ── */
  {
    id:    'outpost_commander',
    icon:  '🌕',
    label: 'Outpost Commander',
    desc:  'Complete all five Lunar Outpost chapters in a single run.',
  },
  {
    id:    'android_synergy',
    icon:  '🤖',
    label: 'Android Synergy',
    desc:  'Assign the correct Android for every chapter.',
  },
  {
    id:    'science_ace',
    icon:  '🔬',
    label: 'Science Ace',
    desc:  'Answer all five chapter quiz questions correctly.',
  },
]

export const TRAINING_MODULES = [
  {
    id:          'life-support',
    title:       'Spacecraft Life-Support Systems',
    description: 'O₂ generation, CO₂ removal, water recovery, and pressure management.',
    icon:        '🌬️',
    color:       'blue',
  },
  {
    id:          'spacewalk',
    title:       'Spacewalk Safety Protocols',
    description: 'EMU suit operations, tether procedures, and emergency re-entry.',
    icon:        '🧑‍🚀',
    color:       'purple',
  },
]

export const MISSION_META = {
  id:              'rising-tide',
  title:           'RISING TIDE',
  subtitle:        'CO₂ Scrubber Fault — Station Helix-1',
  description:     'A CO₂ scrubber has failed aboard fictional training station Helix-1. Diagnose the fault and restore safe atmospheric conditions before the crew is at risk.',
  icon:            '🚨',
  requiredModules: ['life-support', 'spacewalk'],
}

/* ── Chapter 2 — Lunar Outpost mission metadata ─────────────────────────────
   Used by Dashboard to display the Chapter 2 mission card.
   The full chapter data lives in outpostMissions.js.
   requiredMissions: the trainee must have completed RISING TIDE first.
─────────────────────────────────────────────────────────────────────────── */
export const OUTPOST_META = {
  id:               'lunar-outpost',
  title:            'LUNAR OUTPOST',
  subtitle:         'Five Chapters · Three Androids · Resource Management',
  description:      'Station K-12 on the lunar surface is facing cascading system failures. ' +
                    'Command three Android specialists across five chapters, manage five ' +
                    'critical resources, and keep the outpost alive.',
  icon:             '🌕',
  requiredMissions: ['rising-tide'],   // must complete Chapter 1 first
}

/* ── Chapter 2 achievement IDs (convenience list for logic) ─── */
export const OUTPOST_ACHIEVEMENT_IDS = [
  'outpost_commander',
  'android_synergy',
  'science_ace',
]
