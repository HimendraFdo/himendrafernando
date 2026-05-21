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
      className="px-5 py-18 sm:px-6 lg:px-8"
      id="skills"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Skills
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950" id="skills-title">
          Technical toolkit
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => {
            const headingId = toHeadingId(group.category)

            return (
              <section
                aria-labelledby={headingId}
                className="rounded-lg border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-950/[0.03] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md hover:shadow-slate-950/[0.06]"
                key={group.category}
              >
                <h3
                  className="text-base font-semibold text-slate-950"
                  id={headingId}
                >
                  {group.category}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
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
