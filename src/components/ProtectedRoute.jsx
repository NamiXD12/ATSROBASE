/* ─── ProtectedRoute ───────────────────────────────────────────────────────
   Wraps routes that require a registered trainee profile.
   If no profile exists in localStorage, redirects to /register.
   Usage in App.jsx:
     <Route element={<ProtectedRoute />}>
       <Route path="/dashboard" element={<Dashboard />} />
     </Route>
─────────────────────────────────────────────────────────────────────────── */
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const trainee = localStorage.getItem('astrobase_trainee')

  if (!trainee) {
    // No profile found — send to registration
    return <Navigate to="/register" replace />
  }

  // Profile exists — render the requested child route
  return <Outlet />
}
