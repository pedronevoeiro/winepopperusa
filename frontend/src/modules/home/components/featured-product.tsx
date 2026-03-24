"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react"
import { products } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { trackAddToCart } from "@/lib/analytics"
import { formatPrice } from "@/lib/utils"

const highlights = [
  "Any cork out in under 3 seconds — POP",
  "Premium aluminum & stainless steel build",
  "2 gas cartridges included (~60 bottles of fun)",
  "Wine tastes exactly as it should — preserved",
  "Natural or synthetic corks — doesn't matter",
  "Compact enough to take to any dinner party",
]

export function FeaturedProduct() {
  const addItem = useCartStore((state) => state.addItem)
  const product = products[0]
  const variant = product.variants[0]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: variant.id,
      title: product.title,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: product.images[0]?.url,
      handle: product.handle,
    })
    trackAddToCart({
      id: variant.id,
      name: product.title,
      price: variant.price,
      quantity: 1,
    })
  }

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            The One Everyone Wants
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-black md:text-4xl">
            Meet Your New Favorite Party Trick
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Product image — real kit photo */}
          <div className="relative flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute h-[90%] w-[90%] rounded-full bg-brand-gray-50" />

            {/* Sale badge */}
            <div className="absolute left-2 top-2 z-10 flex flex-col items-center rounded-2xl bg-brand-red px-3 py-2 text-white shadow-lg sm:left-6 sm:top-6">
              <span className="font-heading text-2xl font-bold leading-none">30%</span>
              <span className="text-xs font-semibold uppercase">Off</span>
            </div>

            <div className="relative aspect-square w-full max-w-lg">
              <Image
                src="/images/optimized/winepopper-fotos-ok-04.webp"
                alt="Winepopper Aluminum complete kit — corkscrew, gas cartridges, foil cutter, and manual"
                fill
                className="object-contain p-4 drop-shadow-xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <span className="mb-4 w-fit rounded-full bg-brand-red/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-red">
              Best Seller
            </span>

            <h3 className="font-heading text-3xl font-bold text-brand-black md:text-4xl">
              Winepopper Aluminum
            </h3>

            <p className="mt-2 font-body text-lg text-brand-gray-500">
              Automatic Gas Corkscrew
            </p>

            {/* Price block */}
            <div className="mt-6 flex items-center gap-4">
              <span className="font-heading text-4xl font-bold text-brand-red">
                {formatPrice(variant.price)}
              </span>
              {variant.compareAtPrice && (
                <span className="text-xl text-brand-gray-300 line-through">
                  {formatPrice(variant.compareAtPrice)}
                </span>
              )}
              <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                You save {formatPrice((variant.compareAtPrice || 0) - variant.price)}
              </span>
            </div>

            {/* Features checklist */}
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-3 w-3 text-green-600" />
                  </span>
                  <span className="font-body text-sm text-brand-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleAddToCart}
                className="btn-primary px-8 py-4 text-base shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart — {formatPrice(variant.price)}
              </button>
              <Link
                href={`/products/${product.handle}`}
                className="group flex items-center justify-center gap-1.5 font-body text-sm font-medium text-brand-gray-500 transition-colors hover:text-brand-red"
              >
                View Full Details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mini trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-brand-gray-100 pt-6">
              <div className="flex items-center gap-2 text-xs text-brand-gray-500">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-gray-500">
                <Truck className="h-4 w-4 text-green-600" />
                Free Shipping $50+
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-gray-500">
                <RotateCcw className="h-4 w-4 text-green-600" />
                30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
