import About from "./components/About"
import Contact from "./components/Contact"
import DynamicBackground from "./components/DynamicBackground"
import Education from "./components/Education"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Projects from "./components/Projects"
import ScrollFade from "./components/ScrollFade"
import Skills from "./components/Skills"
import { about, contact, education, profile, projects, skills } from "./data/portfolio"

function App() {
  return (
    <div className="app-shell min-h-screen overflow-x-hidden bg-transparent text-slate-100 antialiased">
      <DynamicBackground />
      <a
        className="sr-only z-50 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
        href="#main-content"
      >
        Skip to main content
      </a>
      <Navbar profile={profile} contact={contact} />
      <main className="relative z-10" id="main-content" tabIndex={-1}>
        <ScrollFade>
          <Hero profile={profile} contact={contact} />
        </ScrollFade>
        <ScrollFade>
          <About about={about} />
        </ScrollFade>
        <ScrollFade>
          <Skills skills={skills} />
        </ScrollFade>
        <ScrollFade>
          <Projects projects={projects} />
        </ScrollFade>
        <ScrollFade>
          <Education education={education} />
        </ScrollFade>
        <ScrollFade>
          <Contact contact={contact} profile={profile} />
        </ScrollFade>
      </main>
      <Footer profile={profile} contact={contact} />
    </div>
  )
}

export default App
