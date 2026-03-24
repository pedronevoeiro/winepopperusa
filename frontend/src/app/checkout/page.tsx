import type { Metadata } from "next"
import CheckoutForm from "@/modules/checkout/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Winepopper USA",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
