import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { MemsApp } from './components/MemsApp'
import { ResearchAreas } from './components/ResearchAreas'
import { Experience } from './components/Experience'
import { Education } from './components/Education'
import { Projects } from './components/Projects'
import { Centrifuge } from './components/Centrifuge'
import { Skills, Certifications } from './components/Skills'
import { Landscape } from './components/Landscape'
import { GithubSection } from './components/GithubSection'
import { Contact, Footer } from './components/Contact'
import { useSpotlight } from './hooks/hooks'

export default function App() {
  useSpotlight()
  return (
    <>
      <a
        href="#main"
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          background: 'var(--accent)',
          color: '#08080f',
          padding: '8px 16px',
          zIndex: 200,
        }}
        onFocus={(e) => (e.currentTarget.style.left = '8px')}
        onBlur={(e) => (e.currentTarget.style.left = '-9999px')}
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <MemsApp />
        <ResearchAreas />
        <Experience />
        <Education />
        <Projects />
        <Centrifuge />
        <Skills />
        <Certifications />
        <Landscape />
        <GithubSection />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
