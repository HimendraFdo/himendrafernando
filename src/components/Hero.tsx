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
    { label: "Contact", href: "#contact", external: false },
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
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          {profile.role}
        </p>
        <h1
          className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          id="hero-title"
        >
          {profile.name}
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-700 sm:text-2xl sm:leading-9">
          {profile.headline}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {profile.summary}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          {links
            .filter((link) => !link.hidden)
            .map((link, index) => (
              <a
                className={
                  index === 0
                    ? "inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                    : "inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm shadow-slate-950/[0.03] transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-slate-50"
                }
                href={link.href}
                key={link.label}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
