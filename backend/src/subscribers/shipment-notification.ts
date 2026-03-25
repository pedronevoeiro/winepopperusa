import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function shipmentNotificationHandler({
  event: { data },
  container,
}: SubscriberArgs<Record<string, unknown>>) {
  const logger = container.resolve("logger")
  const notificationService = container.resolve(Modules.NOTIFICATION)

  try {
    const fulfillmentId = (data as any)?.id || (data as any)?.fulfillment_id
    if (!fulfillmentId) {
      logger.warn("Shipment notification: no fulfillment ID in event data")
      return
    }

    // Resolve the fulfillment to get tracking info
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const fulfillment = await fulfillmentModule.retrieveFulfillment(fulfillmentId, {
      relations: ["labels"],
    })

    if (!fulfillment) {
      logger.warn(`Shipment notification: fulfillment ${fulfillmentId} not found`)
      return
    }

    const fulfillmentData = fulfillment.data as Record<string, unknown> || {}
    const trackingCode = fulfillmentData.tracking_code as string || ""
    const carrier = fulfillmentData.carrier as string || "USPS"

    // Get tracking URL from labels or build from EasyPost
    const label = fulfillment.labels?.[0]
    const trackingUrl = label?.tracking_url || `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingCode}`

    // Try to get order and customer info
    const orderModule = container.resolve(Modules.ORDER)
    let customerEmail = ""
    let customerName = ""
    let orderId = ""

    try {
      // Get the order associated with this fulfillment
      const orders = await orderModule.listOrders(
        { id: (data as any)?.order_id },
        { relations: ["shipping_address"] }
      )
      const order = orders?.[0]
      if (order) {
        customerEmail = order.email || ""
        orderId = order.display_id?.toString() || order.id
        const addr = order.shipping_address
        customerName = addr ? `${addr.first_name || ""} ${addr.last_name || ""}`.trim() : ""
      }
    } catch {
      logger.warn("Could not resolve order details for shipment notification")
    }

    if (!customerEmail) {
      logger.warn("Shipment notification: no customer email found")
      return
    }

    await notificationService.createNotifications({
      to: customerEmail,
      channel: "email",
      template: "order-shipment-created",
      data: {
        customer_name: customerName || "Customer",
        order_id: orderId,
        tracking_code: trackingCode,
        tracking_url: trackingUrl,
        carrier,
      },
    })

    logger.info(`Shipment email sent to ${customerEmail} for fulfillment ${fulfillmentId}`)
  } catch (error) {
    logger.error(`Shipment notification failed: ${(error as Error).message}`)
  }
}

export const config: SubscriberConfig = {
  event: ["order.fulfillment_created"],
}
