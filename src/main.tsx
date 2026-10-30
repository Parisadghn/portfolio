import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource-variable/geist/index.css'
import '@fontsource-variable/geist-mono/index.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './styles/base.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/modules.css'
import './styles/modules2.css'
import './styles/mems.css'
import './styles/centrifuge.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
