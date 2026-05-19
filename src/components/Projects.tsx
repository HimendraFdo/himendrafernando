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
      className="border-y border-slate-200/80 bg-white px-5 py-18 sm:px-6 lg:px-8"
      id="projects"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Projects
        </p>
        <h2
          className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
          id="projects-title"
        >
          Selected work
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Practical software projects focused on dashboard interfaces, data-driven
          workflows, and clean front-end implementation.
        </p>

        {featuredProject ? (
          <div className="mt-8">
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
