import { useRef, useState, useCallback, useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Code2, ExternalLink } from "lucide-react"
import type { Project } from "../data/portfolio"

type ProjectsProps = {
  projects: Project[]
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function ProjectGallery({ project }: { project: Project }) {
  const images = useMemo(() => {
    if (project.images?.length) return project.images
    if (project.image) return [{ src: project.image, alt: `${project.title} screenshot` }]
    return []
  }, [project])

  if (images.length === 0) {
    return <div className="min-h-[16rem] bg-[#080b11] lg:min-h-[30rem]" />
  }

  return (
    <div className="grid content-start gap-4 bg-gradient-to-b from-[#0a0e16] to-[#080b11] p-4 sm:gap-5 sm:p-6">
      {images.map((image, index) => (
        <figure
          className="group/img relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-xl shadow-black/40 ring-1 ring-white/5"
          key={image.src}
        >
          <img
            alt={image.alt}
            className="block h-auto w-full object-cover transition duration-500 group-hover/img:scale-[1.02]"
            loading={index === 0 ? "eager" : "lazy"}
            src={image.src}
          />
          {/* Subtle top sheen + bottom fade for depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"
          />
        </figure>
      ))}
    </div>
  )
}

function LargeProjectCard({ project }: { project: Project }) {
  const githubHref = isUsableHref(project.githubUrl) ? project.githubUrl : undefined
  const liveHref = isUsableHref(project.liveUrl) ? project.liveUrl : undefined

  return (
    <article className="grid h-full overflow-hidden rounded-2xl border border-white/10 bg-[#101620] shadow-2xl shadow-black/30 lg:grid-cols-[1.1fr_1fr]">
      {/* Image gallery side */}
      <ProjectGallery project={project} />

      {/* Content side */}
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-4 text-base leading-7 text-slate-300">{project.description}</p>
        <p className="mt-4 text-sm leading-6 text-slate-400">{project.longDescription}</p>

        {project.highlights.length > 0 ? (
          <ul className="mt-6 space-y-2.5 text-sm leading-6 text-slate-300">
            {project.highlights.slice(0, 3).map((highlight) => (
              <li className="flex gap-3" key={highlight}>
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-300" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
          {project.techStack.map((tech) => (
            <li
              className="rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
              key={tech}
            >
              {tech}
            </li>
          ))}
        </ul>

        {(githubHref || liveHref) ? (
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            {githubHref ? (
              <a
                aria-label={`View ${project.title} source code on GitHub`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/14 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
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
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#101620]"
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
      </div>
    </article>
  )
}

function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActive = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIndex(Math.max(0, Math.min(projects.length - 1, index)))
  }, [projects.length])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateActive, { passive: true })
    return () => el.removeEventListener("scroll", updateActive)
  }, [updateActive])

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(projects.length - 1, index))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" })
  }

  const canScrollLeft = activeIndex > 0
  const canScrollRight = activeIndex < projects.length - 1

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <div className="absolute -top-14 right-0 flex gap-2" aria-label="Browse projects">
        <button
          aria-label="Previous project"
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#0b1018] disabled:pointer-events-none disabled:opacity-30"
          disabled={!canScrollLeft}
          onClick={() => scrollToIndex(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <button
          aria-label="Next project"
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#0b1018] disabled:pointer-events-none disabled:opacity-30"
          disabled={!canScrollRight}
          onClick={() => scrollToIndex(activeIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={20} />
        </button>
      </div>

      {/* Scrollable track — one full-width card per view */}
      <div
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
        role="list"
        aria-label="Projects"
      >
        {projects.map((project) => (
          <div
            className="w-full shrink-0 snap-center px-0.5"
            key={project.slug}
            role="listitem"
          >
            <LargeProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {projects.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {projects.map((project, index) => (
            <button
              aria-label={`Go to project ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-cyan-300" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              key={project.slug}
              onClick={() => scrollToIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Projects({ projects }: ProjectsProps) {
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

        {projects.length > 0 ? (
          <div className="relative mt-16">
            <ProjectsCarousel projects={projects} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Projects
