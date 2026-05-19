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
      className="px-5 py-18 sm:px-6 lg:px-8"
      id="education"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Education
        </p>
        <h2
          className="mt-3 text-3xl font-bold tracking-tight text-slate-950"
          id="education-title"
        >
          Learning background
        </h2>
        <div className="mt-8 space-y-5">
          {education.map((item) => (
            <article
              className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-950/[0.03]"
              key={`${item.institution}-${item.degree}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {displayValue(item.degree)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {displayValue(item.institution)}
                  </p>
                </div>
                <p className="text-sm text-slate-500">
                  {[item.startDate, item.endDate]
                    .filter((date) => date && !isPlaceholder(date))
                    .join(" - ") || "Dates to be updated"}
                </p>
              </div>
              {item.location && !isPlaceholder(item.location) ? (
                <p className="mt-3 text-sm text-slate-500">{item.location}</p>
              ) : null}
              <p className="mt-4 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
