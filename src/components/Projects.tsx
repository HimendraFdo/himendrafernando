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
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
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
