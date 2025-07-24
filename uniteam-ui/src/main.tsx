import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ui/ThemeProvider'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="uniteam-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
