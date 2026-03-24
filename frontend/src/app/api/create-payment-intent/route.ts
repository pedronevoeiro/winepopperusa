import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
})

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "usd", metadata } = await req.json()

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum is $0.50." },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Stripe error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
