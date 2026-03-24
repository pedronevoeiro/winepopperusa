"use client"

import { useEffect, useState } from "react"
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-client"
import { useCartStore } from "@/lib/cart-store"
import CheckoutForm from "@/modules/checkout/components/checkout-form"
import Link from "next/link"
import { Package } from "lucide-react"

function StripeCheckoutWrapper({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  return <CheckoutForm clientSecret={clientSecret} stripe={stripe} elements={elements} />
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const subtotal = useCartStore((s) => s.subtotal)
  const discountAmount = useCartStore((s) => s.discountAmount)
  const items = useCartStore((s) => s.items)

  const sub = subtotal()

  useEffect(() => {
    if (sub <= 0) return

    const shipping = sub >= 5000 ? 0 : 599
    const taxable = Math.max(0, sub - discountAmount)
    const tax = Math.round(taxable * 0.0825)
    const estimatedTotal = taxable + shipping + tax

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: estimatedTotal,
        metadata: {
          itemCount: items.length.toString(),
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setClientSecret(data.clientSecret)
        }
      })
      .catch(() => setError("Failed to initialize payment. Please try again."))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub > 0])

  // Empty cart
  if (sub <= 0 && !clientSecret) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Package className="w-16 h-16 text-brand-gray-300" />
        <p className="text-brand-gray-500 font-body text-lg">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-brand-red font-body text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  // Loading state while waiting for payment intent
  if (!clientSecret) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-brand-gray-500">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Preparing secure checkout...
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#7B2D3B",
            colorBackground: "#ffffff",
            colorText: "#1a1a1a",
            colorDanger: "#dc2626",
            fontFamily: "Rubik, system-ui, sans-serif",
            borderRadius: "8px",
            spacingUnit: "4px",
          },
        },
      }}
    >
      <StripeCheckoutWrapper clientSecret={clientSecret} />
    </Elements>
  )
}
