import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import { Resend } from "resend"

type InjectedDependencies = {
  logger: Logger
}

type ResendOptions = {
  apiKey: string
  fromEmail: string
  channels: string[]
}

type SendNotificationDTO = {
  to: string
  channel: string
  template: string
  data: Record<string, unknown> | null
}

type SendNotificationResult = {
  id: string
}

class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"

  private resend: Resend
  private fromEmail: string
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()
    this.logger = logger
    this.resend = new Resend(options.apiKey)
    this.fromEmail = options.fromEmail || "orders@winepopperusa.com"
    this.logger.info("Resend notification provider initialized")
  }

  async send(notification: SendNotificationDTO): Promise<SendNotificationResult> {
    const { to, template, data } = notification
    const templateData = data || {}

    let subject: string
    let html: string

    switch (template) {
      case "order-shipment-created":
        subject = `Your Winepopper order has shipped!`
        html = this.buildShipmentEmail(templateData)
        break
      case "order-tracking-update":
        subject = `Shipping update for your Winepopper order`
        html = this.buildTrackingUpdateEmail(templateData)
        break
      case "order-delivered":
        subject = `Your Winepopper order has been delivered!`
        html = this.buildDeliveredEmail(templateData)
        break
      default:
        subject = `Update from Winepopper USA`
        html = this.buildGenericEmail(templateData)
    }

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      })

      this.logger.info(`Email sent to ${to} (template: ${template})`)
      return { id: result.data?.id || "sent" }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${(error as Error).message}`)
      return { id: "" }
    }
  }

  private buildShipmentEmail(data: Record<string, unknown>): string {
    const trackingUrl = data.tracking_url as string || "#"
    const trackingCode = data.tracking_code as string || ""
    const carrier = data.carrier as string || "USPS"
    const orderId = data.order_id as string || ""
    const customerName = data.customer_name as string || "Customer"

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:#7B2D3B;padding:30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">Your Order Has Shipped!</h1>
      </div>
      <div style="padding:30px;">
        <p style="color:#333;font-size:16px;line-height:1.6;">Hi ${customerName},</p>
        <p style="color:#555;font-size:15px;line-height:1.6;">
          Great news! Your Winepopper order${orderId ? ` <strong>#${orderId}</strong>` : ""} is on its way.
        </p>
        <div style="background:#f9f9f9;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:0 0 8px;color:#777;font-size:13px;text-transform:uppercase;">Tracking Details</p>
          <p style="margin:0 0 4px;color:#333;font-size:15px;"><strong>Carrier:</strong> ${carrier}</p>
          <p style="margin:0;color:#333;font-size:15px;"><strong>Tracking Number:</strong> ${trackingCode}</p>
        </div>
        <div style="text-align:center;margin:30px 0;">
          <a href="${trackingUrl}" style="display:inline-block;background:#7B2D3B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
            Track Your Package
          </a>
        </div>
        <p style="color:#999;font-size:13px;line-height:1.5;text-align:center;">
          You can also copy and paste this link into your browser:<br>
          <a href="${trackingUrl}" style="color:#7B2D3B;">${trackingUrl}</a>
        </p>
      </div>
      <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;">Winepopper USA &mdash; Pop your wine like champagne.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  private buildTrackingUpdateEmail(data: Record<string, unknown>): string {
    const trackingUrl = data.tracking_url as string || "#"
    const status = data.status as string || "In Transit"
    const statusDetail = data.status_detail as string || ""
    const customerName = data.customer_name as string || "Customer"

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:#7B2D3B;padding:30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">Shipping Update</h1>
      </div>
      <div style="padding:30px;">
        <p style="color:#333;font-size:16px;line-height:1.6;">Hi ${customerName},</p>
        <div style="background:#f0f7ff;border-left:4px solid #2563eb;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
          <p style="margin:0 0 4px;color:#1e40af;font-size:16px;font-weight:600;">${status}</p>
          ${statusDetail ? `<p style="margin:0;color:#555;font-size:14px;">${statusDetail}</p>` : ""}
        </div>
        <div style="text-align:center;margin:30px 0;">
          <a href="${trackingUrl}" style="display:inline-block;background:#7B2D3B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
            Track Your Package
          </a>
        </div>
      </div>
      <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;">Winepopper USA &mdash; Pop your wine like champagne.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  private buildDeliveredEmail(data: Record<string, unknown>): string {
    const customerName = data.customer_name as string || "Customer"

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <div style="background:#16a34a;padding:30px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">Your Order Has Been Delivered!</h1>
      </div>
      <div style="padding:30px;text-align:center;">
        <p style="color:#333;font-size:16px;line-height:1.6;">Hi ${customerName},</p>
        <p style="color:#555;font-size:15px;line-height:1.6;">
          Your Winepopper has arrived! We hope you enjoy it.
        </p>
        <p style="color:#555;font-size:15px;line-height:1.6;">
          Pop your wine like champagne and share the experience with friends!
        </p>
        <div style="margin:30px 0;">
          <a href="https://winepopperusa.com/products" style="display:inline-block;background:#7B2D3B;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
            Shop More
          </a>
        </div>
      </div>
      <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;">Winepopper USA &mdash; Pop your wine like champagne.</p>
      </div>
    </div>
  </div>
</body>
</html>`
  }

  private buildGenericEmail(data: Record<string, unknown>): string {
    const message = data.message as string || "You have an update from Winepopper USA."
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:12px;padding:30px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <p style="color:#333;font-size:15px;line-height:1.6;">${message}</p>
    </div>
  </div>
</body>
</html>`
  }
}

export default ResendNotificationService
