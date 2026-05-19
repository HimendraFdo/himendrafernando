import { Code2, ExternalLink } from "lucide-react"
import type { Project } from "../data/portfolio"

type ProjectCardProps = {
  project: Project
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function ProjectCard({ project }: ProjectCardProps) {
  const githubHref = isUsableHref(project.githubUrl) ? project.githubUrl : undefined
  const liveHref = isUsableHref(project.liveUrl) ? project.liveUrl : undefined

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-950/[0.07] sm:p-6">
      {project.image ? (
        <img
          alt={`${project.title} screenshot`}
          className="mb-5 aspect-video w-full rounded-md border border-slate-200 bg-slate-50 object-cover"
          src={project.image}
        />
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {project.description}
          </p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-700">
        {project.longDescription}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700" key={tech}>
            {tech}
          </li>
        ))}
      </ul>
      {project.highlights.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
          {project.highlights.map((highlight) => (
            <li className="flex gap-2" key={highlight}>
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {(githubHref || liveHref) ? (
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {githubHref ? (
            <a
              aria-label={`View ${project.title} source code on GitHub`}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              href={githubHref}
              rel="noreferrer"
              target="_blank"
            >
              <Code2 aria-hidden="true" size={16} />
              GitHub
            </a>
          ) : null}
          {liveHref ? (
            <a
              aria-label={`Open live demo for ${project.title}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              href={liveHref}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink aria-hidden="true" size={16} />
              Live demo
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

export default ProjectCard
