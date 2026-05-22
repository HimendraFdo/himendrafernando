import { Code2, ExternalLink } from "lucide-react"
import type { Project } from "../data/portfolio"

type FeaturedProjectProps = {
  project: Project
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function DashboardPlaceholder() {
  return (
    <div
      aria-label="Dashboard preview placeholder"
      className="flex min-h-[18rem] flex-col justify-between rounded-lg border border-white/10 bg-slate-950 p-4 text-white shadow-inner sm:min-h-[22rem] sm:p-5"
      role="img"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Analytics
          </p>
          <p className="mt-1 text-lg font-semibold">Personal overview</p>
        </div>
        <div className="grid grid-cols-3 gap-1" aria-hidden="true">
          <span className="size-2 rounded-full bg-emerald-300" />
          <span className="size-2 rounded-full bg-sky-300" />
          <span className="size-2 rounded-full bg-amber-300" />
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {["Study", "Finance", "Health"].map((label, index) => (
          <div className="rounded-md bg-white/10 p-3" key={label}>
            <p className="text-xs text-slate-300">{label}</p>
            <div
              className="mt-4 h-2 rounded-full bg-white/15"
              aria-hidden="true"
            >
              <div
                className="h-2 rounded-full bg-emerald-300"
                style={{ width: `${68 - index * 14}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid flex-1 items-end gap-2 sm:grid-cols-8" aria-hidden="true">
        {[44, 68, 52, 78, 60, 86, 72, 92].map((height, index) => (
          <span
            className="rounded-t bg-sky-300/80"
            key={`${height}-${index}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function FeaturedProject({ project }: FeaturedProjectProps) {
  const githubHref = isUsableHref(project.githubUrl) ? project.githubUrl : undefined
  const liveHref = isUsableHref(project.liveUrl) ? project.liveUrl : undefined

  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-[#101620] shadow-2xl shadow-black/20 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div className="border-b border-white/10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
              Featured project
            </span>
            <span className="text-sm font-medium text-slate-500">Project spotlight</span>
          </div>

          <h3 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {project.description}
          </p>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            {project.longDescription}
          </p>
        </div>

        {project.highlights.length > 0 ? (
          <ul className="space-y-3 p-6 text-sm leading-6 text-slate-300 sm:p-8">
            {project.highlights.map((highlight) => (
              <li className="flex gap-3" key={highlight}>
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-cyan-300"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="flex flex-wrap gap-2 border-y border-white/10 px-6 py-5 sm:px-8" aria-label="Technology stack">
          {project.techStack.map((tech) => (
            <li
              className="rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
              key={tech}
            >
              {tech}
            </li>
          ))}
        </ul>

        {(githubHref || liveHref) && (
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:p-8">
            {githubHref ? (
              <a
                aria-label={`View ${project.title} source code on GitHub`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
                href={githubHref}
                rel="noreferrer"
                target="_blank"
              >
                <Code2 aria-hidden="true" size={18} />
                GitHub
              </a>
            ) : null}
            {liveHref ? (
              <a
                aria-label={`Open live demo for ${project.title}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
                href={liveHref}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink aria-hidden="true" size={18} />
                Live demo
              </a>
            ) : null}
          </div>
        )}
      </div>

      <div className="bg-[#080b11] p-4 sm:p-6 lg:p-8">
        {project.image ? (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl shadow-black/30">
            <img
              alt={`${project.title} dashboard screenshot`}
              className="h-full min-h-[18rem] w-full object-cover object-left-top opacity-95 transition duration-500 hover:scale-[1.015]"
              src={project.image}
            />
          </div>
        ) : (
          <DashboardPlaceholder />
        )}
      </div>
    </article>
  )
}

export default FeaturedProject
