"use client"

import { useState } from "react"
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-client"
import { useCartStore } from "@/lib/cart-store"
import CheckoutForm from "@/modules/checkout/components/checkout-form"
import Link from "next/link"
import { Package } from "lucide-react"

function StripeCheckoutWrapper() {
  const stripe = useStripe()
  const elements = useElements()
  return <CheckoutForm stripe={stripe} elements={elements} />
}

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null)
  const subtotal = useCartStore((s) => s.subtotal)
  const discountAmount = useCartStore((s) => s.discountAmount)

  const sub = subtotal()

  // Estimate total for Stripe Elements initialization (deferred intent)
  const shipping = sub >= 5000 ? 0 : 599
  const taxable = Math.max(0, sub - discountAmount)
  const tax = Math.round(taxable * 0.0825)
  const estimatedTotal = Math.max(50, taxable + shipping + tax)

  // Empty cart
  if (sub <= 0) {
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
        <button onClick={() => { setError(null); window.location.reload() }} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{
        mode: "payment",
        amount: estimatedTotal,
        currency: "usd",
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
      <StripeCheckoutWrapper />
    </Elements>
  )
}
