"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "OK but how does it actually work?",
    a: "It's almost too simple: place it on the bottle, press the button, and a tiny burst of food-grade gas pushes the cork out from below. Under 3 seconds, no effort, satisfying POP included.",
  },
  {
    q: "Will it break my cork?",
    a: "Nope. That's the beauty of it. No piercing, no pulling, no crumbling. The gas pushes the cork out in one piece, every time. Even works perfectly on old, fragile corks.",
  },
  {
    q: "How many pops do I get per cartridge?",
    a: "About 30 bottles per cartridge. The Aluminum model comes with 2 cartridges, so that's roughly 60 pops out of the box. Refill packs are always available when you need more.",
  },
  {
    q: "Does the gas change how the wine tastes?",
    a: "Not even a little. It's food-grade inert gas — completely neutral. If anything, it helps preserve the wine by preventing oxidation during extraction. Your wine stays exactly as the winemaker intended.",
  },
  {
    q: "Natural corks, synthetic corks — does it matter?",
    a: "Doesn't matter at all. Natural, synthetic, old, new — the Winepopper handles them all. The only thing it can't open is a screw cap, but you don't need us for that.",
  },
  {
    q: "What if I don't love it?",
    a: "Then we'll give you your money back. 30 days, no questions, no hassle. But honestly? The real risk is that everyone who sees yours will want one too.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-brand-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-heading text-base font-semibold text-brand-black">
          {q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60 pb-5" : "max-h-0"
        }`}
      >
        <p className="font-body text-sm leading-relaxed text-brand-gray-600">{a}</p>
      </div>
    </div>
  )
}

export function FAQSection() {
  return (
    <section className="bg-brand-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            Curiosity is Welcome
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-black md:text-4xl">
            You've Got Questions. We've Got POPs.
          </h2>
        </div>

        <div className="rounded-2xl bg-white px-6 py-2 shadow-sm md:px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
