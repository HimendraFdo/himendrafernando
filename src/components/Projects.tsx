import type { Project } from "../data/portfolio"
import FeaturedProject from "./FeaturedProject"
import ProjectCard from "./ProjectCard"

type ProjectsProps = {
  projects: Project[]
}

function Projects({ projects }: ProjectsProps) {
  const featuredProject = projects.find((project) => project.featured)
  const regularProjects = projects.filter((project) => project.slug !== featuredProject?.slug)

  return (
    <section
      aria-labelledby="projects-title"
      className="border-y border-white/10 bg-[#0b1018] px-5 py-20 sm:px-6 lg:px-8"
      id="projects"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-[0.72fr_1.3fr] md:items-end">
          <div>
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/70">03 / Projects</p>
            <h2
              className="mt-4 text-4xl font-black tracking-tight text-white"
              id="projects-title"
            >
              Selected work
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Practical software projects focused on dashboard interfaces, data-driven
            workflows, and clean front-end implementation.
          </p>
        </div>

        {featuredProject ? (
          <div className="mt-10">
            <FeaturedProject project={featuredProject} />
          </div>
        ) : null}

        {regularProjects.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {regularProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Projects
