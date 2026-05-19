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
      className="border-t border-slate-200 px-6 py-16"
      id="education"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Education
        </p>
        <h2
          className="mt-2 text-3xl font-semibold text-slate-950"
          id="education-title"
        >
          Learning background
        </h2>
        <div className="mt-8 space-y-5">
          {education.map((item) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-6"
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
