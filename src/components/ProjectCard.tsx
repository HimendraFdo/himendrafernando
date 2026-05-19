import type { Project } from "../data/portfolio"

type ProjectCardProps = {
  project: Project
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function ProjectCard({ project }: ProjectCardProps) {
  const projectLinks = [
    { label: "GitHub", href: project.githubUrl },
    { label: "Live demo", href: project.liveUrl },
  ].filter((link) => isUsableHref(link.href))

  return (
    <article
      className={`rounded-lg border bg-white p-6 ${
        project.featured ? "border-slate-400 shadow-sm" : "border-slate-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {project.description}
          </p>
        </div>
        {project.featured ? (
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
            Featured
          </span>
        ) : null}
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-700">
        {project.longDescription}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700" key={tech}>
            {tech}
          </li>
        ))}
      </ul>
      {project.highlights.length > 0 ? (
        <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
      {projectLinks.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {projectLinks.map((link) => (
            <a
              className="text-sm font-medium text-slate-950 underline-offset-4 hover:underline"
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default ProjectCard
