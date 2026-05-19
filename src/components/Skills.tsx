import type { SkillGroup } from "../data/portfolio"

type SkillsProps = {
  skills: SkillGroup[]
}

function Skills({ skills }: SkillsProps) {
  return (
    <section
      aria-labelledby="skills-title"
      className="border-t border-slate-200 px-6 py-16"
      id="skills"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Skills
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950" id="skills-title">
          Technical toolkit
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <section
              aria-labelledby={`skill-${group.category}`}
              className="rounded-lg border border-slate-200 bg-white p-5"
              key={group.category}
            >
              <h3
                className="text-base font-semibold text-slate-950"
                id={`skill-${group.category}`}
              >
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                    key={skill}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
