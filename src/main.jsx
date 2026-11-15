import { StrictMode }      from 'react'
import { createRoot }      from 'react-dom/client'
import { TraineeProvider } from './hooks/TraineeProvider'
import { SoundProvider }   from './hooks/SoundProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TraineeProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </TraineeProvider>
  </StrictMode>,
)
