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
      className="border-t border-slate-200 bg-white px-6 py-16"
      id="contact"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Contact
        </p>
        <h2
          className="mt-2 text-3xl font-semibold text-slate-950"
          id="contact-title"
        >
          Connect
        </h2>
        {links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  className="rounded-md border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-950 hover:border-slate-400"
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
          <p className="mt-6 text-sm text-slate-600">
            Contact links will appear here when the portfolio data is updated.
          </p>
        )}
      </div>
    </section>
  )
}

export default Contact
