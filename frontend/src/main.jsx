import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/ContextProvider.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { Toaster } from 'react-hot-toast'
import UpdateNotifier from './components/UpdateNotifier.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <ContextProvider>
      <App />
      <UpdateNotifier />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '350px',
          },
          success: {
            style: {
              background: '#0d9488',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#0d9488',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
    </ContextProvider>
  </ThemeProvider>
)