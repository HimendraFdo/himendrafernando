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
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-950/[0.03] backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <a
          className="w-fit rounded-md text-base font-semibold tracking-tight text-slate-950 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-4 focus:ring-offset-white"
          href="#top"
        >
          {profile.name}
        </a>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-medium text-slate-600 sm:justify-end">
          {navItems.map((item) => (
            <a
              className="rounded-md px-2.5 py-1.5 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
          {socialLinks.map((link) => (
            <a
              aria-label={`${link.label} profile`}
              className="rounded-md px-2.5 py-1.5 font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white"
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
