# ASTROBASE — Astronaut Training & Mission Simulation

A futuristic, NASA-inspired astronaut training website built for the NASA Space Apps Challenge 2026. Combines visual novel storytelling, educational training modules, and interactive space mission simulations — all grounded in real space science.

## Features

### Trainee Registration
- Create a personalised astronaut profile with name and callsign
- Profile persists in `localStorage` across browser sessions
- Route protection: protected pages redirect to registration if no profile exists

### Mission Control Dashboard
- Futuristic command centre with resource status panels
- Rank progression: Cadet → Junior Astronaut → Mission Specialist → Senior Astronaut
- Training module progress, mission status, and achievement tracking
- Reset profile option

### Training Academy (2 modules)
- **Spacecraft Life-Support Systems** — oxygen generation, CO₂ removal, water recovery, cabin pressure
- **Spacewalk Safety Protocols** — EMU suit operations, tether procedures, emergency re-entry
- Each module: 4 lesson screens + 5-question quiz (60% pass required)
- Immediate feedback with scientific explanations after each answer

### Chapter 1 — RISING TIDE (CO₂ Scrubber Failure)
- Cinematic visual-novel briefing with character portraits
- 6 interactive decisions across Diagnosis and Repair phases
- Real-time CO₂ level, crew stability, and countdown timer
- Success/failure branching based on decision accuracy (4/6 to pass)
- Full mission debrief with scientific explanations for every decision

### Chapter 2 — LUNAR OUTPOST (Station K-12)
- 5 chapters with cascading system failures on a lunar surface station
- 3 Android specialists to assign (science, engineering, agriculture)
- 5 cumulative resources: electricity, food, oxygen, water, radiation protection
- Per-chapter science quiz checks
- Resource depletion triggers game over; survival of all 5 chapters wins

### Achievements (8 total)
- First Mission, Life-Support Specialist, Spacewalk Certified
- Perfect Decision Maker, Mission Survivor
- Outpost Commander, Android Synergy, Science Ace

### Sound System
- Web Audio API synthesised sound effects (no external audio files)
- Radio communication beeps, UI clicks, decision feedback, mission outcomes
- Background ambience during missions
- Sound is OFF by default; toggle in navbar; volume slider included
- Preferences persist in localStorage

## Technology Stack

- **React 19** — UI framework
- **Vite 8** — build tool and dev server
- **React Router 7** — client-side routing
- **Web Audio API** — synthesised sound effects
- **localStorage** — all data persistence (no backend, no database)
- **CSS** — custom design system with Figma-inspired visual components

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/astrobase.git
cd astrobase

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site runs at **http://localhost:5173/**.

## How to Run

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build    # outputs to dist/
npm run preview  # serves the production build locally
```

### Lint
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          Reusable UI components
│   ├── Navbar.jsx         Fixed top nav with sound toggle
│   ├── Footer.jsx
│   ├── StarField.jsx      Animated CSS star background
│   ├── Planets.jsx         Floating CSS planets
│   ├── ProtectedRoute.jsx  Route guard for authenticated pages
│   ├── DialogueBox.jsx     Visual-novel dialogue component
│   └── DecisionPanel.jsx   Interactive decision component
├── pages/               Route pages
│   ├── Home.jsx           Lunar scene homepage
│   ├── Register.jsx       Astronaut registration form
│   ├── Dashboard.jsx      Mission Control command centre
│   ├── Training.jsx       Training academy hub + module flow
│   ├── Mission.jsx        Chapter 1: RISING TIDE
│   ├── Results.jsx        Chapter 1 mission debrief
│   ├── Outpost.jsx        Chapter 2: LUNAR OUTPOST
│   ├── OutpostResults.jsx Chapter 2 debrief
│   └── About.jsx
├── data/                Plain JS data files (no backend needed)
│   ├── constants.js        Ranks, achievements, module/mission metadata
│   ├── missions.js         RISING TIDE mission script
│   ├── trainingModules.js  Lesson content and quiz questions
│   └── outpostMissions.js  LUNAR OUTPOST chapter data
├── hooks/               React hooks
│   ├── useTrainee.js       Context + hook for trainee profile
│   ├── TraineeProvider.jsx Context provider (localStorage)
│   ├── useSound.js         Context + hook for sound system
│   └── SoundProvider.jsx   Web Audio synthesiser provider
├── App.jsx              Router setup
├── App.css              All component styles
├── index.css            CSS variables, reset, global styles
└── main.jsx             App entry point with providers
```

## Scientific Accuracy

All educational content is based on publicly available NASA educational resources:

- [NASA ECLSS](https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/)
- [NASA Open APIs](https://api.nasa.gov/)
- [NASA Space Apps Challenge](https://www.spaceappschallenge.org/)

**Important disclaimers shown on-screen:**
- All mission scenarios are **fictional training simulations**
- Resource meters and countdown timers are **gameplay abstractions** — not real spacecraft safety limits
- All procedures are invented for educational purposes and **do not represent official NASA protocols**
- The project is not endorsed by or affiliated with NASA

## localStorage Keys

| Key | Purpose |
|---|---|
| `astrobase_trainee` | Trainee profile (name, callsign, rank, modules, missions, achievements) |
| `astrobase_last_result` | Last RISING TIDE mission result (for /results page) |
| `astrobase_outpost_result` | Last Lunar Outpost result (for /outpost/results page) |
| `astrobase_sound` | Sound on/off preference (`'true'` / `'false'`) |
| `astrobase_volume` | Volume level (`'0.0'`–`'1.0'`) |

## Deployment

### Vercel
1. Push to GitHub
2. Import the repository in Vercel
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

No environment variables required. No backend needed.

## License

This project is built for the NASA Space Apps Challenge 2026. All sound effects are synthesised in real-time using the Web Audio API — no external audio files are used.
