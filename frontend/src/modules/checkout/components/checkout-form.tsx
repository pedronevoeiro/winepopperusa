"use client"

import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PaymentElement, ExpressCheckoutElement } from "@stripe/react-stripe-js"
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js"
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
import { trackBeginCheckout, saveOrderForTracking } from "@/lib/analytics"

// ── Constants ────────────────────────────────────────────

const FREE_SHIPPING_THRESHOLD = 5000 // $50 in cents
const SHIPPING_STANDARD_FALLBACK = 599
const SHIPPING_EXPRESS_FALLBACK = 1299
const TAX_RATE = 0.0825

type EasyPostRate = {
  id: string
  carrier: string
  service: string
  rate: number
  currency: string
  delivery_days: number | null
}

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

interface CheckoutFormProps {
  stripe?: ReturnType<typeof import("@stripe/react-stripe-js").useStripe> | null
  elements?: ReturnType<typeof import("@stripe/react-stripe-js").useElements> | null
}

async function createPaymentIntent(amount: number, itemCount: number): Promise<string> {
  const res = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      metadata: { itemCount: itemCount.toString() },
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.clientSecret
}

export default function CheckoutForm({ stripe = null, elements = null }: CheckoutFormProps) {
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
  const [submitting, setSubmitting] = useState("")
  const [paymentError, setPaymentError] = useState("")

  // EasyPost dynamic rates
  const [easypostRates, setEasypostRates] = useState<EasyPostRate[]>([])
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesShipmentId, setRatesShipmentId] = useState("")

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
      const ga4Items = items.map((i) => ({
        item_id: i.variantId,
        item_name: i.title,
        price: i.price / 100,
        quantity: i.quantity,
      }))
      trackBeginCheckout(sub, ga4Items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch EasyPost rates when address is complete
  useEffect(() => {
    if (!address || !city || !state || !zip || zip.length < 5) {
      setEasypostRates([])
      return
    }

    const controller = new AbortController()
    const fetchRates = async () => {
      setRatesLoading(true)
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const res = await fetch(`${backendUrl}/store/shipping-rates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            address: { street1: address, city, state, zip, country: "US" },
          }),
        })
        if (res.ok) {
          const data = await res.json()
          setEasypostRates(data.rates || [])
          setRatesShipmentId(data.shipment_id || "")
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Failed to fetch shipping rates, using fallbacks")
        }
      } finally {
        setRatesLoading(false)
      }
    }

    // Debounce the API call
    const timeout = setTimeout(fetchRates, 600)
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [address, city, state, zip])

  // Get shipping prices from EasyPost rates or fallbacks
  const shippingStandardPrice = useMemo(() => {
    if (easypostRates.length > 0) {
      // Find cheapest non-express rate (Priority, GroundAdvantage, etc.)
      const standard = easypostRates.find(
        (r) => r.service === "GroundAdvantage" || r.service === "Priority"
      ) || easypostRates[0]
      return standard ? Math.round(standard.rate * 100) : SHIPPING_STANDARD_FALLBACK
    }
    return SHIPPING_STANDARD_FALLBACK
  }, [easypostRates])

  const shippingExpressPrice = useMemo(() => {
    if (easypostRates.length > 0) {
      const express = easypostRates.find(
        (r) => r.service === "Express" || r.service === "PriorityMailExpress"
      )
      return express ? Math.round(express.rate * 100) : SHIPPING_EXPRESS_FALLBACK
    }
    return SHIPPING_EXPRESS_FALLBACK
  }, [easypostRates])

  // Compute shipping cost
  const qualifiesFreeShipping = sub >= FREE_SHIPPING_THRESHOLD
  const shippingCost = useMemo(() => {
    if (shippingMethod === "free" && qualifiesFreeShipping) return 0
    if (shippingMethod === "express") return shippingExpressPrice
    return shippingStandardPrice
  }, [shippingMethod, qualifiesFreeShipping, shippingStandardPrice, shippingExpressPrice])

  // Auto-select free shipping when eligible
  useEffect(() => {
    if (qualifiesFreeShipping && shippingMethod === "standard") {
      setShippingMethod("free")
    }
  }, [qualifiesFreeShipping, shippingMethod])

  const estimatedTax = Math.round((sub - discountAmount) * TAX_RATE)
  const orderTotal = Math.max(0, sub - discountAmount) + shippingCost + estimatedTax

  // Delivery dates (use EasyPost estimate when available)
  const deliveryRange = useMemo(() => {
    if (easypostRates.length > 0) {
      const rate = shippingMethod === "express"
        ? easypostRates.find((r) => r.service === "Express" || r.service === "PriorityMailExpress")
        : easypostRates.find((r) => r.service === "GroundAdvantage" || r.service === "Priority") || easypostRates[0]
      if (rate?.delivery_days) {
        const min = rate.delivery_days
        const max = min + 2
        return `${getDeliveryDate(min)} – ${getDeliveryDate(max)}`
      }
    }
    if (shippingMethod === "express") {
      return `${getDeliveryDate(2)} – ${getDeliveryDate(3)}`
    }
    return `${getDeliveryDate(5)} – ${getDeliveryDate(7)}`
  }, [shippingMethod, easypostRates])

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

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const [zipLookedUp, setZipLookedUp] = useState(false)

  function handleZipChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5)
    setZip(value)
    setZipLookedUp(false)

    if (value.length === 5) {
      fetch(`https://api.zippopotam.us/us/${value}`)
        .then((res) => {
          if (!res.ok) return null
          return res.json()
        })
        .then((data) => {
          if (data?.places?.[0]) {
            const place = data.places[0]
            if (!city) setCity(place["place name"] || "")
            if (!state) setState(place["state abbreviation"] || "")
            setZipLookedUp(true)
          }
        })
        .catch(() => {})
    }
  }

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Validation helpers
  function isEmailValid(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

  // Form submit — creates PaymentIntent on demand, then confirms
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) return

    setSubmitting("processing")
    setPaymentError("")

    try {
      // Validate form elements first
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setPaymentError(submitError.message || "Please check your payment details.")
        setSubmitting("")
        return
      }

      // Create PaymentIntent on the server
      const clientSecret = await createPaymentIntent(orderTotal, items.length)

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmed`,
          receipt_email: email,
          shipping: {
            name: `${firstName} ${lastName}`,
            address: {
              line1: address,
              line2: apt || undefined,
              city,
              state,
              postal_code: zip,
              country: "US",
            },
            phone: phone || undefined,
          },
        },
        redirect: "if_required",
      })

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.")
        setSubmitting("")
      } else {
        saveOrderForTracking({
          id: `WP-${Date.now()}`,
          value: orderTotal,
          items: items.map((i) => ({ id: i.variantId, name: i.title, price: i.price, quantity: i.quantity })),
        })
        clearCart()
        router.push("/order/confirmed")
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.")
      setSubmitting("")
    }
  }

  // Express Checkout confirm handler (Apple Pay, Google Pay, Link)
  async function handleExpressCheckoutConfirm(event: StripeExpressCheckoutElementConfirmEvent) {
    if (!stripe || !elements) return

    setSubmitting("processing")
    setPaymentError("")

    try {
      const clientSecret = await createPaymentIntent(orderTotal, items.length)

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmed`,
        },
        redirect: "if_required",
      })

      if (error) {
        setPaymentError(error.message || "Payment failed. Please try again.")
        setSubmitting("")
      } else {
        saveOrderForTracking({
          id: `WP-${Date.now()}`,
          value: orderTotal,
          items: items.map((i) => ({ id: i.variantId, name: i.title, price: i.price, quantity: i.quantity })),
        })
        clearCart()
        router.push("/order/confirmed")
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Payment failed. Please try again.")
      setSubmitting("")
    }
  }

  // If cart is empty
  if (items.length === 0 && submitting === "") {
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

        {/* Express Checkout — Apple Pay, Google Pay, Link */}
        {stripe && (
          <div className="mb-6 bg-white rounded-xl border border-brand-gray-200 p-6">
            <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
              Express Checkout
            </h2>
            <ExpressCheckoutElement
              onConfirm={handleExpressCheckoutConfirm}
              options={{
                buttonType: {
                  applePay: "buy",
                  googlePay: "buy",
                },
                buttonTheme: {
                  applePay: "black",
                  googlePay: "black",
                },
                layout: {
                  maxColumns: 3,
                  maxRows: 1,
                },
              }}
            />
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-brand-gray-500 font-body">
                  Or pay with card
                </span>
              </div>
            </div>
          </div>
        )}

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
                <div className="sm:col-span-2">
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
                  {zipLookedUp && city && state && (
                    <p className="text-xs text-green-600 mt-1">
                      {city}, {STATE_NAMES[state] || state} — auto-filled from ZIP
                    </p>
                  )}
                </div>
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
                        <p className="font-heading font-semibold text-sm text-brand-black">
                          Standard Shipping
                          {ratesLoading && <span className="ml-2 text-xs text-brand-gray-400">(updating...)</span>}
                          {easypostRates.length > 0 && !ratesLoading && (
                            <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">LIVE RATE</span>
                          )}
                        </p>
                        <p className="text-xs text-brand-gray-500">Arrives {getDeliveryDate(5)} – {getDeliveryDate(7)}</p>
                      </div>
                    </div>
                    <span className="font-heading font-bold text-sm text-brand-black">{formatPrice(shippingStandardPrice)}</span>
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
                        {easypostRates.length > 0 && !ratesLoading && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">LIVE RATE</span>
                        )}
                      </p>
                      <p className="text-xs text-brand-gray-500">Arrives {getDeliveryDate(2)} – {getDeliveryDate(3)}</p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-sm text-brand-black">{formatPrice(shippingExpressPrice)}</span>
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

            {/* Payment — Stripe Elements */}
            <div className="bg-white rounded-xl border border-brand-gray-200 p-6">
              <h2 className="font-heading font-bold text-lg text-brand-black mb-4">
                Payment
              </h2>
              <PaymentElement
                options={{
                  layout: "tabs",
                  defaultValues: {
                    billingDetails: {
                      address: {
                        country: "US",
                      },
                    },
                  },
                  wallets: {
                    applePay: "never",
                    googlePay: "never",
                  },
                }}
              />
              {paymentError && (
                <p className="text-sm text-red-600 mt-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {paymentError}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs text-brand-gray-500 mt-3">
                <Lock className="w-3.5 h-3.5" />
                <span>Powered by Stripe &mdash; 256-bit SSL encryption.</span>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="submit"
              disabled={!!submitting || !stripe}
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
