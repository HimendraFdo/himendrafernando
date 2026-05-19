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
    <footer className="border-t border-slate-200 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        {links.length > 0 ? (
          <nav aria-label="Footer links" className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                className="hover:text-slate-950"
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
