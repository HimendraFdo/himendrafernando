import type { About as AboutData } from "../data/portfolio"

type AboutProps = {
  about: AboutData
}

function About({ about }: AboutProps) {
  return (
    <section
      aria-labelledby="about-title"
      className="border-y border-slate-200/80 bg-white px-5 py-18 sm:px-6 lg:px-8"
      id="about"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.8fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            About
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950" id="about-title">
            Background and focus
          </h2>
        </div>
        <div className="space-y-8">
          <p className="max-w-3xl text-lg leading-8 text-slate-700">{about.intro}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-5">
              <h3 className="text-base font-semibold text-slate-950">Focus</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {about.focus.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-5">
              <h3 className="text-base font-semibold text-slate-950">Values</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {about.values.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
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
