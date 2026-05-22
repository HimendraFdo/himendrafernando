import type { About as AboutData } from "../data/portfolio"

type AboutProps = {
  about: AboutData
}

function About({ about }: AboutProps) {
  return (
    <section
      aria-labelledby="about-title"
      className="border-y border-white/10 bg-[#f6f2ea] px-5 py-20 text-slate-950 sm:px-6 lg:px-8"
      id="about"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.8fr)]">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">01 / About</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950" id="about-title">
            Background and focus
          </h2>
        </div>
        <div className="space-y-8">
          <p className="max-w-4xl text-xl leading-9 text-slate-800">{about.intro}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border-l-4 border-cyan-500 bg-white p-6 shadow-sm shadow-slate-950/5">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-slate-950">Focus</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {about.focus.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l-4 border-amber-500 bg-white p-6 shadow-sm shadow-slate-950/5">
              <h3 className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-slate-950">Values</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {about.values.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
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
