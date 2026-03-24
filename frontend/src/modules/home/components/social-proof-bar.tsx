import { Star } from "lucide-react"

const stats = [
  { value: "2,000+", label: "Happy Customers" },
  { value: "50,000+", label: "Bottles Opened" },
  { value: "4.9/5", label: "Star Rating" },
  { value: "< 3 sec", label: "Cork to Glass" },
]

export function SocialProofBar() {
  return (
    <section className="border-y border-brand-gray-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl font-bold text-brand-black md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 font-body text-sm text-brand-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
