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
    <article className="flex h-full flex-col rounded-lg border border-white/10 bg-[#101620] p-5 transition hover:-translate-y-1 hover:border-cyan-200/40 sm:p-6">
      {project.image ? (
        <img
          alt={`${project.title} screenshot`}
          className="mb-5 aspect-video w-full rounded-md border border-white/10 bg-slate-950 object-cover"
          src={project.image}
        />
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {project.description}
          </p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">
        {project.longDescription}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li className="rounded border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300" key={tech}>
            {tech}
          </li>
        ))}
      </ul>
      {project.highlights.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-400">
          {project.highlights.map((highlight) => (
            <li className="flex gap-2" key={highlight}>
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-300" />
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
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/14 bg-white/6 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/14 bg-white/6 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
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
