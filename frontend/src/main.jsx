import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// ── Global Window Listener for Uncaught Promise Rejections ──────────────────
window.addEventListener('unhandledrejection', (event) => {
  console.error('[GLOBAL UNHANDLED REJECTION]', event.reason)
})

// ── Global Window Listener for Uncaught Script Errors ────────────────────────
window.addEventListener('error', (event) => {
  console.error('[GLOBAL SCRIPT ERROR]', event.error || event.message)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
