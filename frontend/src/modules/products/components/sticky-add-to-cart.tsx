"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Product } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { trackAddToCart } from "@/lib/analytics"
import { formatPrice } from "@/lib/utils"

interface StickyAddToCartProps {
  product: Product
  selectedVariantIndex: number
}

export default function StickyAddToCart({
  product,
  selectedVariantIndex,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const variant = product.variants[selectedVariantIndex]

  useEffect(() => {
    const target = document.getElementById("add-to-cart-btn")
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  function handleAdd() {
    addItem({
      id: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle:
        variant.title !== "Default" ? variant.title : undefined,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      quantity: 1,
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
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-gray-200 shadow-lg transition-transform duration-300 ease-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container-main flex items-center gap-4 py-3">
        {/* Thumbnail */}
        {product.images[0] && (
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-brand-gray-50 shrink-0">
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
        )}

        {/* Title + price */}
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-sm text-brand-black truncate">
            {product.title}
          </p>
          <p className="font-heading font-bold text-sm text-brand-black">
            {formatPrice(variant.price)}
          </p>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={!variant.available}
          className="btn-primary text-sm py-2.5 px-6 shrink-0 disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
