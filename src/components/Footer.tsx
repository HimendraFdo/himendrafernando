import type { Contact, Profile } from "../data/portfolio"

type FooterProps = {
  profile: Profile
  contact: Contact
}

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function Footer({ profile, contact }: FooterProps) {
  const year = new Date().getFullYear()
  const links = [contact.github, contact.linkedin, contact.resume].filter((link) =>
    isUsableHref(link.href),
  )

  return (
    <footer className="bg-slate-950 px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {year} {profile.name}</p>
        {links.length > 0 ? (
          <nav aria-label="Footer links" className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                className="rounded-md transition hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-4 focus:ring-offset-slate-950"
                href={link.href}
                key={link.label}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </footer>
  )
}

export default Footer
