const steps = [
  {
    number: "01",
    title: "Place",
    description: "Set the Winepopper on any bottle. Natural cork, synthetic — it doesn't care.",
    icon: (
      <svg className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Press",
    description: "One click. The gas does the magic. You just watch and smile.",
    icon: (
      <svg className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Pop & Pour",
    description: "POP — cork's out. Smiles all around. Now pour and celebrate.",
    icon: (
      <svg className="h-10 w-10 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/>
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            Ridiculously Easy
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-black md:text-4xl">
            Three Steps to POP
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-brand-gray-500">
            Forget everything you know about opening wine. This is way more fun.
          </p>
        </div>

        {/* Demo video — short autoplay loop */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-brand-black aspect-video">
            <video
              src="/images/3s.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              aria-label="Winepopper opening a wine bottle in 3 seconds"
              title="Winepopper in action — 3-second cork extraction"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-brand-gray-200 md:block" />
              )}

              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg">
                {step.icon}
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-red font-heading text-xs font-bold text-white shadow">
                  {step.number}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-brand-black">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-brand-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
