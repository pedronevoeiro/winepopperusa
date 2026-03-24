"use client"

import { analyticsConfig } from "./config"

// ── Google Analytics 4 ────────────────────────────────────

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
    fbq: (...args: unknown[]) => void
  }
}

export function trackPageView(url: string) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("config", analyticsConfig.gaMeasurementId, { page_path: url })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", name, params)
}

export function trackViewItem(item: {
  id: string
  name: string
  price: number
  currency?: string
}) {
  trackEvent("view_item", {
    currency: item.currency || "USD",
    value: item.price / 100,
    items: [{ item_id: item.id, item_name: item.name, price: item.price / 100 }],
  })
  fbTrack("ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price / 100,
    currency: item.currency || "USD",
  })
}

export function trackAddToCart(item: {
  id: string
  name: string
  price: number
  quantity: number
  currency?: string
}) {
  trackEvent("add_to_cart", {
    currency: item.currency || "USD",
    value: (item.price * item.quantity) / 100,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price / 100,
        quantity: item.quantity,
      },
    ],
  })
  fbTrack("AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: (item.price * item.quantity) / 100,
    currency: item.currency || "USD",
  })
}

export function trackBeginCheckout(value: number, currency = "USD") {
  trackEvent("begin_checkout", { currency, value: value / 100 })
  fbTrack("InitiateCheckout", { value: value / 100, currency })
}

export function trackPurchase(order: {
  id: string
  value: number
  currency?: string
  items: { id: string; name: string; price: number; quantity: number }[]
}) {
  const currency = order.currency || "USD"
  trackEvent("purchase", {
    transaction_id: order.id,
    currency,
    value: order.value / 100,
    items: order.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price / 100,
      quantity: i.quantity,
    })),
  })

  // Google Ads conversion
  if (window.gtag && analyticsConfig.googleAdsId) {
    window.gtag("event", "conversion", {
      send_to: `${analyticsConfig.googleAdsId}/purchase`,
      value: order.value / 100,
      currency,
      transaction_id: order.id,
    })
  }

  fbTrack("Purchase", {
    content_ids: order.items.map((i) => i.id),
    content_type: "product",
    value: order.value / 100,
    currency,
  })
}

// ── Meta Pixel ────────────────────────────────────────────

export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("track", event, params)
}
