"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Play } from "lucide-react"
import { products } from "@/lib/products-data"

export function Hero() {
  const product = products[0]

  return (
    <section className="relative overflow-hidden bg-brand-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-brand-red/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Social proof bar */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <div className="flex -space-x-1">
                {["⭐","⭐","⭐","⭐","⭐"].map((s, i) => (
                  <span key={i} className="text-xs">{s}</span>
                ))}
              </div>
              <span className="text-xs font-body text-white/80">
                Loved by 2,000+ wine enthusiasts
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Pop Your Wine{" "}
              <span className="relative">
                Like Champagne
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 150 2 298 8" stroke="#7B2D3B" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-300 lg:mx-0">
              One button. One satisfying <strong className="text-white">POP</strong>. Any cork out in{" "}
              <strong className="text-white">under 3 seconds</strong>. No struggle, no broken corks, no sommelier degree required.
            </p>

            {/* Price highlight */}
            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              <span className="font-heading text-4xl font-bold text-white">$34.90</span>
              <span className="text-xl text-gray-500 line-through">$49.90</span>
              <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">
                SAVE 30%
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/products/winepopper-aluminum"
                className="btn-primary px-10 py-4 text-lg shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 transition-all"
              >
                Get Your Winepopper — $34.90
              </Link>
              <Link
                href="#how-it-works"
                className="group flex items-center gap-2 font-body text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition-all group-hover:border-white group-hover:bg-white/10">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                See How It Works
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 lg:justify-start">
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Fast US Shipping
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                30-Day Returns
              </span>
            </div>
          </div>

          {/* Right: Product image — real photo of product on bottle */}
          <div className="relative flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-brand-red/10 blur-3xl" />
            <div className="relative aspect-[3/4] w-full max-w-sm lg:max-w-md overflow-hidden rounded-3xl">
              <Image
                src="/images/optimized/winepopper-fotos-ok-32.webp"
                alt="Winepopper Aluminum on a wine bottle — ready to extract the cork"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 40vw"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/40" />
      </div>
    </section>
  )
}
