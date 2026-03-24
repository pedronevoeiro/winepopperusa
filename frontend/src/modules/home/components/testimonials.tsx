import { Star, Quote } from "lucide-react"

interface Testimonial {
  quote: string
  name: string
  title: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Best corkscrew I have ever used in my life! It's been almost 5 years now and it's still magic every time. Opened hundreds of bottles without a single broken cork.",
    name: "Maria S.",
    title: "Wine Collector",
    rating: 5,
  },
  {
    quote:
      "I have one and it's amazing — it doesn't change the wine's properties or flavor at all! It's always a whole attraction for dinner guests. Everyone asks where I got it.",
    name: "Carlos R.",
    title: "Home Entertainer",
    rating: 5,
  },
  {
    quote:
      "Bought this as a gift for my parents and they absolutely loved it. So intuitive that they figured it out in seconds. Now they want one for their vacation home too!",
    name: "Jennifer T.",
    title: "Gift Buyer",
    rating: 5,
  },
  {
    quote:
      "As a sommelier, I've tried every opener on the market. The Winepopper is the fastest, cleanest extraction I've experienced. The gas preservation is a real bonus for tastings.",
    name: "David M.",
    title: "Professional Sommelier",
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            Don't Take Our Word For It
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-black md:text-4xl">
            Hear It From Our Customers
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="font-body text-sm text-brand-gray-500">
              4.9 out of 5 based on 200+ reviews
            </span>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col rounded-2xl border border-brand-gray-100 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              <Quote className="mb-3 h-8 w-8 text-brand-red/20" />

              <Stars count={t.rating} />

              <blockquote className="mt-4 flex-1 font-body text-sm leading-relaxed text-brand-gray-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-6 border-t border-brand-gray-100 pt-4">
                <p className="font-heading text-sm font-bold text-brand-black">
                  {t.name}
                </p>
                <p className="font-body text-xs text-brand-gray-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
