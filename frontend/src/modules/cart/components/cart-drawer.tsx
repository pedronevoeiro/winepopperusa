"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, Trash2, Tag, ShoppingBag, PackageCheck } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { products } from "@/lib/products-data"

const FREE_SHIPPING_THRESHOLD = 5000 // $50.00 in cents

const VALID_CODES: Record<string, number> = {
  WELCOME10: 10,
  WINE20: 20,
}

/** Compute a "5–10 business days from now" date range string */
function getDeliveryEstimate(): string {
  const now = new Date()
  let bizDaysAdded = 0
  const startDate = new Date(now)
  while (bizDaysAdded < 5) {
    startDate.setDate(startDate.getDate() + 1)
    const day = startDate.getDay()
    if (day !== 0 && day !== 6) bizDaysAdded++
  }
  const endDate = new Date(now)
  bizDaysAdded = 0
  while (bizDaysAdded < 10) {
    endDate.setDate(endDate.getDate() + 1)
    const day = endDate.getDay()
    if (day !== 0 && day !== 6) bizDaysAdded++
  }
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(startDate)} – ${fmt(endDate)}`
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const addItem = useCartStore((s) => s.addItem)
  const subtotal = useCartStore((s) => s.subtotal)
  const total = useCartStore((s) => s.total)
  const totalItems = useCartStore((s) => s.totalItems)
  const discountCode = useCartStore((s) => s.discountCode)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const applyDiscount = useCartStore((s) => s.applyDiscount)
  const removeDiscount = useCartStore((s) => s.removeDiscount)

  const [codeInput, setCodeInput] = useState("")
  const [codeError, setCodeError] = useState("")

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  function handleApplyCode() {
    const upper = codeInput.trim().toUpperCase()
    const pct = VALID_CODES[upper]
    if (!pct) {
      setCodeError("Invalid discount code")
      return
    }
    const amount = Math.round(subtotal() * (pct / 100))
    applyDiscount(upper, amount)
    setCodeInput("")
    setCodeError("")
  }

  function handleRemoveCode() {
    removeDiscount()
    setCodeInput("")
    setCodeError("")
  }

  // Cross-sell logic
  const crossSell = useMemo(() => {
    const handles = items.map((i) => i.handle)
    const hasWinepopper =
      handles.includes("winepopper-aluminum") ||
      handles.includes("winepopper-lite")
    const hasRefill = handles.includes("refill-gas-capsule")

    if (hasWinepopper && !hasRefill) {
      const refill = products.find((p) => p.id === "refill-gas-capsule")!
      const variant = refill.variants[0]
      return {
        product: refill,
        variant,
        label: "Refill Gas Capsule",
        price: variant.price,
        image: refill.images[0]?.url,
      }
    }

    if (hasRefill && !hasWinepopper) {
      const lite = products.find((p) => p.id === "winepopper-lite")!
      const variant = lite.variants[0]
      return {
        product: lite,
        variant,
        label: "Winepopper Lite",
        price: variant.price,
        image: lite.images[0]?.url,
      }
    }

    return null
  }, [items])

  function handleAddCrossSell() {
    if (!crossSell) return
    const { product, variant } = crossSell
    addItem({
      id: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title === "Default" ? undefined : variant.title,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: product.images[0]?.url,
      handle: product.handle,
    })
  }

  const sub = subtotal()
  const tot = total()
  const itemCount = totalItems()
  const shippingGap = FREE_SHIPPING_THRESHOLD - sub
  const deliveryEstimate = getDeliveryEstimate()

  return (
    <>
      {/* Overlay + panel container */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dark backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeCart}
          aria-hidden
        />

        {/* Drawer panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-gray-200">
            <h2 className="font-heading font-bold text-lg text-brand-black">
              Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h2>
            <button
              onClick={closeCart}
              className="p-1 hover:text-brand-red transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
              <ShoppingBag className="w-12 h-12 text-brand-gray-300" />
              <p className="text-brand-gray-500 font-body">
                Your cart is empty
              </p>
              <button onClick={closeCart} className="btn-primary text-sm">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Items list */}
              <ul className="flex-1 overflow-y-auto divide-y divide-brand-gray-100 px-5">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-4 py-4">
                    {/* Thumbnail */}
                    {item.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-brand-gray-50 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-brand-black truncate">
                        {item.title}
                      </p>
                      {item.variantTitle && (
                        <p className="text-xs text-brand-gray-500">
                          {item.variantTitle}
                        </p>
                      )}

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-brand-gray-200 hover:border-brand-gray-500 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-brand-gray-200 hover:border-brand-gray-500 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price + remove */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <span className="font-heading font-bold text-sm text-brand-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-brand-gray-400 hover:text-brand-red transition-colors"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}

                {/* Cross-sell section */}
                {crossSell && (
                  <li className="py-4">
                    <p className="text-xs font-heading font-bold text-brand-gray-500 uppercase tracking-wide mb-3">
                      You might also like
                    </p>
                    <div className="flex items-center gap-3 bg-brand-gray-50 rounded-lg p-3">
                      {crossSell.image && (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-white shrink-0">
                          <Image
                            src={crossSell.image}
                            alt={crossSell.label}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-sm text-brand-black truncate">
                          {crossSell.label}
                        </p>
                        <p className="text-xs text-brand-gray-500">
                          {formatPrice(crossSell.price)}
                        </p>
                      </div>
                      <button
                        onClick={handleAddCrossSell}
                        className="btn-secondary text-xs py-1.5 px-4 shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                )}
              </ul>

              {/* Footer */}
              <div className="border-t border-brand-gray-200 px-5 py-5 flex flex-col gap-4">
                {/* Free shipping progress */}
                {shippingGap > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-brand-gray-700 mb-1.5">
                      Add{" "}
                      <span className="font-bold text-brand-red">
                        {formatPrice(shippingGap)}
                      </span>{" "}
                      more for free shipping!
                    </p>
                    <div className="w-full h-1.5 bg-brand-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-red rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {shippingGap <= 0 && sub > 0 && (
                  <p className="text-xs text-center text-green-600 font-semibold">
                    You qualify for free shipping!
                  </p>
                )}

                {/* Delivery estimate */}
                <p className="text-xs text-center text-brand-gray-600 flex items-center justify-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5" />
                  Estimated delivery: {deliveryEstimate}
                </p>

                {/* Discount code */}
                {!discountCode ? (
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-400" />
                        <input
                          type="text"
                          value={codeInput}
                          onChange={(e) => {
                            setCodeInput(e.target.value)
                            setCodeError("")
                          }}
                          placeholder="Discount code"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-brand-gray-200 rounded-[30px] focus:border-brand-red focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleApplyCode}
                        disabled={!codeInput.trim()}
                        className="btn-secondary text-xs py-2 px-4 disabled:opacity-40"
                      >
                        Apply
                      </button>
                    </div>
                    {codeError && (
                      <p className="text-xs text-brand-red mt-1">{codeError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-brand-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      {discountCode}
                    </span>
                    <button
                      onClick={handleRemoveCode}
                      className="text-xs text-brand-gray-500 hover:text-brand-red transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Summary */}
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-gray-700">Subtotal</span>
                    <span className="font-semibold">{formatPrice(sub)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-heading font-bold pt-2 border-t border-brand-gray-100">
                    <span>Estimated Total</span>
                    <span>{formatPrice(tot)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center py-3.5"
                >
                  Proceed to Checkout
                </Link>

                {/* Accepted payment methods */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className="text-[10px] text-brand-gray-400 font-body">We accept</span>
                  <div className="flex items-center gap-2">
                    {/* Visa */}
                    <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.5 21h-3l1.9-11.5h3L19.5 21zm12.8-11.2c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.7 3.1 1.2.6 1.6.9 1.6 1.4 0 .8-.9 1.1-1.8 1.1-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.2-2.5-3.1-1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.4-2.3zM37 9.5h-2.3c-.7 0-1.3.2-1.6 1L29.4 21h3.2l.6-1.8h3.9l.4 1.8H40L37 9.5zm-3.5 8.3l1.2-3.3.4-1.1.2 1.1.7 3.3h-2.5zM15.4 9.5L12.5 17l-.3-1.5c-.5-1.8-2.2-3.7-4-4.7l2.7 10.1h3.2l4.8-11.4h-3.5z" fill="#fff"/><path d="M10 9.5H5.1l-.1.3c3.8.9 6.3 3.2 7.3 5.9L11.2 11c-.2-.8-.7-1-1.2-1.5z" fill="#F9A51A"/></svg>
                    {/* Mastercard */}
                    <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#252525"/><circle cx="19" cy="16" r="8" fill="#EB001B"/><circle cx="29" cy="16" r="8" fill="#F79E1B"/><path d="M24 10.3a8 8 0 010 11.4 8 8 0 000-11.4z" fill="#FF5F00"/></svg>
                    {/* Amex */}
                    <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#2E77BC"/><path d="M6 16l2-5h3l1 2.5L13 11h3l2 5-2 5h-3l-1-2.5L11 21H8L6 16zm18-5h8l1.5 2L35 11h5l-4 5 4 5h-5l-1.5-2L32 21h-8l-1.5-2.5L21 21h-3l4-5-4-5h3l1.5 2.5z" fill="#fff"/></svg>
                    {/* Apple Pay */}
                    <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#000"/><path d="M16.3 11.2c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.6-.4 2.1-1.1zm.7.6c-1.2-.1-2.2.7-2.7.7-.6 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.3.9 7 .6.9 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6 1 0 1.3.6 2.3.6.9 0 1.5-.8 2.1-1.7.7-.9.9-1.9.9-1.9-1-.4-1.8-1.5-1.8-2.9 0-1.2.7-2.2 1.7-2.7-.7-.9-1.7-1.4-2.7-1.5zm8.3-.3v9.7h1.5v-3.3h2.1c1.9 0 3.3-1.3 3.3-3.2s-1.3-3.2-3.2-3.2h-3.7zm1.5 1.3h1.7c1.3 0 2 .7 2 1.9s-.7 1.9-2 1.9h-1.7v-3.8zm9 8.5c1 0 1.9-.5 2.3-1.3h0v1.2h1.4v-4.8c0-1.4-1.1-2.3-2.8-2.3-1.6 0-2.7.9-2.8 2.1h1.4c.1-.6.7-1 1.4-1 .9 0 1.4.4 1.4 1.2v.5l-1.8.1c-1.7.1-2.6.8-2.6 2 0 1.2.9 2 2.1 2zm.4-1.1c-.8 0-1.3-.4-1.3-1 0-.6.5-1 1.4-1l1.6-.1v.5c0 .9-.8 1.6-1.7 1.6zm5.1 3.5c1.5 0 2.2-.6 2.8-2.2l2.7-7.5h-1.5l-1.8 5.7h0l-1.8-5.7H40l2.6 7.2-.1.5c-.3.8-.7 1.1-1.4 1.1-.1 0-.4 0-.5 0v1.2c.1 0 .5 0 .7 0z" fill="#fff"/></svg>
                    {/* Google Pay */}
                    <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth=".5"/><path d="M23.3 16.5v3h-1V12h2.6c.6 0 1.2.2 1.7.7.5.4.7 1 .7 1.6 0 .7-.2 1.2-.7 1.6-.5.4-1 .7-1.7.7h-1.6zm0-3.5v2.5h1.7c.4 0 .7-.1 1-.4.3-.3.4-.6.4-1s-.1-.7-.4-1c-.3-.3-.6-.4-1-.4h-1.7zm7.4 1.3c.7 0 1.3.2 1.7.6.4.4.6 1 .6 1.7v3.4h-1v-.8c-.4.6-.9.9-1.6.9-.6 0-1.1-.2-1.5-.5-.4-.3-.6-.8-.6-1.3 0-.5.2-1 .6-1.3.4-.3.9-.5 1.6-.5.5 0 1 .1 1.3.4v-.3c0-.4-.1-.8-.4-1-.3-.3-.7-.4-1.1-.4-.6 0-1.1.3-1.3.7l-.9-.4c.4-.7 1.1-1.2 2.1-1.2h.5zm-1.3 4.1c0 .3.1.5.4.7.2.2.5.3.8.3.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1-.4-.3-.8-.4-1.4-.4-.4 0-.8.1-1 .3-.3.2-.4.4-.4.7zm7.9-3.9L34 22h-1l1.1-2.5-2-4.5h1.1l1.4 3.3 1.3-3.3h1.1z" fill="#3C4043"/><path d="M22 16.8c0-.3 0-.7-.1-1H18v1.9h2.2c-.1.5-.4 1-.8 1.3v1h1.3c.8-.7 1.3-1.8 1.3-3.2z" fill="#4285F4"/><path d="M18 20c1.1 0 2-.4 2.7-1l-1.3-1c-.4.2-.8.4-1.4.4-.9 0-1.8-.6-2-1.5h-1.4v1.1c.6 1.2 1.9 2 3.4 2z" fill="#34A853"/><path d="M16 16.8c-.1-.3-.2-.6-.2-1s.1-.7.2-1v-1h-1.4c-.3.6-.5 1.3-.5 2s.2 1.4.5 2l1.4-1z" fill="#FBBC04"/><path d="M18 13.2c.6 0 1 .2 1.4.6l1-1c-.6-.6-1.4-1-2.4-1-1.5 0-2.8.8-3.4 2l1.4 1c.2-.9 1.1-1.6 2-1.6z" fill="#EA4335"/></svg>
                  </div>
                </div>

                {/* Security reassurance */}
                <p className="text-[11px] text-center text-brand-gray-400">
                  🔒 Secure 256-bit SSL encryption
                </p>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  )
}
