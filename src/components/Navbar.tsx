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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080b11]/82 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <a
          className="group inline-flex min-h-11 w-fit max-w-full items-center gap-3 rounded-md py-2 text-base font-semibold tracking-tight text-white transition hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-4 focus:ring-offset-[#080b11]"
          href="#top"
        >
          <span className="grid size-8 place-items-center rounded border border-cyan-300/40 bg-cyan-300/10 text-xs font-bold text-cyan-200 transition group-hover:border-cyan-200">
            HF
          </span>
          <span>{profile.name}</span>
        </a>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-medium text-slate-300 sm:justify-end">
          {navItems.map((item) => (
            <a
              className="inline-flex min-h-11 items-center rounded-md px-3 py-2 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#080b11]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
          {socialLinks.map((link) => (
            <a
              aria-label={`${link.label} profile`}
              className="inline-flex min-h-11 items-center rounded-md border border-white/12 px-3 py-2 font-semibold text-cyan-200 transition hover:border-cyan-200/50 hover:bg-cyan-200/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#080b11]"
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
