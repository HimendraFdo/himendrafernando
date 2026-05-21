import About from "./components/About"
import Contact from "./components/Contact"
import Education from "./components/Education"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import { about, contact, education, profile, projects, skills } from "./data/portfolio"

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-950 antialiased">
      <a
        className="sr-only z-50 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        href="#main-content"
      >
        Skip to main content
      </a>
      <Navbar profile={profile} contact={contact} />
      <main id="main-content" tabIndex={-1}>
        <Hero profile={profile} contact={contact} />
        <About about={about} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Contact contact={contact} profile={profile} />
      </main>
      <Footer profile={profile} contact={contact} />
    </div>
  )
}

export default App
