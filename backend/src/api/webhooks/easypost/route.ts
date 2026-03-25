import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /webhooks/easypost
 * Receives tracking updates from EasyPost webhooks.
 * Configure this URL in EasyPost dashboard: https://your-backend.com/webhooks/easypost
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const event = req.body as Record<string, unknown>

    // EasyPost sends events with a "description" and "result" field
    const description = event.description as string
    const result = event.result as Record<string, unknown>

    if (!result) {
      return res.status(200).json({ received: true })
    }

    const objectType = result.object as string

    // We only care about tracker updates
    if (objectType !== "Tracker") {
      return res.status(200).json({ received: true })
    }

    const status = result.status as string // "in_transit", "out_for_delivery", "delivered", etc.
    const trackingCode = result.tracking_code as string
    const carrier = result.carrier as string || "USPS"
    const publicUrl = result.public_url as string || ""
    const statusDetail = result.status_detail as string || ""
    const shipmentId = result.shipment_id as string || ""

    const logger = (req as any).scope?.resolve?.("logger") || console
    logger.info?.(`EasyPost webhook: ${trackingCode} → ${status} (${statusDetail})`)

    // Only send email for significant status changes
    const notifyStatuses = ["in_transit", "out_for_delivery", "delivered", "return_to_sender", "failure"]
    if (!notifyStatuses.includes(status)) {
      return res.status(200).json({ received: true })
    }

    // Try to find the order associated with this tracking code
    try {
      const notificationService = req.scope.resolve(Modules.NOTIFICATION)
      const orderModule = req.scope.resolve(Modules.ORDER)
      const fulfillmentModule = req.scope.resolve(Modules.FULFILLMENT)

      // Search fulfillments by tracking data
      const fulfillments = await fulfillmentModule.listFulfillments({})
      const matchingFulfillment = fulfillments.find((f: any) => {
        const data = f.data as Record<string, unknown>
        return data?.tracking_code === trackingCode || data?.shipment_id === shipmentId
      })

      if (!matchingFulfillment) {
        logger.warn?.(`No fulfillment found for tracking code ${trackingCode}`)
        return res.status(200).json({ received: true })
      }

      // Get the order
      const orders = await orderModule.listOrders(
        {},
        { relations: ["shipping_address"] }
      )

      // Find order linked to this fulfillment (simplified lookup)
      const order = orders.find((o: any) => o.id === (matchingFulfillment as any).order_id)

      if (!order?.email) {
        logger.warn?.(`No order email found for tracking code ${trackingCode}`)
        return res.status(200).json({ received: true })
      }

      const addr = (order as any).shipping_address
      const customerName = addr ? `${addr.first_name || ""} ${addr.last_name || ""}`.trim() : "Customer"

      const template = status === "delivered" ? "order-delivered" : "order-tracking-update"

      const statusLabels: Record<string, string> = {
        in_transit: "In Transit",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        return_to_sender: "Returned to Sender",
        failure: "Delivery Failed",
      }

      await notificationService.createNotifications({
        to: order.email,
        channel: "email",
        template,
        data: {
          customer_name: customerName,
          tracking_code: trackingCode,
          tracking_url: publicUrl,
          carrier,
          status: statusLabels[status] || status,
          status_detail: statusDetail,
        },
      })

      logger.info?.(`Tracking update email sent to ${order.email}: ${status}`)
    } catch (err) {
      logger.error?.(`Failed to process tracking notification: ${(err as Error).message}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error("EasyPost webhook error:", error)
    return res.status(200).json({ received: true })
  }
}
