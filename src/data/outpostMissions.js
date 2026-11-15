/* ─── Lunar Outpost — Chapter 2 mission data ───────────────────────────────
   Source: ASTROBASEfigma / App.tsx — translated from TypeScript to plain JS.
   All five chapters, three Android characters, five resources, and per-chapter
   quiz questions are defined here.

   THIS FILE IS ENTIRELY SEPARATE FROM missions.js (RISING TIDE).
   It does not modify, import or depend on missions.js.

   Data shapes:
     Chapter   { number, title, system, location, scene, android, speaker,
                 report, objective, choices[], quiz }
     Choice    { text, result, science, changes, kind }
     Quiz      { question, options[], correct, explanation }
     Android   { id, role, specialty, color }
     Resource  { key, label, short, color }

   DISCLAIMER (shown on-screen at the start of each chapter):
   This is a fictional educational simulation set on a fictional lunar
   outpost. All characters, systems and procedures are invented for
   educational purposes. Resource meters are gameplay abstractions and
   do not represent real spacecraft engineering specifications.
─────────────────────────────────────────────────────────────────────────── */

/* ════════════════════════════════════════════════════════════════
   ANDROID CHARACTERS
════════════════════════════════════════════════════════════════ */
export const ANDROIDS = {
  'ANDROID-01': {
    id:        'ANDROID-01',
    role:      'Science & Communications',
    specialty: 'Analysis, sensors, mission coordination',
    color:     '#5ad8f5',   // cyan
  },
  'ANDROID-02': {
    id:        'ANDROID-02',
    role:      'Engineering & Maintenance',
    specialty: 'Electrical, mechanical, structural repair',
    color:     '#ffc861',   // amber
  },
  'ANDROID-03': {
    id:        'ANDROID-03',
    role:      'Agriculture & Logistics',
    specialty: 'Hydroponics, supplies, crew delivery',
    color:     '#66df9c',   // green
  },
}

/* ════════════════════════════════════════════════════════════════
   RESOURCES
   Initial values and display metadata.
   Values are integers 0–100 (gameplay abstractions only).
════════════════════════════════════════════════════════════════ */
export const RESOURCE_META = {
  electricity: { key: 'electricity', label: 'Electricity',         short: 'PWR', color: '#ffc861' },
  food:        { key: 'food',        label: 'Food Supply',          short: 'AGR', color: '#66df9c' },
  oxygen:      { key: 'oxygen',      label: 'Oxygen',               short: 'O₂',  color: '#5ad8f5' },
  water:       { key: 'water',       label: 'Water',                short: 'H₂O', color: '#689cff' },
  radiation:   { key: 'radiation',   label: 'Radiation Protection', short: 'RAD', color: '#b494ff' },
}

export const INITIAL_RESOURCES = {
  electricity: 80,
  food:        75,
  oxygen:      90,
  water:       85,
  radiation:   100,
}

/* ════════════════════════════════════════════════════════════════
   PASS THRESHOLD
   The player passes each chapter if they chose a 'success' or 'warning'
   outcome (not 'fatal') and no resource has reached 0.
   The outpost run is "survived" if the player completes all 5 chapters
   without a gameover. Perfect run = all 5 chapter choices have kind 'success'.
════════════════════════════════════════════════════════════════ */
export const OUTPOST_PASS_RESOURCE_MIN = 1   // any resource at 0 → gameover

/* ════════════════════════════════════════════════════════════════
   FIVE CHAPTERS
════════════════════════════════════════════════════════════════ */
export const OUTPOST_CHAPTERS = [

  /* ── Chapter 01 — Locked Command Centre ──────────────────────── */
  {
    number:    '01',
    title:     'Locked Command Centre',
    system:    'Power management',
    location:  'Solar array junction',
    scene:     'solar',
    android:   'ANDROID-02',   // correct android to assign
    speaker:   'ANDROID-01',   // android who delivers the briefing
    report:
      'Commander, the door control bus is offline. Array B is producing power, ' +
      'but a damaged connection is preventing it from reaching essential systems. ' +
      'The good news: I can still make jokes. The bad news: they also require electricity.',
    objective:
      'Diagnose the electrical fault and restore essential power distribution.',
    choices: [
      {
        text:   'Send an electrical diagnostic, isolate the damaged branch, then repair it.',
        result: 'The fault is isolated before ANDROID-02 replaces the connector. Essential power stabilises.',
        science:
          'Photovoltaic cells convert sunlight into electricity. Batteries store excess energy, ' +
          'while distribution systems isolate faults so one damaged circuit does not disable ' +
          'an entire habitat.',
        changes: { electricity: +14, radiation: -3 },
        kind:   'success',
      },
      {
        text:   'Connect the array directly to every outpost system at maximum output.',
        result: 'The uncontrolled surge damages a battery controller. Power remains available, but capacity falls.',
        science:
          'Power systems need voltage regulation and circuit protection. Bypassing controllers ' +
          'can overload wiring and damage energy storage equipment.',
        changes: { electricity: -24, oxygen: -5 },
        kind:   'warning',
      },
      {
        text:   'Disable all batteries and wait for the fault to clear itself.',
        result: 'Stored power disappears during the lunar shadow period. Life-support circulation stops.',
        science:
          'Solar generation is intermittent. A lunar habitat needs stored energy to maintain ' +
          'essential loads whenever sunlight is unavailable.',
        changes: { electricity: -80, oxygen: -30 },
        kind:   'fatal',
      },
    ],
    quiz: {
      question: 'Why does a lunar outpost need batteries if it has solar panels?',
      options: [
        'To supply electricity when sunlight is unavailable',
        'To create oxygen directly from moonlight',
        'To shield the habitat from cosmic radiation',
      ],
      correct:     0,
      explanation:
        'Batteries store energy generated in sunlight and release it when solar production ' +
        'drops or demand rises — for example, during the lunar night or when demand peaks.',
    },
  },

  /* ── Chapter 02 — The Dying Greenhouse ───────────────────────── */
  {
    number:    '02',
    title:     'The Dying Greenhouse',
    system:    'Food production',
    location:  'Hydroponics module',
    scene:     'greenhouse',
    android:   'ANDROID-03',
    speaker:   'ANDROID-03',
    report:
      'Commander, nutrient flow in hydroponics bay two has stopped. Root moisture ' +
      'is falling and leaf temperatures are rising. We have ninety minutes before ' +
      'crop damage becomes permanent.',
    objective:
      'Restore water circulation while protecting the greenhouse crop.',
    choices: [
      {
        text:   'Inspect the pump, clear the blocked filter, and restart flow gradually.',
        result: 'ANDROID-03 clears mineral buildup and restores a controlled nutrient flow. The crop recovers.',
        science:
          'Hydroponics delivers water and dissolved nutrients directly to plant roots. ' +
          'Pumps, filters, oxygenation, light, temperature, and nutrient concentration ' +
          'must all be controlled.',
        changes: { food: +16, water: -8, electricity: -5 },
        kind:   'success',
      },
      {
        text:   'Flood the root beds with the entire emergency water reserve.',
        result: 'The roots receive water, but poor oxygenation causes stress and valuable water is lost.',
        science:
          'Plant roots require oxygen as well as water. In controlled agriculture, ' +
          'excessive flooding can reduce root oxygen and waste a limited habitat resource.',
        changes: { food: -8, water: -28, electricity: -3 },
        kind:   'warning',
      },
      {
        text:   'Increase greenhouse heat to accelerate plant growth.',
        result: 'Higher heat increases water loss and damages already stressed plants. The food crop fails.',
        science:
          'Plants require a controlled temperature range. Heating cannot replace water, ' +
          'nutrients, light, or healthy roots.',
        changes: { food: -75, water: -20 },
        kind:   'fatal',
      },
    ],
    quiz: {
      question: 'What does a hydroponic system deliver directly to plant roots?',
      options: [
        'Lunar soil and compressed air',
        'Water containing dissolved nutrients',
        'Radiation that replaces sunlight',
      ],
      correct:     1,
      explanation:
        'Hydroponics grows plants without soil by circulating water with carefully ' +
        'balanced dissolved nutrients directly to the root zone.',
    },
  },

  /* ── Chapter 03 — The Radiation Warning ──────────────────────── */
  {
    number:    '03',
    title:     'The Radiation Warning',
    system:    'Radiation shielding',
    location:  'Habitat perimeter',
    scene:     'radiation',
    android:   'ANDROID-01',
    speaker:   'ANDROID-01',
    report:
      'Solar monitoring reports a fast-rising particle event. Habitat sector C ' +
      'has weakened shielding. The crew has twelve minutes to reach a protected location.',
    objective:
      'Verify the warning, secure the habitat, and shelter the crew.',
    choices: [
      {
        text:   'Confirm dosimeter data, route crew to the storm shelter, and close sector C.',
        result: 'The crew reaches the shielded core before particle levels peak. Exposure remains low.',
        science:
          'The Moon lacks Earth\'s thick atmosphere and global magnetic field. ' +
          'Dense shielding and storm shelters reduce exposure during solar particle events.',
        changes: { radiation: +8, electricity: -7, food: -4 },
        kind:   'success',
      },
      {
        text:   'Keep the crew at work and rely on their spacesuits indoors.',
        result: 'Operations continue, but avoidable exposure accumulates before the crew relocates.',
        science:
          'A spacesuit provides limited radiation protection. During a major event, ' +
          'time, distance, monitoring, and properly shielded shelter are safer controls.',
        changes: { radiation: -35, oxygen: -6 },
        kind:   'warning',
      },
      {
        text:   'Disable the radiation alarm to prevent panic.',
        result: 'The crew receives no warning and remains in the exposed sector during the event.',
        science:
          'Radiation cannot be detected by human senses. Monitoring and rapid ' +
          'emergency procedures are essential — disabling alarms eliminates the only warning.',
        changes: { radiation: -100 },
        kind:   'fatal',
      },
    ],
    quiz: {
      question: 'Why is radiation a greater concern on the Moon than on Earth?',
      options: [
        'Lunar rocks create radiation at night',
        'The Moon has no protective atmosphere or global magnetic field like Earth\'s',
        'Solar panels attract cosmic rays',
      ],
      correct:     1,
      explanation:
        'Earth\'s atmosphere and magnetic field deflect and absorb much of the radiation ' +
        'reaching the surface. The Moon offers far less natural protection, making ' +
        'shielding and monitoring critical for any long-duration mission.',
    },
  },

  /* ── Chapter 04 — Oxygen Emergency ───────────────────────────── */
  {
    number:    '04',
    title:     'Oxygen Emergency',
    system:    'Life support',
    location:  'Habitat utility spine',
    scene:     'lifesupport',
    android:   'ANDROID-02',
    speaker:   'ANDROID-01',
    report:
      'Commander, cabin pressure is falling and oxygen makeup demand is increasing. ' +
      'Sensors indicate a leak near the water recovery assembly. ' +
      'We need immediate instructions.',
    objective:
      'Locate the leak, restore pressure, and verify water recycling.',
    choices: [
      {
        text:   'Close the affected branch, locate the leak with sensors, then patch and pressure-test it.',
        result: 'ANDROID-02 isolates a cracked coupling. Pressure and oxygen concentration return to safe levels.',
        science:
          'Environmental Control and Life Support Systems manage atmosphere, pressure, ' +
          'temperature, water, and waste. Isolating a leaking section limits loss before repair.',
        changes: { oxygen: +14, water: +9, electricity: -8 },
        kind:   'success',
      },
      {
        text:   'Add oxygen continuously without finding the leak.',
        result: 'Oxygen briefly rises, but gas continues escaping and reserves are depleted.',
        science:
          'Replacing lost gas does not correct a pressure leak. The damaged section ' +
          'must be located, isolated, repaired, and tested.',
        changes: { oxygen: -28, electricity: -8 },
        kind:   'warning',
      },
      {
        text:   'Disable the entire oxygen regulation system.',
        result: 'Atmosphere control stops. The colony cannot maintain breathable air or safe pressure.',
        science:
          'Active atmosphere monitoring and regulation are essential in a sealed habitat. ' +
          'Disabling them during a leak removes critical protection.',
        changes: { oxygen: -100, water: -20 },
        kind:   'fatal',
      },
    ],
    quiz: {
      question: 'What is the safest first response to a confirmed habitat air leak?',
      options: [
        'Raise the temperature until the leak closes',
        'Isolate the affected section, locate the leak, and repair it',
        'Turn off all environmental sensors',
      ],
      correct:     1,
      explanation:
        'Isolation limits atmospheric loss. Sensors then support location, repair, and ' +
        'a pressure test before the section reopens. Disabling sensors would remove ' +
        'the ability to confirm the repair.',
    },
  },

  /* ── Chapter 05 — The Final Protocol ─────────────────────────── */
  {
    number:    '05',
    title:     'The Final Protocol',
    system:    'Integrated operations',
    location:  'Outpost-wide network',
    scene:     'finale',
    android:   'ANDROID-01',
    speaker:   'ANDROID-01',
    report:
      'A cascading control fault is drawing power from life support, greenhouse ' +
      'circulation, and the storm shelter. The door repair can proceed only after ' +
      'we stabilise the network.',
    objective:
      'Prioritise survival loads, coordinate all Androids, and restore the Command Centre door.',
    choices: [
      {
        text:   'Protect life support first, shelter the crew, then restore food systems and repair the door.',
        result: 'All three Androids execute the sequence. Essential systems stabilise and the Command Centre door unlocks.',
        science:
          'Emergency operations prioritise immediate threats to life, isolate faults, and ' +
          'restore lower-priority systems in a controlled sequence. Integrated monitoring ' +
          'prevents one repair from harming another system.',
        changes: { electricity: -12, food: -6, oxygen: +8, water: -5, radiation: +5 },
        kind:   'success',
      },
      {
        text:   'Use all available power on the door motor before stabilising the habitat.',
        result: 'The door moves, but power loss interrupts air circulation and greenhouse pumps.',
        science:
          'Crew escape is important, but diverting all power from active survival systems ' +
          'can create a more immediate hazard than the one being resolved.',
        changes: { electricity: -38, food: -18, oxygen: -24, water: -12 },
        kind:   'warning',
      },
      {
        text:   'Factory-reset the central computer during the emergency.',
        result: 'Monitoring, Android control, and automated survival systems all go offline simultaneously.',
        science:
          'Removing every control and monitoring function during a multi-system emergency ' +
          'eliminates situational awareness and coordinated response capability.',
        changes: { electricity: -100, oxygen: -100, radiation: -100 },
        kind:   'fatal',
      },
    ],
    quiz: {
      question: 'Which principle is most important during a multi-system habitat emergency?',
      options: [
        'Prioritise immediate threats to life and restore systems in a controlled order',
        'Repair the most visible equipment first',
        'Disable monitoring to reduce electrical use',
      ],
      correct:     0,
      explanation:
        'Emergency response protects life-critical functions first, preserves situational ' +
        'awareness, and restores other systems methodically. Disabling monitoring during ' +
        'an emergency removes the information needed to make safe decisions.',
    },
  },
]

/* ════════════════════════════════════════════════════════════════
   TOP-LEVEL EXPORT
════════════════════════════════════════════════════════════════ */
const LUNAR_OUTPOST = {
  id:       'lunar-outpost',
  title:    'LUNAR OUTPOST',
  subtitle: 'Five chapters. Three Androids. One chance to survive.',
  disclaimer:
    'FICTIONAL EDUCATIONAL SIMULATION — Station K-12 and all characters, systems ' +
    'and procedures are invented for educational purposes. Resource meters are gameplay ' +
    'abstractions only. Scientific content is simplified for a training context.',
  androids:         ANDROIDS,
  resourceMeta:     RESOURCE_META,
  initialResources: INITIAL_RESOURCES,
  chapters:         OUTPOST_CHAPTERS,
}

export default LUNAR_OUTPOST
