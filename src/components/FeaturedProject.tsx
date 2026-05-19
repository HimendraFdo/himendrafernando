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
      className="flex min-h-[18rem] flex-col justify-between rounded-lg border border-slate-200 bg-slate-950 p-4 text-white sm:min-h-[22rem] sm:p-5"
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
    <article className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm sm:p-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            Featured project
          </span>
          <span className="text-sm text-slate-500">Project spotlight</span>
        </div>

        <h3 className="mt-5 text-2xl font-semibold text-slate-950 sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-base leading-7 text-slate-700">
          {project.description}
        </p>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          {project.longDescription}
        </p>

        {project.highlights.length > 0 ? (
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
            {project.highlights.map((highlight) => (
              <li className="flex gap-3" key={highlight}>
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-emerald-500"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
          {project.techStack.map((tech) => (
            <li
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              key={tech}
            >
              {tech}
            </li>
          ))}
        </ul>

        {(githubHref || liveHref) && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {githubHref ? (
              <a
                aria-label={`View ${project.title} source code on GitHub`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
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

      <div className="mt-8 lg:mt-0">
        {project.image ? (
          <img
            alt={`${project.title} screenshot`}
            className="h-full min-h-[18rem] w-full rounded-lg border border-slate-200 object-cover"
            src={project.image}
          />
        ) : (
          <DashboardPlaceholder />
        )}
      </div>
    </article>
  )
}

export default FeaturedProject
