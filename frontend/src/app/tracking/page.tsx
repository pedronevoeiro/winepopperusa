"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Package, Search, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react"

type TrackingStatus = {
  status: string
  status_detail: string
  tracking_code: string
  carrier: string
  public_url: string
  est_delivery_date: string | null
  tracking_details: {
    message: string
    datetime: string
    status: string
    source: string
  }[]
}

const STATUS_ICONS: Record<string, typeof Truck> = {
  pre_transit: Clock,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  failure: AlertCircle,
  return_to_sender: AlertCircle,
}

const STATUS_COLORS: Record<string, string> = {
  pre_transit: "text-gray-500",
  in_transit: "text-blue-600",
  out_for_delivery: "text-amber-600",
  delivered: "text-green-600",
  failure: "text-red-600",
  return_to_sender: "text-red-600",
}

const STATUS_LABELS: Record<string, string> = {
  pre_transit: "Pre-Transit",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failure: "Delivery Failed",
  return_to_sender: "Returned to Sender",
  unknown: "Unknown",
}

export default function TrackingPage() {
  const [trackingInput, setTrackingInput] = useState("")
  const [tracking, setTracking] = useState<TrackingStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const code = trackingInput.trim()
    if (!code) return

    setLoading(true)
    setError("")
    setTracking(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const res = await fetch(`${backendUrl}/store/tracking/${encodeURIComponent(code)}`)

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Tracking information not found. Please check your tracking number.")
        return
      }

      const data = await res.json()
      setTracking(data)
    } catch {
      setError("Unable to fetch tracking information. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-brand-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <Package className="w-12 h-12 text-brand-red mx-auto mb-4" />
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-black mb-2">
            Track Your Order
          </h1>
          <p className="text-brand-gray-500 font-body">
            Enter your tracking number to see delivery updates
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full pl-12 pr-4 py-4 text-sm border border-brand-gray-200 rounded-xl font-body text-brand-black placeholder:text-brand-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !trackingInput.trim()}
              className="btn-primary px-6 py-4 text-sm disabled:opacity-50"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-body">{error}</p>
          </div>
        )}

        {/* Tracking results */}
        {tracking && (
          <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
            {/* Status header */}
            <div className="p-6 border-b border-brand-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = STATUS_ICONS[tracking.status] || Package
                    const color = STATUS_COLORS[tracking.status] || "text-gray-500"
                    return <Icon className={`w-8 h-8 ${color}`} />
                  })()}
                  <div>
                    <p className={`font-heading font-bold text-lg ${STATUS_COLORS[tracking.status] || "text-gray-600"}`}>
                      {STATUS_LABELS[tracking.status] || tracking.status}
                    </p>
                    {tracking.status_detail && (
                      <p className="text-sm text-brand-gray-500">{tracking.status_detail}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-brand-gray-100 text-brand-gray-600 px-3 py-1 rounded-full font-semibold">
                  {tracking.carrier}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-brand-gray-600">
                <span><strong>Tracking:</strong> {tracking.tracking_code}</span>
                {tracking.est_delivery_date && (
                  <span><strong>Est. Delivery:</strong> {new Date(tracking.est_delivery_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                )}
              </div>

              {tracking.public_url && (
                <a
                  href={tracking.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-brand-red hover:underline font-semibold"
                >
                  View on carrier website &rarr;
                </a>
              )}
            </div>

            {/* Timeline */}
            {tracking.tracking_details && tracking.tracking_details.length > 0 && (
              <div className="p-6">
                <h3 className="font-heading font-semibold text-sm text-brand-black mb-4">
                  Tracking History
                </h3>
                <div className="space-y-0">
                  {tracking.tracking_details.map((detail, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-brand-red" : "bg-brand-gray-300"}`} />
                        {i < tracking.tracking_details.length - 1 && (
                          <div className="w-0.5 h-full min-h-[40px] bg-brand-gray-200" />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-body text-sm text-brand-black font-medium">
                          {detail.message}
                        </p>
                        <p className="text-xs text-brand-gray-500 mt-1">
                          {new Date(detail.datetime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          {detail.source && ` — ${detail.source}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help text */}
        <div className="text-center mt-10">
          <p className="text-sm text-brand-gray-500 font-body">
            Can&apos;t find your tracking number? Check your shipping confirmation email or{" "}
            <Link href="/contact" className="text-brand-red hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
