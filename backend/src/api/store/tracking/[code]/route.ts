import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import EasyPostClient from "@easypost/api"

/**
 * GET /store/tracking/:code
 * Looks up tracking information from EasyPost by tracking code.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const code = (req.params as any).code as string

    if (!code) {
      return res.status(400).json({ error: "Tracking code is required" })
    }

    const apiKey = process.env.EASYPOST_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: "Tracking service not configured" })
    }

    const client = new EasyPostClient(apiKey)

    // Create a tracker for this tracking code
    const tracker = await client.Tracker.create({
      tracking_code: code,
    })

    return res.json({
      status: tracker.status || "unknown",
      status_detail: tracker.status_detail || "",
      tracking_code: tracker.tracking_code || code,
      carrier: tracker.carrier || "",
      public_url: tracker.public_url || "",
      est_delivery_date: tracker.est_delivery_date || null,
      tracking_details: (tracker.tracking_details || []).map((d: any) => ({
        message: d.message || "",
        datetime: d.datetime || "",
        status: d.status || "",
        source: d.source || "",
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Tracking lookup failed:", message)
    return res.status(404).json({
      error: "Tracking information not found. Please check your tracking number and try again.",
    })
  }
}
