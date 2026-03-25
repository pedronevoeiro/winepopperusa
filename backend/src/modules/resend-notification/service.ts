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

// ── Hosted logo URLs (PNG for Gmail compatibility) ────────
const LOGO_WHITE_URL = "https://winepopperusa.com/images/logo-winepopper-white.png"
const LOGO_DARK_URL = "https://winepopperusa.com/images/logo-winepopper-dark.png"

// ── Font stack with Urbanist ──────────────────────────────
const FONT_FAMILY = "'Urbanist','Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif"

// ── Google Fonts import for Urbanist ──────────────────────
const FONT_IMPORT = `<style>
@import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap');
</style>`

// ── Shared email wrapper ──────────────────────────────────
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  ${FONT_IMPORT}
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f3f3f3;font-family:${FONT_FAMILY};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;"> </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f3;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER with logo -->
        <tr><td style="background:#7B2D3B;padding:28px 32px;text-align:center;border-radius:12px 12px 0 0;">
          <a href="https://winepopperusa.com" target="_blank">
            <img src="${LOGO_WHITE_URL}" alt="winepopper" width="180" height="34" style="display:inline-block;border:0;outline:none;text-decoration:none;" />
          </a>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:36px 32px;font-family:${FONT_FAMILY};">
          ${content}
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#fafafa;padding:24px 32px;border-radius:0 0 12px 12px;border-top:1px solid #eee;text-align:center;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:12px;">
              <a href="https://winepopperusa.com" target="_blank">
                <img src="${LOGO_DARK_URL}" alt="winepopper" width="140" height="26" style="display:inline-block;border:0;outline:none;text-decoration:none;" />
              </a>
            </td></tr>
            <tr><td align="center" style="font-family:${FONT_FAMILY};">
              <p style="margin:0 0 8px;color:#999;font-size:12px;line-height:1.5;">
                Winepopper USA &mdash; Pop your wine like champagne.
              </p>
              <p style="margin:0 0 4px;color:#bbb;font-size:11px;">
                1720 NE Miami Gardens Drive, North Miami Beach, FL 33179
              </p>
              <p style="margin:0;color:#bbb;font-size:11px;">
                <a href="https://winepopperusa.com" style="color:#7B2D3B;text-decoration:none;">winepopperusa.com</a>
                &nbsp;&bull;&nbsp;
                <a href="mailto:contact@winepopperusa.com" style="color:#7B2D3B;text-decoration:none;">contact@winepopperusa.com</a>
              </p>
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── CTA button helper ─────────────────────────────────────
function ctaButton(text: string, url: string, color = "#7B2D3B"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
    <tr><td align="center" style="background:${color};border-radius:8px;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;font-family:${FONT_FAMILY};text-decoration:none;letter-spacing:0.3px;">
        ${text}
      </a>
    </td></tr>
  </table>`
}

// ── Info box helper ───────────────────────────────────────
function infoBox(label: string, lines: string[]): string {
  return `<div style="background:#f8f8f8;border-radius:8px;padding:20px;margin:20px 0;">
    <p style="margin:0 0 10px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;font-family:${FONT_FAMILY};">${label}</p>
    ${lines.map((l) => `<p style="margin:0 0 4px;color:#333;font-size:14px;line-height:1.5;font-family:${FONT_FAMILY};">${l}</p>`).join("")}
  </div>`
}

// ── Divider ──────────────────────────────────────────────
const DIVIDER = `<hr style="border:none;border-top:1px solid #eee;margin:28px 0;">`

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
    const d = data || {}

    const templates: Record<string, { subject: string; html: string }> = {
      "order-pending-payment": {
        subject: `Order #${d.order_id || ""} — Awaiting Payment`,
        html: this.buildPendingPayment(d),
      },
      "order-confirmed": {
        subject: `Order #${d.order_id || ""} — Confirmed!`,
        html: this.buildOrderConfirmed(d),
      },
      "order-payment-failed": {
        subject: `Order #${d.order_id || ""} — Payment Issue`,
        html: this.buildPaymentFailed(d),
      },
      "order-processing": {
        subject: `Order #${d.order_id || ""} — Being Prepared`,
        html: this.buildOrderProcessing(d),
      },
      "order-shipment-created": {
        subject: `Order #${d.order_id || ""} — Shipped!`,
        html: this.buildShipmentCreated(d),
      },
      "order-tracking-update": {
        subject: `Shipping Update — Order #${d.order_id || ""}`,
        html: this.buildTrackingUpdate(d),
      },
      "order-delivered": {
        subject: `Delivered! Order #${d.order_id || ""}`,
        html: this.buildDelivered(d),
      },
      "order-refunded": {
        subject: `Refund Processed — Order #${d.order_id || ""}`,
        html: this.buildRefunded(d),
      },
    }

    const tpl = templates[template]
    const subject = tpl?.subject || `Update from Winepopper USA`
    const html = tpl?.html || this.buildGeneric(d)

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

  private buildPendingPayment(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const total = d.total as string || ""
    const items = d.items as string || ""

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Awaiting Payment</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        We received your order and are waiting for your payment to be confirmed. Once confirmed, we'll start preparing your Winepopper for shipment.
      </p>
      ${infoBox("Order Summary", [
        items ? `<strong>Items:</strong> ${items}` : "",
        total ? `<strong>Total:</strong> ${total}` : "",
      ].filter(Boolean))}
      <div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;line-height:1.5;font-family:${FONT_FAMILY};">
          <strong>Payment pending.</strong> If you used a bank transfer or alternative method, it may take a few minutes to process.
        </p>
      </div>
      ${ctaButton("View My Order", "https://winepopperusa.com/tracking")}
      <p style="color:#999;font-size:13px;text-align:center;font-family:${FONT_FAMILY};">
        Having trouble? <a href="mailto:contact@winepopperusa.com" style="color:#7B2D3B;">Contact our support team</a>
      </p>
    `)
  }

  private buildOrderConfirmed(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const total = d.total as string || ""
    const items = d.items as string || ""
    const shippingAddress = d.shipping_address as string || ""

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Order Confirmed!</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        Thank you for your purchase! Your payment has been approved and your order is confirmed. We're now preparing your items for shipment.
      </p>
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#166534;font-size:14px;font-weight:600;font-family:${FONT_FAMILY};">Payment approved successfully</p>
      </div>
      ${infoBox("Order Details", [
        items ? `<strong>Items:</strong> ${items}` : "",
        total ? `<strong>Total charged:</strong> ${total}` : "",
        shippingAddress ? `<strong>Shipping to:</strong> ${shippingAddress}` : "",
      ].filter(Boolean))}
      ${DIVIDER}
      <p style="color:#555;font-size:14px;line-height:1.7;text-align:center;font-family:${FONT_FAMILY};">
        You'll receive another email with tracking information once your order ships.
      </p>
      ${ctaButton("Shop More", "https://winepopperusa.com/products")}
    `)
  }

  private buildPaymentFailed(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const reason = d.reason as string || "Your payment could not be processed."

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Payment Issue</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        Unfortunately, we were unable to process the payment for your recent order.
      </p>
      <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#991b1b;font-size:14px;line-height:1.5;font-family:${FONT_FAMILY};">
          <strong>Reason:</strong> ${reason}
        </p>
      </div>
      <p style="color:#555;font-size:14px;line-height:1.7;font-family:${FONT_FAMILY};">
        Please double-check your payment details and try again. Your cart items have been saved.
      </p>
      ${ctaButton("Try Again", "https://winepopperusa.com/checkout")}
      <p style="color:#999;font-size:13px;text-align:center;font-family:${FONT_FAMILY};">
        Need help? <a href="mailto:contact@winepopperusa.com" style="color:#7B2D3B;">Contact our support team</a>
      </p>
    `)
  }

  private buildOrderProcessing(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">We're Preparing Your Order</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        Great news! Your order is being carefully packed and prepared for shipment. We'll send you tracking information as soon as it's on its way.
      </p>
      <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#1e40af;font-size:14px;font-weight:600;font-family:${FONT_FAMILY};">Your order is being packed</p>
        <p style="margin:4px 0 0;color:#555;font-size:13px;font-family:${FONT_FAMILY};">Estimated ship date: 1&ndash;2 business days</p>
      </div>
      ${DIVIDER}
      <p style="color:#555;font-size:14px;line-height:1.7;text-align:center;font-family:${FONT_FAMILY};">
        While you wait, check out some tips on using your Winepopper:
      </p>
      ${ctaButton("How It Works", "https://winepopperusa.com/how-it-works")}
    `)
  }

  private buildShipmentCreated(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const trackingCode = d.tracking_code as string || ""
    const trackingUrl = d.tracking_url as string || "#"
    const carrier = d.carrier as string || "USPS"

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Your Order Has Shipped!</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        Your Winepopper is on its way! You can track your package using the link below.
      </p>
      ${infoBox("Tracking Details", [
        `<strong>Carrier:</strong> ${carrier}`,
        `<strong>Tracking Number:</strong> ${trackingCode}`,
      ])}
      ${ctaButton("Track Your Package", trackingUrl)}
      <p style="color:#999;font-size:12px;line-height:1.5;text-align:center;font-family:${FONT_FAMILY};">
        Or copy this link: <a href="${trackingUrl}" style="color:#7B2D3B;word-break:break-all;">${trackingUrl}</a>
      </p>
    `)
  }

  private buildTrackingUpdate(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const status = d.status as string || "In Transit"
    const statusDetail = d.status_detail as string || ""
    const trackingUrl = d.tracking_url as string || "#"

    const statusColors: Record<string, { bg: string; border: string; text: string }> = {
      "In Transit": { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
      "Out for Delivery": { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
      default: { bg: "#f8f8f8", border: "#999", text: "#333" },
    }
    const colors = statusColors[status] || statusColors.default

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Shipping Update</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        Here's the latest on your Winepopper shipment:
      </p>
      <div style="background:${colors.bg};border-left:4px solid ${colors.border};padding:14px 16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0 0 4px;color:${colors.text};font-size:16px;font-weight:600;font-family:${FONT_FAMILY};">${status}</p>
        ${statusDetail ? `<p style="margin:0;color:#555;font-size:13px;font-family:${FONT_FAMILY};">${statusDetail}</p>` : ""}
      </div>
      ${ctaButton("Track Your Package", trackingUrl)}
    `)
  }

  private buildDelivered(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""

    return emailWrapper(`
      <div style="text-align:center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
          <tr><td style="background:#f0fdf4;border-radius:50%;padding:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr><td style="width:40px;height:40px;border-radius:50%;background:#22c55e;text-align:center;vertical-align:middle;color:#fff;font-size:24px;line-height:40px;">
                &#10003;
              </td></tr>
            </table>
          </td></tr>
        </table>
      </div>
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;text-align:center;font-family:${FONT_FAMILY};">Your Order Has Been Delivered!</h1>
      <p style="margin:0 0 24px;color:#888;font-size:13px;text-align:center;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;text-align:center;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;text-align:center;font-family:${FONT_FAMILY};">
        Your Winepopper has arrived! We hope you love it.<br>
        Pop your wine like champagne and share the experience with friends!
      </p>
      ${DIVIDER}
      <p style="color:#555;font-size:14px;line-height:1.7;text-align:center;font-family:${FONT_FAMILY};">
        Enjoying your Winepopper? Consider leaving a review or sharing with a friend!
      </p>
      ${ctaButton("Shop More", "https://winepopperusa.com/products")}
      <p style="color:#999;font-size:13px;text-align:center;font-family:${FONT_FAMILY};">
        Questions about your order? <a href="mailto:contact@winepopperusa.com" style="color:#7B2D3B;">We're here to help</a>
      </p>
    `)
  }

  private buildRefunded(d: Record<string, unknown>): string {
    const name = d.customer_name as string || "there"
    const orderId = d.order_id as string || ""
    const amount = d.amount as string || ""
    const reason = d.reason as string || ""

    return emailWrapper(`
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;font-family:${FONT_FAMILY};">Refund Processed</h1>
      <p style="margin:0 0 20px;color:#888;font-size:13px;font-family:${FONT_FAMILY};">Order #${orderId}</p>
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">Hi ${name},</p>
      <p style="color:#555;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">
        We've processed a refund for your order. The amount should appear on your original payment method within 5&ndash;10 business days.
      </p>
      ${infoBox("Refund Details", [
        amount ? `<strong>Amount refunded:</strong> ${amount}` : "",
        reason ? `<strong>Reason:</strong> ${reason}` : "",
        `<strong>Order:</strong> #${orderId}`,
      ].filter(Boolean))}
      <p style="color:#555;font-size:14px;line-height:1.7;font-family:${FONT_FAMILY};">
        We're sorry to see this order returned. If there was an issue with the product, we'd love to hear your feedback so we can improve.
      </p>
      ${ctaButton("Contact Us", "mailto:contact@winepopperusa.com")}
      <p style="color:#999;font-size:13px;text-align:center;font-family:${FONT_FAMILY};">
        We hope to see you again soon at <a href="https://winepopperusa.com" style="color:#7B2D3B;">winepopperusa.com</a>
      </p>
    `)
  }

  private buildGeneric(d: Record<string, unknown>): string {
    const message = d.message as string || "You have an update from Winepopper USA."
    return emailWrapper(`
      <p style="color:#333;font-size:15px;line-height:1.7;font-family:${FONT_FAMILY};">${message}</p>
    `)
  }
}

export default ResendNotificationService
