"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { trackAddToCart } from "@/lib/analytics"
import { formatPrice, getDiscountPercentage } from "@/lib/utils"

const productBadges: Record<string, { label: string; color: string }> = {
  "winepopper-aluminum": { label: "Aluminum & Steel", color: "bg-amber-100 text-amber-800" },
  "winepopper-lite": { label: "Lightweight Plastic", color: "bg-sky-100 text-sky-800" },
  "refill-gas-capsule": { label: "Fits All Models", color: "bg-green-100 text-green-800" },
}

interface ProductLineupProps {
  products: Product[]
}

export function ProductLineup({ products }: ProductLineupProps) {
  const addItem = useCartStore((s) => s.addItem)

  function handleQuickAdd(product: Product) {
    const variant = product.variants[0]
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
    <section className="bg-brand-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-brand-red">
            Pick Your POP
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-black md:text-4xl">
            Find Your Perfect Winepopper
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-brand-gray-500">
            Same satisfying POP, different builds. The Aluminum is premium and robust. The Lite is ultra-light and travel-ready. Both open wine in under 3 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const variant = product.variants[0]
            const discount = variant.compareAtPrice
              ? getDiscountPercentage(variant.price, variant.compareAtPrice)
              : 0
            const badge = productBadges[product.handle]

            return (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-brand-gray-50">
                  <Image
                    src={product.images[0]?.url || ""}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow">
                      {discount}% OFF
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="font-heading text-lg font-bold text-brand-black hover:text-brand-red transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {badge && (
                    <span className={`mt-2 mb-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}

                  <p className="flex-1 font-body text-sm text-brand-gray-500">
                    {product.shortDescription}
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-xl font-bold text-brand-black">
                      {formatPrice(variant.price)}
                    </span>
                    {variant.compareAtPrice && (
                      <span className="text-sm text-brand-gray-300 line-through">
                        {formatPrice(variant.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Quick Add + View */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="btn-primary w-full text-center text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart — {formatPrice(variant.price)}
                    </button>
                    <Link
                      href={`/products/${product.handle}`}
                      className="text-center text-xs font-body text-brand-gray-500 hover:text-brand-red transition-colors py-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
