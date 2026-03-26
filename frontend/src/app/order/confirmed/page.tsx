"use client"

import { useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { CheckCircle, Mail, Package, Truck, Instagram, Share2 } from "lucide-react"
import { trackPurchase, consumePendingOrder } from "@/lib/analytics"

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const dow = result.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return result
}

export default function OrderConfirmedPage() {
  const orderNumber = useMemo(() => {
    const digits = Math.floor(10000 + Math.random() * 90000)
    return `#WP-${digits}`
  }, [])

  const deliveryRange = useMemo(() => {
    const now = new Date()
    const from = addBusinessDays(now, 5)
    const to = addBusinessDays(now, 7)
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${fmt(from)} – ${fmt(to)}`
  }, [])

  const purchaseTracked = useRef(false)

  useEffect(() => {
    document.title = "Order Confirmed | Winepopper USA"

    // GA4: purchase — fire once from sessionStorage data
    if (!purchaseTracked.current) {
      purchaseTracked.current = true
      const order = consumePendingOrder()
      if (order) {
        trackPurchase(order)
      }
    }
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* ── Confetti dots ── */}
      <ConfettiDots />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-6">
        {/* Green check icon */}
        <div className="animate-bounce-in">
          <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-black">
          Order Confirmed!
        </h1>

        {/* Message */}
        <p className="font-body text-brand-gray-600 text-base leading-relaxed">
          Thank you for your order. A great bottle is on its way to you!
        </p>

        {/* Order number */}
        <div className="bg-brand-gray-50 rounded-xl px-6 py-4 w-full">
          <p className="text-sm text-brand-gray-500 mb-1">Order Number</p>
          <p className="font-heading font-bold text-xl text-brand-black">
            {orderNumber}
          </p>
        </div>

        {/* ── What happens next ── */}
        <div className="w-full bg-white border border-brand-gray-200 rounded-xl px-6 py-5 text-left flex flex-col gap-4">
          <h2 className="font-heading font-semibold text-lg text-brand-black">
            What happens next
          </h2>

          <Step
            icon={<Mail className="w-5 h-5 text-brand-red" />}
            text="Confirmation email sent to your inbox"
          />
          <Step
            icon={<Package className="w-5 h-5 text-brand-red" />}
            text="We're preparing your order"
          />
          <Step
            icon={<Truck className="w-5 h-5 text-brand-red" />}
            text={`Estimated delivery: ${deliveryRange}`}
          />
        </div>

        {/* ── Share your POP moment ── */}
        <div className="w-full bg-brand-gray-50 rounded-xl px-6 py-5 text-center flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-red" />
            <h2 className="font-heading font-semibold text-base text-brand-black">
              Share your POP moment
            </h2>
          </div>
          <p className="font-body text-sm text-brand-gray-600 leading-relaxed">
            Show us how you pop! Tag us on social and join the Winepopper community.
          </p>
          <a
            href="https://instagram.com/winepopperusa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-red font-medium text-sm hover:underline"
          >
            <Instagram className="w-4 h-4" />
            @winepopperusa
          </a>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="btn-primary w-full py-3.5 text-center text-base font-bold"
        >
          Continue Shopping
        </Link>

        {/* Support */}
        <p className="text-sm text-brand-gray-500">
          Questions? Contact us at{" "}
          <a
            href="mailto:contact@winepopperusa.com"
            className="text-brand-red hover:underline font-medium"
          >
            contact@winepopperusa.com
          </a>
        </p>
      </div>

      {/* Scoped keyframe styles */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .confetti-dot {
          position: absolute;
          top: 0;
          border-radius: 50%;
          animation: confetti-fall linear forwards;
          pointer-events: none;
        }
      `}</style>
    </section>
  )
}

/* ── Small step row ── */
function Step({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p className="font-body text-sm text-brand-gray-700 leading-snug">
        {text}
      </p>
    </div>
  )
}

/* ── Confetti animated dots ── */
function ConfettiDots() {
  const dots = useMemo(() => {
    const colors = [
      "#C8102E", // brand-red
      "#FFD700",
      "#34D399",
      "#60A5FA",
      "#F472B6",
      "#A78BFA",
      "#FB923C",
    ]
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 3}s`,
      duration: `${3 + Math.random() * 4}s`,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="confetti-dot"
          style={{
            left: dot.left,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  )
}
