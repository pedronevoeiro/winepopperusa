"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { trackAddToCart } from "@/lib/analytics"
import { formatPrice, getDiscountPercentage } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants[0]
  const addItem = useCartStore((s) => s.addItem)
  const hasDiscount = variant.compareAtPrice && variant.compareAtPrice > variant.price
  const discount = hasDiscount
    ? getDiscountPercentage(variant.price, variant.compareAtPrice!)
    : 0

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

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
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Image — clickable to product page */}
      <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-brand-gray-50">
        <Image
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {hasDiscount && (
          <span className="sale-badge absolute top-3 left-3">
            {discount}% OFF
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-heading font-bold text-lg text-brand-black mb-1 hover:text-brand-red transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-brand-gray-700 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="price-current">{formatPrice(variant.price)}</span>
          {hasDiscount && (
            <span className="price-compare">
              {formatPrice(variant.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Quick Add to Cart + View Details */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleQuickAdd}
            className="btn-primary text-center text-sm w-full flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
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
}
