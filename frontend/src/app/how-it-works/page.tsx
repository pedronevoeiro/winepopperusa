import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Wine,
  Zap,
  ThumbsUp,
  HelpCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | Winepopper USA",
  description:
    "See how the Winepopper opens any wine bottle in under 3 seconds. Watch the demo video and learn the simple 3-step process.",
}

/* ── SVG Illustrations ─────────────────────────────────── */

function StepPlaceSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wine bottle */}
      <rect x="88" y="60" width="24" height="100" rx="4" fill="#2d2d2d" />
      <rect x="92" y="40" width="16" height="24" rx="3" fill="#2d2d2d" />
      <rect x="82" y="156" width="36" height="8" rx="2" fill="#2d2d2d" />
      {/* Cork */}
      <rect x="94" y="56" width="12" height="10" rx="2" fill="#c4956a" />
      {/* Foil */}
      <rect x="86" y="52" width="28" height="8" rx="2" fill="#d4a574" opacity="0.6" />
      {/* Winepopper being placed - with arrow */}
      <rect x="90" y="10" width="20" height="36" rx="4" fill="#1a1a1a" stroke="#7B2D3B" strokeWidth="1.5" />
      <circle cx="100" cy="22" r="3" fill="#7B2D3B" />
      <line x1="100" y1="36" x2="100" y2="46" stroke="#7B2D3B" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Arrow down */}
      <path d="M92 44 L100 52 L108 44" stroke="#7B2D3B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Hand silhouette */}
      <path d="M120 20 Q130 15 135 25 L130 40 Q125 45 118 38 Z" fill="#e8d5c4" opacity="0.5" />
    </svg>
  )
}

function StepPressSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wine bottle */}
      <rect x="88" y="70" width="24" height="100" rx="4" fill="#2d2d2d" />
      <rect x="82" y="166" width="36" height="8" rx="2" fill="#2d2d2d" />
      {/* Cork starting to move up */}
      <rect x="94" y="62" width="12" height="10" rx="2" fill="#c4956a" />
      {/* Winepopper on bottle */}
      <rect x="90" y="26" width="20" height="38" rx="4" fill="#1a1a1a" stroke="#444" strokeWidth="1" />
      {/* Button being pressed - glowing */}
      <circle cx="100" cy="36" r="4" fill="#7B2D3B" />
      <circle cx="100" cy="36" r="7" fill="#7B2D3B" opacity="0.2" />
      <circle cx="100" cy="36" r="10" fill="#7B2D3B" opacity="0.1" />
      {/* Needle */}
      <line x1="100" y1="56" x2="100" y2="70" stroke="#999" strokeWidth="1" />
      {/* Gas pressure waves */}
      <path d="M84 75 Q80 80 84 85" stroke="#7B2D3B" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M78 73 Q73 80 78 87" stroke="#7B2D3B" strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M116 75 Q120 80 116 85" stroke="#7B2D3B" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M122 73 Q127 80 122 87" stroke="#7B2D3B" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Finger pressing */}
      <ellipse cx="100" cy="28" rx="8" ry="5" fill="#e8d5c4" opacity="0.6" />
    </svg>
  )
}

function StepPopSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wine bottle - open */}
      <rect x="88" y="80" width="24" height="90" rx="4" fill="#2d2d2d" />
      <rect x="92" y="72" width="16" height="12" rx="3" fill="#2d2d2d" />
      <rect x="82" y="166" width="36" height="8" rx="2" fill="#2d2d2d" />
      {/* Cork flying up */}
      <rect x="94" y="20" width="12" height="10" rx="2" fill="#c4956a" />
      {/* Pop burst lines */}
      <line x1="88" y1="18" x2="78" y2="10" stroke="#7B2D3B" strokeWidth="2" strokeLinecap="round" />
      <line x1="112" y1="18" x2="122" y2="10" stroke="#7B2D3B" strokeWidth="2" strokeLinecap="round" />
      <line x1="100" y1="16" x2="100" y2="6" stroke="#7B2D3B" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="24" x2="72" y2="22" stroke="#7B2D3B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="118" y1="24" x2="128" y2="22" stroke="#7B2D3B" strokeWidth="1.5" strokeLinecap="round" />
      {/* POP text */}
      <text x="140" y="30" fontFamily="sans-serif" fontWeight="bold" fontSize="16" fill="#7B2D3B">POP!</text>
      {/* Celebration sparkles */}
      <circle cx="70" cy="35" r="2" fill="#7B2D3B" opacity="0.6" />
      <circle cx="135" cy="15" r="2" fill="#7B2D3B" opacity="0.6" />
      <circle cx="65" cy="15" r="1.5" fill="#7B2D3B" opacity="0.4" />
      <circle cx="140" cy="40" r="1.5" fill="#7B2D3B" opacity="0.4" />
      {/* Winepopper removed - to the side */}
      <rect x="140" y="60" width="16" height="30" rx="3" fill="#1a1a1a" opacity="0.4" />
    </svg>
  )
}

function StepPourSvg() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wine bottle tilted */}
      <g transform="rotate(-30, 80, 100)">
        <rect x="68" y="40" width="24" height="90" rx="4" fill="#2d2d2d" />
        <rect x="72" y="30" width="16" height="14" rx="3" fill="#2d2d2d" />
        <rect x="62" y="126" width="36" height="8" rx="2" fill="#2d2d2d" />
      </g>
      {/* Wine stream */}
      <path d="M62 52 Q70 80 80 100 Q85 110 82 120" stroke="#7B2D3B" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Wine glass */}
      <path d="M110 110 Q100 130 105 150 L115 150 Q120 130 110 110 Z" fill="#7B2D3B" opacity="0.3" />
      <ellipse cx="110" cy="110" rx="20" ry="8" fill="none" stroke="#2d2d2d" strokeWidth="1.5" />
      <path d="M90 110 Q90 140 105 150" stroke="#2d2d2d" strokeWidth="1.5" fill="none" />
      <path d="M130 110 Q130 140 115 150" stroke="#2d2d2d" strokeWidth="1.5" fill="none" />
      <line x1="100" y1="150" x2="120" y2="150" stroke="#2d2d2d" strokeWidth="1.5" />
      <line x1="110" y1="150" x2="110" y2="168" stroke="#2d2d2d" strokeWidth="1.5" />
      <line x1="96" y1="168" x2="124" y2="168" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round" />
      {/* Wine in glass */}
      <ellipse cx="110" cy="120" rx="15" ry="5" fill="#7B2D3B" opacity="0.5" />
      {/* Smile */}
      <path d="M145 70 Q155 85 165 70" stroke="#7B2D3B" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="148" cy="62" r="2" fill="#2d2d2d" />
      <circle cx="162" cy="62" r="2" fill="#2d2d2d" />
    </svg>
  )
}

/* ── Page Component ────────────────────────────────────── */

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Place",
      subtitle: "Position on any bottle",
      description:
        "Remove the foil cap with the included foil cutter. Then simply place the Winepopper on top of the bottle. The needle goes through the cork automatically — no force needed.",
      illustration: <StepPlaceSvg />,
      tip: "Works with any standard wine bottle — natural or synthetic corks.",
    },
    {
      number: "02",
      title: "Press",
      subtitle: "One click does it all",
      description:
        "Press the button once. A burst of food-grade inert gas enters the bottle through the needle and builds gentle pressure below the cork. You'll feel the cork start to rise.",
      illustration: <StepPressSvg />,
      tip: "The gas is completely safe and doesn't affect the wine's taste or aroma.",
    },
    {
      number: "03",
      title: "POP",
      subtitle: "Cork out, smiles on",
      description:
        "In under 3 seconds the cork glides out with a satisfying POP. The cork comes out intact — no crumbling, no pieces in the wine. Just a clean, perfect extraction every time.",
      illustration: <StepPopSvg />,
      tip: "The POP sound is what makes every bottle opening feel like a celebration.",
    },
    {
      number: "04",
      title: "Pour & Enjoy",
      subtitle: "Wine perfectly preserved",
      description:
        "Remove the Winepopper, pour your wine, and enjoy. The inert gas actually helps preserve the wine by preventing oxidation during extraction. Your wine tastes exactly as the winemaker intended.",
      illustration: <StepPourSvg />,
      tip: "Each cartridge opens ~30 bottles. The Aluminum kit comes with 2 cartridges.",
    },
  ]

  const faqs = [
    {
      q: "Does the gas change how the wine tastes?",
      a: "Not at all. The Winepopper uses food-grade inert gas that is completely neutral. It actually helps preserve the wine by preventing oxidation during extraction.",
    },
    {
      q: "Can it break the cork?",
      a: "Never. Unlike traditional corkscrews that pierce and pull, the Winepopper pushes the cork out from below using even, gentle pressure. The cork comes out intact every time.",
    },
    {
      q: "How many bottles per cartridge?",
      a: "Each gas cartridge opens approximately 30 bottles. The Winepopper Aluminum comes with 2 cartridges (~60 openings). Refill packs are always available.",
    },
    {
      q: "Does it work with synthetic corks?",
      a: "Yes — natural, synthetic, old, new. If it has a cork, the Winepopper handles it. The only exception is screw caps, which don't need an opener.",
    },
  ]

  return (
    <main>
      {/* ── Hero Section ──────────────────────────────── */}
      <section className="bg-brand-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            See It in Action
          </span>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            One Button. Under 3 Seconds.
            <br />
            <span className="text-brand-red">Any Cork.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-gray-400 font-body">
            Forget everything you know about opening wine. The Winepopper uses
            pneumatic gas pressure to extract any cork smoothly, quickly, and
            with a satisfying POP. Here&apos;s how.
          </p>
        </div>
      </section>

      {/* ── Video Demo Section ────────────────────────── */}
      <section className="bg-brand-gray-50 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-black">
              Watch the Magic
            </h2>
            <p className="mt-3 text-brand-gray-500 font-body max-w-xl mx-auto">
              3 seconds is all it takes. Watch the Winepopper in action and see
              why 2,000+ wine lovers made the switch.
            </p>
          </div>

          {/* Main demo video */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-brand-black aspect-video">
            <video
              src="/images/WINE HORIZONTAL EUA + CLASSIC (1).mp4"
              controls
              playsInline
              preload="metadata"
              poster="/images/optimized/winepopper-fotos-ok-31.webp"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick video - autoplay loop */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg bg-brand-black aspect-video">
              <video
                src="/images/3s.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-heading text-2xl font-bold text-brand-black">
                3 Seconds. That&apos;s It.
              </h3>
              <p className="mt-3 text-brand-gray-500 font-body leading-relaxed">
                No struggling, no twisting, no broken corks floating in your
                glass. The Winepopper extracts the cork cleanly in one smooth
                motion. Watch this 3-second clip on repeat — it never gets old.
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-brand-gray-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-brand-red" />
                  Under 3 seconds
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-red" />
                  Zero broken corks
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step by Step ──────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
              Ridiculously Easy
            </span>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-brand-black">
              Four Steps to Celebration
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-brand-gray-500 font-body">
              No experience needed. No skills required. If you can press a
              button, you can open wine like a pro.
            </p>
          </div>

          <div className="flex flex-col gap-16 lg:gap-24">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Illustration */}
                <div
                  className={`relative ${i % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div className="relative mx-auto w-full max-w-sm aspect-square bg-brand-gray-50 rounded-3xl p-8 shadow-lg">
                    {/* Step number watermark */}
                    <span className="absolute top-4 left-6 font-heading text-6xl font-bold text-brand-red/10">
                      {step.number}
                    </span>
                    {step.illustration}
                  </div>
                </div>

                {/* Text */}
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red text-white font-heading font-bold text-sm">
                      {step.number}
                    </span>
                    <span className="font-body text-xs font-semibold uppercase tracking-widest text-brand-gray-500">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-brand-black">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-heading text-lg text-brand-red font-semibold">
                    {step.subtitle}
                  </p>
                  <p className="mt-4 text-brand-gray-500 font-body leading-relaxed text-base">
                    {step.description}
                  </p>

                  {/* Tip box */}
                  <div className="mt-6 flex items-start gap-3 bg-brand-gray-50 rounded-xl p-4">
                    <ThumbsUp className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                    <p className="text-sm text-brand-gray-700 font-body">
                      <strong className="text-brand-black">Pro tip:</strong>{" "}
                      {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Makes It Different ───────────────────── */}
      <section className="bg-brand-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-black">
              Traditional Corkscrew vs. Winepopper
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-brand-gray-500 font-body">
              See why thousands of wine lovers are making the switch.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="bg-brand-gray-200 p-4 flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-brand-gray-700 text-center">Feature</span>
              </div>
              <div className="bg-brand-gray-200 p-4 flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-brand-gray-500 text-center">Traditional</span>
              </div>
              <div className="bg-brand-red p-4 flex items-center justify-center">
                <span className="font-heading font-bold text-sm text-white text-center">Winepopper</span>
              </div>

              {/* Rows */}
              {[
                ["Opening time", "30-60 seconds", "Under 3 seconds"],
                ["Effort required", "Pull & twist", "Press a button"],
                ["Broken corks", "Common problem", "Never happens"],
                ["Skill needed", "Requires practice", "None at all"],
                ["Wine preservation", "Can oxidize", "Gas preserves flavor"],
                ["Fun factor", "Boring routine", "Satisfying POP"],
                ["Guest reaction", "Nobody notices", "Everyone gathers"],
              ].map(([feature, trad, wp], i) => (
                <div key={feature} className="contents">
                  <div className={`p-4 flex items-center ${i % 2 === 0 ? "bg-white" : "bg-brand-gray-50"}`}>
                    <span className="font-body text-sm font-semibold text-brand-black">{feature}</span>
                  </div>
                  <div className={`p-4 flex items-center justify-center ${i % 2 === 0 ? "bg-white" : "bg-brand-gray-50"}`}>
                    <span className="font-body text-sm text-brand-gray-500 text-center">{trad}</span>
                  </div>
                  <div className={`p-4 flex items-center justify-center ${i % 2 === 0 ? "bg-brand-red/5" : "bg-brand-red/10"}`}>
                    <span className="font-body text-sm font-semibold text-brand-red text-center">{wp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick FAQ ─────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-black">
              Common Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-brand-gray-50 rounded-xl p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-heading font-semibold text-brand-black list-none">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className="w-5 h-5 text-brand-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 pl-8 text-sm text-brand-gray-600 font-body leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────── */}
      <section className="bg-brand-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            Ready to Make Every Bottle
            <br />
            <span className="text-brand-red">a Celebration?</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 font-body max-w-xl mx-auto">
            Join 2,000+ wine lovers who turned the boring part of wine into the
            best part.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products/winepopper-aluminum"
              className="btn-primary px-10 py-4 text-lg shadow-lg shadow-brand-red/30"
            >
              Get Your Winepopper — $34.90
            </Link>
            <Link
              href="/products"
              className="btn-outline-white px-8 py-4 text-base"
            >
              Compare Models
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-brand-gray-500 text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Secure Checkout
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              Free Shipping $50+
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              30-Day Returns
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
