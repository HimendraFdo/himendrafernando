import type { Project } from "../data/portfolio"
import ProjectCard from "./ProjectCard"

type ProjectsProps = {
  projects: Project[]
}

function Projects({ projects }: ProjectsProps) {
  return (
    <section
      aria-labelledby="projects-title"
      className="border-t border-slate-200 bg-white px-6 py-16"
      id="projects"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Projects
        </p>
        <h2
          className="mt-2 text-3xl font-semibold text-slate-950"
          id="projects-title"
        >
          Selected work
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
