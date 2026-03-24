"use client"

import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Lock,
  Tag,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
  RotateCcw,
  Package,
} from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/utils"
import { trackBeginCheckout } from "@/lib/analytics"

// ── Constants ────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 5000 // $50 in cents
const SHIPPING_STANDARD = 599
const SHIPPING_EXPRESS = 1299
const TAX_RATE = 0.0825

const VALID_CODES: Record<string, number> = {
  WELCOME10: 10,
  WINE20: 20,
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC",
] as const

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",
  KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",
  MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",
  NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",
  NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
  DC:"District of Columbia",
}

// ── Helpers ──────────────────────────────────────────────

function getDeliveryDate(daysToAdd: number): string {
  const date = new Date()
  let added = 0
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length >= 3) {
    return digits.slice(0, 2) + " / " + digits.slice(2)
  }
  return digits
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10)
  if (digits.length >= 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length >= 4) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  }
  return digits
}

// ── Component ────────────────────────────────────────────

export default function CheckoutForm() {
  const router = useRouter()

  // Cart state
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const total = useCartStore((s) => s.total)
  const discountCode = useCartStore((s) => s.discountCode)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const applyDiscount = useCartStore((s) => s.applyDiscount)
  const removeDiscount = useCartStore((s) => s.removeDiscount)
  const clearCart = useCartStore((s) => s.clearCart)

  // Form state
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [apt, setApt] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [phone, setPhone] = useState("")
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "free">("standard")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Discount code input
  const [codeInput, setCodeInput] = useState("")
  const [codeError, setCodeError] = useState("")

  // Mobile summary toggle
  const [summaryOpen, setSummaryOpen] = useState(false)

  // Form validation
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Checkout step tracking
  const [activeSection, setActiveSection] = useState<"contact" | "shipping" | "method" | "payment">("contact")

  useEffect(() => {
    document.title = "Checkout | Winepopper USA"
  }, [])

  // Track begin_checkout on mount
  const sub = subtotal()
  useEffect(() => {
    if (sub > 0) {
      trackBeginCheckout(sub)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Compute shipping cost
  const qualifiesFreeShipping = sub >= FREE_SHIPPING_THRESHOLD
  const shippingCost = useMemo(() => {
    if (shippingMethod === "free" && qualifiesFreeShipping) return 0
    if (shippingMethod === "express") return SHIPPING_EXPRESS
    return SHIPPING_STANDARD
  }, [shippingMethod, qualifiesFreeShipping])

  // Auto-select free shipping when eligible
  useEffect(() => {
    if (qualifiesFreeShipping && shippingMethod === "standard") {
      setShippingMethod("free")
    }
  }, [qualifiesFreeShipping, shippingMethod])

  const estimatedTax = Math.round((sub - discountAmount) * TAX_RATE)
  const orderTotal = Math.max(0, sub - discountAmount) + shippingCost + estimatedTax

  // Delivery dates
  const deliveryRange = useMemo(() => {
    if (shippingMethod === "express") {
      return `${getDeliveryDate(2)} – ${getDeliveryDate(3)}`
    }
    return `${getDeliveryDate(5)} – ${getDeliveryDate(7)}`
  }, [shippingMethod])

  // Discount code handlers
  function handleApplyCode() {
    const upper = codeInput.trim().toUpperCase()
    const pct = VALID_CODES[upper]
    if (!pct) {
      setCodeError("Invalid discount code")
      return
    }
    const amount = Math.round(sub * (pct / 100))
    applyDiscount(upper, amount)
    setCodeInput("")
    setCodeError("")
  }

  function handleRemoveCode() {
    removeDiscount()
    setCodeInput("")
    setCodeError("")
  }

  // Input formatting handlers
  function handleCardNumberChange(e: ChangeEvent<HTMLInputElement>) {
    setCardNumber(formatCardNumber(e.target.value))
  }

  function handleExpiryChange(e: ChangeEvent<HTMLInputElement>) {
    setCardExpiry(formatExpiry(e.target.value))
  }

  function handleCvcChange(e: ChangeEvent<HTMLInputElement>) {
    setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhoneNumber(e.target.value))
  }

  function handleZipChange(e: ChangeEvent<HTMLInputElement>) {
    setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
  }

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Validation helpers
  function isEmailValid(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
  function isCardValid(v: string) { return v.replace(/\s/g, "").length >= 15 }
  function isExpiryValid(v: string) { return /^\d{2}\s?\/?\s?\d{2}$/.test(v.trim()) }
  function isCvcValid(v: string) { return v.length >= 3 }

  // Form submit
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    // Simulate order placement
    setTimeout(() => {
      clearCart()
      router.push("/order/confirmed")
    }, 1500)
  }

  // If cart is empty
  if (items.length === 0 && !submitting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Package className="w-16 h-16 text-brand-gray-300" />
        <p className="text-brand-gray-500 font-body text-lg">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    )
  }

  const inputCls =
    "w-full border border-brand-gray-200 rounded-lg px-4 py-3 text-sm font-body text-brand-black placeholder:text-brand-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-colors"

  const inputErrorCls = "border-red-300 focus:ring-red-300/40 focus:border-red-400"

  // ── Order Summary Content ──────────────────────────────
  const orderSummaryContent = (
    <>
      <ul className="divide-y divide-brand-gray-100">
        {items.map((item) => (
          <li key={item.variantId} className="flex gap-3 py-3">
            {item.image && (
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-gray-50 shrink-0 border border-brand-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-gray-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-heading font-semibold text-sm text-brand-black truncate">
                {item.title}
              </p>
              {item.variantTitle && (
                <p className="text-xs text-brand-gray-500">{item.variantTitle}</p>
              )}
            </div>
            <span className="font-heading font-bold text-sm text-brand-black shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {/* Discount code */}
      <div className="pt-3 border-t border-brand-gray-100">
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
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-brand-gray-200 rounded-lg focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/40 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyCode}
                disabled={!codeInput.trim()}
                className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
            {codeError && (
              <p className="text-xs text-brand-red mt-1">{codeError}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
            <span className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              {discountCode} applied
            </span>
            <button
              type="button"
              onClick={handleRemoveCode}
              className="text-xs text-brand-gray-500 hover:text-brand-red transition-colors"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 pt-3 border-t border-brand-gray-100 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-gray-600">Subtotal</span>
          <span className="font-semibold">{formatPrice(sub)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span className="font-semibold">-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-brand-gray-600">Shipping</span>
          <span className={`font-semibold ${shippingCost === 0 ? "text-green-600" : ""}`}>
            {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-brand-gray-600">Estimated Tax</span>
          <span className="font-semibold">{formatPrice(estimatedTax)}</span>
        </div>
        <div className="flex justify-between text-base font-heading font-bold pt-3 border-t border-brand-gray-200">
          <span>Total</span>
          <span>{formatPrice(orderTotal)}</span>
        </div>
      </div>

      {/* Delivery estimate in summary */}
      <div className="flex items-center gap-2 mt-3 p-3 bg-blue-50 rounded-lg">
        <Truck className="w-4 h-4 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-700 font-body">
          Estimated delivery: <strong>{deliveryRange}</strong>
        </p>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="flex flex-col items-center gap-1 text-center">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-[10px] text-brand-gray-500 leading-tight">Secure<br />Checkout</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <RotateCcw className="w-4 h-4 text-green-600" />
          <span className="text-[10px] text-brand-gray-500 leading-tight">30-Day<br />Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-[10px] text-brand-gray-500 leading-tight">SSL<br />Encrypted</span>
        </div>
      </div>
    </>
  )

  return (
    <section className="bg-brand-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb + progress */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-black">
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-xs font-body text-brand-gray-500">
            <Link href="/products" className="hover:text-brand-red transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-brand-black font-semibold">Checkout</span>
            <span>/</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Express Checkout */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-brand-gray-200 p-5">
            <p className="text-xs text-center text-brand-gray-500 font-body mb-3">Express Checkout</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-black text-white rounded-lg py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Pay
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-black text-white rounded-lg py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.22 8.69c.2-.56.94-.83 1.64-.6l.13.05C6.44 8.63 8.13 8.37 10 7.64l.22-.09c1.7-.69 3.47-1.52 5.47-1.94.9-.19 1.78-.25 2.56-.18a4 4 0 012.28.88c.58.5.98 1.16 1.18 1.94l.23.9c.32 1.27.38 2.37.2 3.38-.2 1.06-.64 1.96-1.28 2.68a5.46 5.46 0 01-2.22 1.5l-.68.24c-1.17.37-2.33.45-3.47.28a8.1 8.1 0 01-1.7-.45l-.63-.25a19 19 0 00-4.32-1.09c-.66-.08-1.3-.08-1.88 0l-.32.05c-.7.13-1.38-.26-1.52-.86L3.22 8.69z"/></svg>
                Pay
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#0070ba] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[#005ea6] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.78a.77.77 0 01.757-.644h6.23c2.068 0 3.5.42 4.233 1.258.68.776.853 1.85.532 3.29l-.01.06v.51l.398.225c.34.18.61.388.823.625.338.38.556.857.644 1.414.09.573.04 1.254-.144 2.028-.212.89-.557 1.664-1.024 2.3a4.7 4.7 0 01-1.58 1.39c-.61.34-1.313.577-2.094.704-.76.124-1.6.186-2.5.186H10.28a.95.95 0 00-.938.803l-.04.22-.658 4.166-.03.163a.95.95 0 01-.938.803H7.076z"/></svg>
                PayPal
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px bg-brand-gray-200" />
              <span className="text-xs text-brand-gray-400 font-body">or pay with card</span>
              <div className="flex-1 h-px bg-brand-gray-200" />
            </div>
          </div>
        </div>

        {/* Mobile order summary */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="w-full flex items-center justify-between bg-white border border-brand-gray-200 rounded-xl px-5 py-4"
          >
            <span className="font-heading font-bold text-sm text-brand-black flex items-center gap-2">
              Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              {summaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
            <span className="font-heading font-bold text-brand-black">
              {formatPrice(orderTotal)}
            </span>
          </button>
          {summaryOpen && (
            <div className="bg-white border border-t-0 border-brand-gray-200 rounded-b-xl px-5 py-4 -mt-2">
              {orderSummaryContent}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Left Column: Form ──────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 lg:max-w-[60%] flex flex-col gap-6"
            autoComplete="on"
          >
            {/* Contact */}
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6">
              <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
                Contact
              </h2>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => markTouched("email")}
                placeholder="Email address"
                className={`${inputCls} ${touched.email && !isEmailValid(email) ? inputErrorCls : ""}`}
              />
              {touched.email && !isEmailValid(email) && email.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
              )}
              <p className="text-xs text-brand-gray-400 mt-2">
                Order confirmation and shipping updates will be sent here
              </p>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6">
              <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                  className={`${inputCls} sm:col-span-2`}
                />
                <input
                  type="text"
                  autoComplete="address-line2"
                  value={apt}
                  onChange={(e) => setApt(e.target.value)}
                  placeholder="Apt / Suite (optional)"
                  className={`${inputCls} sm:col-span-2`}
                />
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className={inputCls}
                />
                <select
                  required
                  autoComplete="address-level1"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${inputCls} ${!state ? "text-brand-gray-400" : ""}`}
                >
                  <option value="" disabled>State</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{STATE_NAMES[s]} ({s})</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  value={zip}
                  onChange={handleZipChange}
                  placeholder="ZIP code"
                  inputMode="numeric"
                  className={inputCls}
                />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone (optional — for delivery updates)"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6">
              <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
                Shipping Method
              </h2>
              <div className="flex flex-col gap-3">
                {qualifiesFreeShipping && (
                  <label
                    className={`flex items-center justify-between border rounded-lg px-4 py-3.5 cursor-pointer transition-colors ${
                      shippingMethod === "free"
                        ? "border-brand-red bg-brand-red/5"
                        : "border-brand-gray-200 hover:border-brand-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value="free" checked={shippingMethod === "free"} onChange={() => setShippingMethod("free")} className="accent-brand-red w-4 h-4" />
                      <div>
                        <p className="font-heading font-semibold text-sm text-brand-black">Free Shipping</p>
                        <p className="text-xs text-brand-gray-500">Arrives {getDeliveryDate(5)} – {getDeliveryDate(7)}</p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-sm text-green-600">Free</span>
                  </label>
                )}

                {!qualifiesFreeShipping && (
                  <label
                    className={`flex items-center justify-between border rounded-lg px-4 py-3.5 cursor-pointer transition-colors ${
                      shippingMethod === "standard"
                        ? "border-brand-red bg-brand-red/5"
                        : "border-brand-gray-200 hover:border-brand-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value="standard" checked={shippingMethod === "standard"} onChange={() => setShippingMethod("standard")} className="accent-brand-red w-4 h-4" />
                      <div>
                        <p className="font-heading font-semibold text-sm text-brand-black">Standard Shipping</p>
                        <p className="text-xs text-brand-gray-500">Arrives {getDeliveryDate(5)} – {getDeliveryDate(7)}</p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-sm text-brand-black">{formatPrice(SHIPPING_STANDARD)}</span>
                  </label>
                )}

                <label
                  className={`flex items-center justify-between border rounded-lg px-4 py-3.5 cursor-pointer transition-colors ${
                    shippingMethod === "express"
                      ? "border-brand-red bg-brand-red/5"
                      : "border-brand-gray-200 hover:border-brand-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === "express"} onChange={() => setShippingMethod("express")} className="accent-brand-red w-4 h-4" />
                    <div>
                      <p className="font-heading font-semibold text-sm text-brand-black flex items-center gap-1.5">
                        Express Shipping
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">FAST</span>
                      </p>
                      <p className="text-xs text-brand-gray-500">Arrives {getDeliveryDate(2)} – {getDeliveryDate(3)}</p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-sm text-brand-black">{formatPrice(SHIPPING_EXPRESS)}</span>
                </label>
              </div>

              {/* Free shipping incentive */}
              {!qualifiesFreeShipping && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                  <Truck className="w-4 h-4 shrink-0" />
                  Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - sub)}</strong> more to unlock free shipping
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg text-brand-black">
                  Payment
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-brand-gray-400 bg-brand-gray-100 px-2 py-1 rounded font-mono">VISA</span>
                  <span className="text-[10px] text-brand-gray-400 bg-brand-gray-100 px-2 py-1 rounded font-mono">MC</span>
                  <span className="text-[10px] text-brand-gray-400 bg-brand-gray-100 px-2 py-1 rounded font-mono">AMEX</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onBlur={() => markTouched("card")}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    className={`${inputCls} ${touched.card && !isCardValid(cardNumber) ? inputErrorCls : ""}`}
                  />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="cc-exp"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  onBlur={() => markTouched("expiry")}
                  placeholder="MM / YY"
                  inputMode="numeric"
                  className={`${inputCls} ${touched.expiry && !isExpiryValid(cardExpiry) ? inputErrorCls : ""}`}
                />
                <input
                  type="text"
                  required
                  autoComplete="cc-csc"
                  value={cardCvc}
                  onChange={handleCvcChange}
                  onBlur={() => markTouched("cvc")}
                  placeholder="CVC"
                  inputMode="numeric"
                  className={`${inputCls} ${touched.cvc && !isCvcValid(cardCvc) ? inputErrorCls : ""}`}
                />
                <input
                  type="text"
                  required
                  autoComplete="cc-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className={`${inputCls} sm:col-span-2`}
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-gray-500 mt-3">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit SSL encryption &mdash; your payment info is secure.</span>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 transition-all"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Processing your order...
                </span>
              ) : (
                `Complete Order — ${formatPrice(orderTotal)}`
              )}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-brand-gray-500 text-xs pb-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" />
                30-Day Returns
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Encrypted Payment
              </span>
            </div>
          </form>

          {/* ── Right Column: Order Summary ────────── */}
          <aside className="hidden lg:block lg:w-[40%]">
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6 sticky top-28">
              <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
                Order Summary
              </h2>
              {orderSummaryContent}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
