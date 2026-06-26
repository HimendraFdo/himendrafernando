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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101620] shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:shadow-cyan-900/20">
      {project.image ? (
        <div className="relative overflow-hidden">
          <img
            alt={`${project.title} screenshot`}
            className="aspect-video w-full bg-slate-950 object-cover object-top transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            src={project.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101620]/80 via-transparent to-transparent" aria-hidden="true" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 6).map((tech) => (
            <li
              className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-300"
              key={tech}
            >
              {tech}
            </li>
          ))}
          {project.techStack.length > 6 ? (
            <li className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-500">
              +{project.techStack.length - 6} more
            </li>
          ) : null}
        </ul>

        {(githubHref || liveHref) ? (
          <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
            {githubHref ? (
              <a
                aria-label={`View ${project.title} source code on GitHub`}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/14 bg-white/6 px-3 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
                href={githubHref}
                rel="noreferrer"
                target="_blank"
              >
                <Code2 aria-hidden="true" size={14} />
                GitHub
              </a>
            ) : null}
            {liveHref ? (
              <a
                aria-label={`Open live demo for ${project.title}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200 ring-1 ring-cyan-300/30 transition hover:-translate-y-0.5 hover:bg-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
                href={liveHref}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink aria-hidden="true" size={14} />
                Live demo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default ProjectCard
