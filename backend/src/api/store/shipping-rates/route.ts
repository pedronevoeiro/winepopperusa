import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { EasyPostApiClient } from "../../../modules/easypost/client"
import type { EasyPostAddress } from "../../../modules/easypost/types"

/**
 * POST /store/shipping-rates
 * Returns available shipping rates from EasyPost for a given address.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { address } = req.body as {
      address: {
        street1: string
        street2?: string
        city: string
        state: string
        zip: string
        country?: string
      }
    }

    if (!address || !address.street1 || !address.city || !address.state || !address.zip) {
      return res.status(400).json({
        error: "Missing required address fields: street1, city, state, zip",
      })
    }

    const apiKey = process.env.EASYPOST_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: "EasyPost API key not configured" })
    }

    const client = new EasyPostApiClient(apiKey)

    const toAddress: EasyPostAddress = {
      street1: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || "US",
    }

    const shipment = await client.getRates(toAddress)

    // Group and format rates for the frontend
    const rates = shipment.rates
      .map((rate) => ({
        id: rate.id,
        carrier: rate.carrier,
        service: rate.service,
        rate: parseFloat(rate.rate),
        currency: rate.currency,
        delivery_days: rate.delivery_days || rate.est_delivery_days,
      }))
      .sort((a, b) => a.rate - b.rate)

    return res.json({
      shipment_id: shipment.id,
      rates,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("EasyPost rate request failed:", message)
    return res.status(500).json({ error: "Failed to fetch shipping rates" })
  }
}
