/* ─── App.jsx ──────────────────────────────────────────────────────────────
   Root component — sets up React Router and the page layout shell.
   All content lives in src/pages/. All reusable UI in src/components/.
─────────────────────────────────────────────────────────────────────────── */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import ProtectedRoute  from './components/ProtectedRoute'

import Home           from './pages/Home'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import Training       from './pages/Training'
import Mission        from './pages/Mission'
import Results        from './pages/Results'
import About          from './pages/About'
import Outpost        from './pages/Outpost'
import OutpostResults from './pages/OutpostResults'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Navbar />

        <Routes>
          {/* ── Public routes ── */}
          <Route path="/"         element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about"    element={<About />} />

          {/* ── Protected routes — redirect to /register if no profile ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/training"           element={<Training />} />
            <Route path="/training/:moduleId" element={<Training />} />
            <Route path="/mission"            element={<Mission />} />
            <Route path="/mission/:missionId" element={<Mission />} />
            <Route path="/results"            element={<Results />} />
            {/* ── Chapter 2 — Lunar Outpost ── */}
            <Route path="/outpost"            element={<Outpost />} />
            <Route path="/outpost/results"    element={<OutpostResults />} />
          </Route>

          {/* ── 404 fallback ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

/* ─── 404 page ─────────────────────────────────────────────────────────── */
function NotFound() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-content">
        <span className="placeholder-icon" aria-hidden="true">🌑</span>
        <p className="placeholder-label">404</p>
        <h1 className="placeholder-title">Lost in Space</h1>
        <p className="placeholder-desc">
          This sector of the universe doesn&apos;t exist. Double-check your coordinates.
        </p>
        <a href="/" className="btn-secondary">← Return to Base</a>
      </div>
    </main>
  )
}
