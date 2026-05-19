import type { Contact, Profile } from "../data/portfolio"

type NavbarProps = {
  profile: Profile
  contact: Contact
}

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
]

const isUsableHref = (href?: string) =>
  Boolean(href && href.trim() && !href.startsWith("YOUR_"))

function Navbar({ profile, contact }: NavbarProps) {
  const socialLinks = [contact.github, contact.linkedin].filter((link) =>
    isUsableHref(link.href),
  )

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <a className="text-base font-semibold text-slate-950" href="#top">
          {profile.name}
        </a>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-700">
          {navItems.map((item) => (
            <a className="hover:text-slate-950" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          {socialLinks.map((link) => (
            <a
              aria-label={`${link.label} profile`}
              className="font-medium text-slate-950 hover:text-slate-700"
              href={link.href}
              key={link.label}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
