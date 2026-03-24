import Image from "next/image"

const cards = [
  {
    image: "/images/optimized/winepopper-fotos-ok-31.webp",
    alt: "Winepopper positioned on a wine bottle, needle inserted, ready to pop the cork",
    eyebrow: "Zero effort. Maximum wow.",
    title: "The End of Cork Anxiety",
    description:
      "That awkward moment wrestling with a corkscrew while everyone watches? Gone. One press, the cork pops out perfectly, and you look like a pro. Every single time.",
  },
  {
    image: "/images/optimized/winepopper-fotos-ok-24.webp",
    alt: "Winepopper Lite next to an open bottle of wine, cork removed, glass of red wine",
    eyebrow: "They'll never guess the price.",
    title: "The Gift That Gets a Standing Ovation",
    description:
      "Forget another boring wine accessory. Winepopper is the gift that makes people say \"where did you FIND this?!\" — and then immediately ask for one themselves.",
  },
  {
    image: "/images/optimized/DSC06301.webp",
    alt: "Wine being poured into a glass after being opened with the Winepopper — cork and opener resting on the table",
    eyebrow: "One pop. Instant party.",
    title: "The Life of Every Dinner Table",
    description:
      "Guests gather around. You place the Winepopper. POP — the cork flies, everyone cheers. Suddenly, opening wine is the highlight of the night, not just a step before drinking it.",
  },
]

export function LifestyleSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-brand-gray-500">
            Fun &amp; Elegant &amp; Unforgettable
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-brand-black md:text-5xl">
            Why Should Champagne Have All the Fun?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-brand-gray-500">
            Every wine bottle deserves a celebration. The Winepopper turns the boring part into the best part — a satisfying POP that brings everyone together.
          </p>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="group">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-gray-50">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text */}
              <div className="mt-6">
                <p className="font-body text-xs font-semibold text-brand-gray-500">
                  {card.eyebrow}
                </p>
                <h3 className="mt-1 font-heading text-xl font-bold text-brand-black">
                  {card.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-brand-gray-500">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
