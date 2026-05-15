import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Cold-start the backend so it's warm before the user interacts
fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`).catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
