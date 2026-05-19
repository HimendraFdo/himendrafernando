import type { About as AboutData } from "../data/portfolio"

type AboutProps = {
  about: AboutData
}

function About({ about }: AboutProps) {
  return (
    <section
      aria-labelledby="about-title"
      className="border-t border-slate-200 bg-white px-6 py-16"
      id="about"
    >
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            About
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950" id="about-title">
            Background and focus
          </h2>
        </div>
        <div className="space-y-8">
          <p className="text-base leading-7 text-slate-700">{about.intro}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Focus</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {about.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-950">Values</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                {about.values.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
