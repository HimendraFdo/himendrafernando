import type { Contact as ContactData, Profile } from "../data/portfolio"

type ContactProps = {
  contact: ContactData
  profile: Profile
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

const isUsableEmail = (email?: string) =>
  Boolean(email && email.trim() && !email.startsWith("YOUR_"))

function Contact({ contact, profile }: ContactProps) {
  const email = contact.email || profile.email
  const links = [
    isUsableEmail(email)
      ? { label: "Email", href: `mailto:${email}`, external: false }
      : undefined,
    isUsableHref(contact.github.href)
      ? { label: contact.github.label, href: contact.github.href, external: true }
      : undefined,
    isUsableHref(contact.linkedin.href)
      ? { label: contact.linkedin.label, href: contact.linkedin.href, external: true }
      : undefined,
    isUsableHref(contact.resume.href)
      ? { label: contact.resume.label, href: contact.resume.href, external: true }
      : undefined,
  ].filter((link): link is { label: string; href: string; external: boolean } =>
    Boolean(link),
  )

  return (
    <section
      aria-labelledby="contact-title"
      className="border-y border-white/10 bg-[#080b11] px-5 py-20 text-white sm:px-6 lg:px-8"
      id="contact"
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1fr] md:items-end">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/70">05 / Contact</p>
          <h2
            className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl"
            id="contact-title"
          >
            Let’s build something useful.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
            I am open to software engineering internships and full-stack projects.
          </p>
        </div>
        {links.length > 0 ? (
          <ul className="flex flex-wrap gap-3 md:justify-end">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  className="inline-flex min-h-12 items-center rounded-md border border-white/14 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#080b11]"
                  href={link.href}
                  rel={link.external ? "noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-slate-300">
            Contact links will appear here when the portfolio data is updated.
          </p>
        )}
      </div>
    </section>
  )
}

export default Contact
