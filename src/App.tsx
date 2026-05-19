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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar profile={profile} contact={contact} />
      <main>
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
