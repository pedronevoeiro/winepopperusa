import Link from "next/link"
import { Lock, Truck, RotateCcw, CreditCard } from "lucide-react"

const badges = [
  { icon: Lock, label: "256-bit SSL Encryption" },
  { icon: Truck, label: "Free Shipping $50+" },
  { icon: RotateCcw, label: "30-Day Money Back" },
  { icon: CreditCard, label: "All Major Cards" },
]

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand-black py-20 md:py-28">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-brand-red/5" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
          Ready to Make Every Bottle
          <br />
          <span className="text-brand-red">a Celebration?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl font-body text-lg text-gray-400">
          2,000+ wine lovers already made the switch. Your next bottle is waiting for its POP moment.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products/winepopper-aluminum"
            className="btn-primary px-10 py-4 text-lg shadow-lg shadow-brand-red/30"
          >
            Get Your Winepopper — From $24.90
          </Link>
          <Link
            href="/products"
            className="btn-outline-white px-8 py-4 text-base"
          >
            Compare Models
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {badges.map((badge) => {
            const Icon = badge.icon
            return (
              <div key={badge.label} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-5 w-5 text-white/70" />
                </div>
                <span className="font-body text-xs text-gray-400">{badge.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
