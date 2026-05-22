import type { EducationItem } from "../data/portfolio"

type EducationProps = {
  education: EducationItem[]
}

const isPlaceholder = (value?: string) => Boolean(value?.startsWith("YOUR_"))

const displayValue = (value?: string) =>
  value && !isPlaceholder(value) ? value : "To be updated"

function Education({ education }: EducationProps) {
  return (
    <section
      aria-labelledby="education-title"
      className="bg-[#f6f2ea] px-5 py-20 text-slate-950 sm:px-6 lg:px-8"
      id="education"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">04 / Education</p>
        <h2
          className="mt-4 text-4xl font-black tracking-tight text-slate-950"
          id="education-title"
        >
          Learning background
        </h2>
        <div className="mt-10 space-y-5">
          {education.map((item) => (
            <article
              className="grid gap-5 border-l-4 border-amber-500 bg-white p-6 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_0.7fr]"
              key={`${item.institution}-${item.degree}`}
            >
              <div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {displayValue(item.degree)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {displayValue(item.institution)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-mono text-sm text-slate-500">
                  {[item.startDate, item.endDate]
                    .filter((date) => date && !isPlaceholder(date))
                    .join(" - ") || "Dates to be updated"}
                </p>
                {item.location && !isPlaceholder(item.location) ? (
                  <p className="mt-3 text-sm text-slate-500">{item.location}</p>
                ) : null}
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
