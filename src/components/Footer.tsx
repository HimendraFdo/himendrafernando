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
    <footer className="border-t border-white/10 bg-[#080b11] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {year} {profile.name}</p>
        {links.length > 0 ? (
          <nav aria-label="Footer links" className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                className="inline-flex min-h-11 items-center rounded-md transition hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#080b11]"
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
