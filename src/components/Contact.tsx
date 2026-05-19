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
      className="border-y border-slate-200/80 bg-slate-950 px-5 py-18 text-white sm:px-6 lg:px-8"
      id="contact"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">
          Contact
        </p>
        <h2
          className="mt-3 text-3xl font-bold tracking-tight text-white"
          id="contact-title"
        >
          Connect
        </h2>
        {links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  className="inline-flex min-h-11 items-center rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-400/15 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950"
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
