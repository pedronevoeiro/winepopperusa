"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  Star,
  Flame,
  Package,
  RotateCcw,
  Heart,
  ArrowRight,
} from "lucide-react"
import type { Product } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"
import { trackAddToCart, trackViewItem } from "@/lib/analytics"
import { formatPrice, getDiscountPercentage } from "@/lib/utils"

interface ProductInfoProps {
  product: Product
}

type Tab = "description" | "specs" | "kit"

/**
 * Calculate a date range 5-7 business days from today.
 * Skips weekends (Sat/Sun).
 */
function getDeliveryDateRange(): { from: string; to: string } {
  function addBusinessDays(start: Date, days: number): Date {
    const result = new Date(start)
    let added = 0
    while (added < days) {
      result.setDate(result.getDate() + 1)
      const day = result.getDay()
      if (day !== 0 && day !== 6) {
        added++
      }
    }
    return result
  }

  const today = new Date()
  const from = addBusinessDays(today, 5)
  const to = addBusinessDays(today, 7)

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  }
  return {
    from: from.toLocaleDateString("en-US", options),
    to: to.toLocaleDateString("en-US", options),
  }
}

const COMPARISON_HANDLES = ["winepopper-aluminum", "winepopper-lite"]

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>("description")

  const addItem = useCartStore((s) => s.addItem)
  const variant = product.variants[selectedVariantIndex]
  const hasMultipleVariants = product.variants.length > 1

  const hasDiscount =
    variant.compareAtPrice && variant.compareAtPrice > variant.price
  const discount = hasDiscount
    ? getDiscountPercentage(variant.price, variant.compareAtPrice!)
    : 0

  const deliveryDates = useMemo(() => getDeliveryDateRange(), [])

  // ── GA4: view_item ──────────────────────────────────────
  useEffect(() => {
    trackViewItem({
      id: variant.id,
      name: product.title,
      price: variant.price,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalPriceCents = variant.price * quantity
  const qualifiesForFreeShipping = totalPriceCents >= 5000 // $50.00

  const showComparison = COMPARISON_HANDLES.includes(product.handle)

  function handleAddToCart() {
    addItem({
      id: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle:
        variant.title !== "Default" ? variant.title : undefined,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      quantity,
      image: product.images[0]?.url,
      handle: product.handle,
    })

    trackAddToCart({
      id: variant.id,
      name: product.title,
      price: variant.price,
      quantity,
    })
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    ...(product.specs
      ? [{ key: "specs" as Tab, label: "Specifications" }]
      : []),
    ...(product.kitContents
      ? [{ key: "kit" as Tab, label: "Kit Contents" }]
      : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Sale badge */}
      {hasDiscount && (
        <span className="sale-badge self-start">{discount}% OFF</span>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-black leading-tight">
        {product.title}
      </h1>

      {/* Star rating */}
      <Link
        href="/#testimonials"
        className="flex items-center gap-2 group w-fit -mt-2"
      >
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 5
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-brand-gray-200 text-brand-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-body font-semibold text-brand-black">
          4.9
        </span>
        <span className="text-sm font-body text-brand-gray-500 group-hover:text-brand-red transition-colors underline underline-offset-2">
          (200+ reviews)
        </span>
      </Link>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-heading font-bold text-brand-black">
          {formatPrice(variant.price)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-brand-gray-500 line-through">
            {formatPrice(variant.compareAtPrice!)}
          </span>
        )}
      </div>

      {/* Urgency signal */}
      <div className="flex items-center gap-2 bg-brand-red/5 border border-brand-red/20 rounded-full px-4 py-2 w-fit animate-pulse">
        <Flame className="w-4 h-4 text-brand-red" />
        <span className="text-sm font-body font-semibold text-brand-red">
          47 sold in last 24 hours
        </span>
      </div>

      {/* Delivery estimate */}
      <div className="flex items-center gap-2 text-sm font-body text-brand-gray-700">
        <Truck className="w-4 h-4 text-brand-red shrink-0" />
        <span>
          Order today, arrives by{" "}
          <strong className="text-brand-black">
            {deliveryDates.from} – {deliveryDates.to}
          </strong>
        </span>
      </div>

      {/* Free shipping callout */}
      {qualifiesForFreeShipping ? (
        <div className="flex items-center gap-2 text-sm font-body text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-fit">
          <Package className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            Free shipping on this order!
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm font-body text-brand-gray-500">
          <Package className="w-4 h-4 shrink-0" />
          <span>
            Free shipping on orders over $50 — add{" "}
            <strong>{formatPrice(5000 - totalPriceCents)}</strong> more!
          </span>
        </div>
      )}

      {/* Variant selector (for Refill Capsule) */}
      {hasMultipleVariants && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-heading font-semibold text-brand-gray-700 mb-1">
            Select option
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, idx) => (
              <label
                key={v.id}
                className={`cursor-pointer px-4 py-2 rounded-[30px] border-2 text-sm font-semibold transition-colors ${
                  idx === selectedVariantIndex
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-gray-200 text-brand-black hover:border-brand-gray-500"
                }`}
              >
                <input
                  type="radio"
                  name="variant"
                  className="sr-only"
                  checked={idx === selectedVariantIndex}
                  onChange={() => {
                    setSelectedVariantIndex(idx)
                    setQuantity(1)
                  }}
                />
                {v.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* Quantity selector */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-heading font-semibold text-brand-gray-700">
          Quantity
        </span>
        <div className="inline-flex items-center border border-brand-gray-200 rounded-[30px] w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-brand-gray-700 hover:text-brand-black transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-heading font-semibold text-brand-black">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-brand-gray-700 hover:text-brand-black transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        id="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={!variant.available}
        className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {variant.available ? "Add to Cart" : "Out of Stock"}
      </button>

      {/* Buy Now button */}
      {variant.available && (
        <Link
          href="/checkout"
          onClick={handleAddToCart}
          className="btn-secondary w-full text-lg py-4 text-center"
        >
          Buy Now — Skip the Cart
        </Link>
      )}

      {/* Trust badges */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <div className="flex items-center gap-2 text-sm text-brand-gray-700">
          <ShieldCheck className="w-5 h-5 text-brand-red" />
          Secure Checkout
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-gray-700">
          <Truck className="w-5 h-5 text-brand-red" />
          Fast Shipping
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-gray-700">
          <RotateCcw className="w-5 h-5 text-brand-red" />
          30-Day Returns
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-gray-700">
          <Heart className="w-5 h-5 text-brand-red" />
          2,000+ Happy Customers
        </div>
      </div>

      {/* Product comparison callout */}
      {showComparison && (
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-sm font-heading font-semibold text-brand-red hover:text-brand-black transition-colors w-fit group"
        >
          Compare models
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}

      {/* Divider */}
      <hr className="border-brand-gray-200" />

      {/* Tabbed content */}
      <div>
        {/* Tab buttons */}
        <div className="flex border-b border-brand-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-heading font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-brand-red text-brand-red"
                  : "border-transparent text-brand-gray-500 hover:text-brand-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="pt-5 text-sm text-brand-gray-700 leading-relaxed">
          {activeTab === "description" && (
            <div className="flex flex-col gap-4">
              <p>{product.description}</p>
              {product.features && product.features.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "specs" && product.specs && (
            <table className="w-full text-left">
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr
                    key={key}
                    className="border-b border-brand-gray-100 last:border-0"
                  >
                    <td className="py-2.5 pr-4 font-semibold text-brand-black w-1/3">
                      {key}
                    </td>
                    <td className="py-2.5">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "kit" && product.kitContents && (
            <ul className="flex flex-col gap-2">
              {product.kitContents.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
