import type { SkillGroup } from "../data/portfolio"

type SkillsProps = {
  skills: SkillGroup[]
}

const toHeadingId = (category: string) =>
  `skill-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`

function Skills({ skills }: SkillsProps) {
  return (
    <section
      aria-labelledby="skills-title"
      className="px-5 py-20 sm:px-6 lg:px-8"
      id="skills"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/70">02 / Skills</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight text-white" id="skills-title">
          Technical toolkit
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => {
            const headingId = toHeadingId(group.category)

            return (
              <section
                aria-labelledby={headingId}
                className="bg-[#101620]/92 p-6 transition hover:bg-[#151d2a]"
                key={group.category}
              >
                <h3
                  className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-cyan-200"
                  id={headingId}
                >
                  {group.category}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      className="rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-200"
                      key={skill}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills
