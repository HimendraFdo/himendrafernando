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
      className="mx-auto max-w-6xl px-6 py-20 sm:py-24"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {profile.role}
        </p>
        <h1
          className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
          id="hero-title"
        >
          {profile.name}
        </h1>
        <p className="mt-6 text-xl leading-8 text-slate-700">
          {profile.headline}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
          {profile.summary}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {links
            .filter((link) => !link.hidden)
            .map((link) => (
              <a
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-950 shadow-sm hover:border-slate-400"
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
