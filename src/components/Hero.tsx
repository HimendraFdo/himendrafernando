import { ArrowRight, Code2, Mail, MapPin, TerminalSquare } from "lucide-react"
import type { Contact, Profile } from "../data/portfolio"

type HeroProps = {
  profile: Profile
  contact: Contact
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function Hero({ profile, contact }: HeroProps) {
  const links = [
    { label: "View Projects", href: "#projects", external: false },
    { label: "Email Me", href: "#contact", external: false },
    {
      label: "GitHub",
      href: contact.github.href,
      external: true,
      hidden: !isUsableHref(contact.github.href),
    },
    {
      label: "Resume",
      href: profile.resumeUrl || contact.resume.href,
      external: true,
      hidden:
        !isUsableHref(profile.resumeUrl) && !isUsableHref(contact.resume.href),
    },
  ]

  return (
    <section
      className="mx-auto grid max-w-7xl gap-12 overflow-hidden px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.75fr)] lg:px-8 lg:py-28"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="min-w-0 max-w-[350px] sm:max-w-4xl">
        <div className="flex max-w-full flex-wrap items-center gap-3 text-sm text-slate-300">
          <span className="inline-flex max-w-full items-center gap-2 rounded border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100 sm:text-sm">
            <TerminalSquare aria-hidden="true" size={16} />
            <span className="min-w-0 whitespace-normal">{profile.role}</span>
          </span>
          <span className="inline-flex items-center gap-2 text-slate-400">
            <MapPin aria-hidden="true" size={16} />
            {profile.location}
          </span>
        </div>
        <h1
          className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
          id="hero-title"
        >
          {profile.name}
        </h1>
        <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-200 sm:text-2xl sm:leading-9">
          {profile.headline}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
          {profile.summary}
        </p>
        <div className="mt-9 flex max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links
            .filter((link) => !link.hidden)
            .map((link, index) => (
              <a
                className={
                  index === 0
                    ? "inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#080b11] sm:w-auto sm:px-5"
                    : "inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-md border border-white/14 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#080b11] sm:w-auto sm:px-5"
                }
                href={link.href}
                key={link.label}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label === "GitHub" ? <Code2 aria-hidden="true" size={17} /> : null}
                {link.label === "Email Me" ? <Mail aria-hidden="true" size={17} /> : null}
                {link.label}
                {index === 0 ? <ArrowRight aria-hidden="true" size={17} /> : null}
              </a>
            ))}
        </div>
        <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
          {[
            ["A+ avg", "Waikato CS"],
            ["Full-stack", "React + TypeScript"],
            ["Data apps", "PostgreSQL + Prisma"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="text-2xl font-black text-white">{value}</dt>
              <dd className="mt-1 text-sm text-slate-400">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <aside
        aria-label="Developer profile summary"
        className="relative min-w-0 max-w-[350px] overflow-hidden rounded-lg border border-white/12 bg-[#101620]/88 p-4 shadow-2xl shadow-black/30 ring-1 ring-cyan-200/10 sm:max-w-full"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff6b5f]" />
            <span className="size-3 rounded-full bg-[#f5b84b]" />
            <span className="size-3 rounded-full bg-[#4de1d1]" />
          </div>
          <p className="font-mono text-xs text-slate-500">portfolio.tsx</p>
        </div>
        <div className="min-w-0 space-y-5 overflow-hidden font-mono text-xs leading-7 sm:text-sm">
          <p><span className="text-cyan-300">const</span> developer = {"{"}</p>
          <div className="break-all pl-5 text-slate-300 sm:break-words">
            <p>name: <span className="text-amber-200">"{profile.name}"</span>,</p>
            <p>location: <span className="text-amber-200">"{profile.location}"</span>,</p>
            <p>focus: <span className="text-amber-200">"full-stack systems"</span>,</p>
            <p>stack: [<span className="text-amber-200">"React"</span>, <span className="text-amber-200">"TypeScript"</span>, <span className="text-amber-200">"Postgres"</span>],</p>
          </div>
          <p>{"}"}</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {["API design", "Reusable UI", "Data modelling", "Testing"].map((item) => (
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-3" key={item}>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Working on</p>
              <p className="mt-2 text-sm font-semibold text-white">{item}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  )
}

export default Hero
