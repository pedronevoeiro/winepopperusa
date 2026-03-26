"use client"

import { analyticsConfig } from "./config"

// ── Type declarations ─────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: Record<string, unknown>[]
    fbq: (...args: unknown[]) => void
  }
}

// ── GA4 ecommerce item type ───────────────────────────────

interface GA4Item {
  item_id: string
  item_name: string
  price: number
  quantity: number
}

// ── dataLayer helper ──────────────────────────────────────
// Always clears ecommerce before pushing a new event (GA4 best practice)

function pushEcommerceEvent(event: string, ecommerce: Record<string, unknown>) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null }) // clear previous ecommerce data
  window.dataLayer.push({ event, ecommerce })
}

// ── Page view ─────────────────────────────────────────────

export function trackPageView(url: string) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("config", analyticsConfig.gaMeasurementId, { page_path: url })
}

// ── Generic event ─────────────────────────────────────────

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", name, params)
}

// ── 1. view_item ──────────────────────────────────────────

export function trackViewItem(item: {
  id: string
  name: string
  price: number
  currency?: string
}) {
  const currency = item.currency || "USD"
  const price = item.price / 100

  pushEcommerceEvent("view_item", {
    currency,
    value: price,
    items: [{ item_id: item.id, item_name: item.name, price, quantity: 1 }],
  })

  fbTrack("ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: price,
    currency,
  })
}

// ── 2. add_to_cart ────────────────────────────────────────

export function trackAddToCart(item: {
  id: string
  name: string
  price: number
  quantity: number
  currency?: string
}) {
  const currency = item.currency || "USD"
  const price = item.price / 100

  pushEcommerceEvent("add_to_cart", {
    currency,
    value: price * item.quantity,
    items: [
      { item_id: item.id, item_name: item.name, price, quantity: item.quantity },
    ],
  })

  fbTrack("AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: price * item.quantity,
    currency,
  })
}

// ── 3. begin_checkout ─────────────────────────────────────

export function trackBeginCheckout(
  value: number,
  items: GA4Item[],
  currency = "USD",
) {
  pushEcommerceEvent("begin_checkout", {
    currency,
    value: value / 100,
    items,
  })

  fbTrack("InitiateCheckout", { value: value / 100, currency })
}

// ── 4. purchase ───────────────────────────────────────────

export function trackPurchase(order: {
  id: string
  value: number
  currency?: string
  items: { id: string; name: string; price: number; quantity: number }[]
}) {
  const currency = order.currency || "USD"
  const value = order.value / 100
  const items: GA4Item[] = order.items.map((i) => ({
    item_id: i.id,
    item_name: i.name,
    price: i.price / 100,
    quantity: i.quantity,
  }))

  pushEcommerceEvent("purchase", {
    transaction_id: order.id,
    currency,
    value,
    items,
  })

  // Google Ads conversion
  if (typeof window !== "undefined" && window.gtag && analyticsConfig.googleAdsId) {
    window.gtag("event", "conversion", {
      send_to: `${analyticsConfig.googleAdsId}/purchase`,
      value,
      currency,
      transaction_id: order.id,
    })
  }

  fbTrack("Purchase", {
    content_ids: order.items.map((i) => i.id),
    content_type: "product",
    value,
    currency,
  })
}

// ── Helpers ───────────────────────────────────────────────

/** Save order data to sessionStorage so the confirmation page can fire purchase */
export function saveOrderForTracking(order: {
  id: string
  value: number
  currency?: string
  items: { id: string; name: string; price: number; quantity: number }[]
}) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem("wp_pending_order", JSON.stringify(order))
  } catch {
    // sessionStorage not available — silently ignore
  }
}

/** Read and consume saved order data (fires once) */
export function consumePendingOrder(): {
  id: string
  value: number
  currency?: string
  items: { id: string; name: string; price: number; quantity: number }[]
} | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem("wp_pending_order")
    if (!raw) return null
    sessionStorage.removeItem("wp_pending_order")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ── Meta Pixel ────────────────────────────────────────────

export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("track", event, params)
}
