/**
 * Send all transactional email templates with inline logo via CID.
 * Usage: npx tsx src/scripts/send-test-emails.ts
 */
import { Resend } from "resend"

const resend = new Resend("re_CHo7MJQo_JySoHskd7q8HDUukPianfFXF")
const FROM = "Winepopper USA <orders@winepopperusa.com>"
const TO = "pedro@winepopper.com.br"

// ── Load logos as base64 for CID inline attachments ───────
// Hosted logo URLs (PNG for Gmail compatibility)
const LOGO_WHITE_URL = "https://winepopperusa.com/images/logo-winepopper-white.png"
const LOGO_DARK_URL = "https://winepopperusa.com/images/logo-winepopper-dark.png"

// ── Brand ─────────────────────────────────────────────────
const B = {
  burgundy: "#7B2D3B",
  burgundyDark: "#5C1F2C",
  gold: "#C9A96E",
  goldLight: "#F5EFE0",
  cream: "#FDF9F3",
  dark: "#1a1a1a",
  gray: "#6b7280",
  grayLight: "#f9fafb",
  white: "#ffffff",
  green: "#059669",
  greenLight: "#ecfdf5",
  blue: "#2563eb",
  blueLight: "#eff6ff",
  amber: "#d97706",
  amberLight: "#fffbeb",
  red: "#dc2626",
  redLight: "#fef2f2",
}
const F = "'Urbanist','Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"

// Logo tags using hosted PNGs
const LOGO_WHITE = `<img src="${LOGO_WHITE_URL}" alt="winepopper" width="160" height="30" style="display:block;margin:0 auto;" />`
const LOGO_DARK = `<img src="${LOGO_DARK_URL}" alt="winepopper" width="130" height="24" style="display:block;margin:0 auto;" />`

// ── Helpers ───────────────────────────────────────────────
function wrap(body: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800&display=swap');
    * { font-family: ${F}; }
  </style>
</head>
<body style="margin:0;padding:0;background:${B.cream};font-family:${F};-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.cream};">
  <tr><td align="center" style="padding:40px 16px 32px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <!-- TOP LOGO -->
      <tr><td style="padding:0 0 24px;text-align:center;">
        <a href="https://winepopperusa.com" target="_blank" style="text-decoration:none;">${LOGO_DARK}</a>
      </td></tr>
      <!-- CARD -->
      <tr><td style="background:${B.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(123,45,59,0.08);">
        ${body}
      </td></tr>
      <!-- FOOTER -->
      <tr><td style="padding:32px 24px 0;text-align:center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
          <tr>
            <td style="padding:0 8px;"><a href="https://instagram.com/winepopperusa" style="color:${B.gray};font-size:12px;text-decoration:none;font-family:${F};">Instagram</a></td>
            <td style="color:#ddd;">|</td>
            <td style="padding:0 8px;"><a href="https://youtube.com/@winepopperusa" style="color:${B.gray};font-size:12px;text-decoration:none;font-family:${F};">YouTube</a></td>
            <td style="color:#ddd;">|</td>
            <td style="padding:0 8px;"><a href="https://winepopperusa.com" style="color:${B.gray};font-size:12px;text-decoration:none;font-family:${F};">Shop</a></td>
          </tr>
        </table>
        <p style="margin:0 0 6px;color:#bbb;font-size:11px;font-family:${F};">Winepopper USA &bull; 1720 NE Miami Gardens Dr, North Miami Beach, FL 33179</p>
        <p style="margin:0;color:#ccc;font-size:10px;font-family:${F};">You received this email because you placed an order at winepopperusa.com</p>
      </td></tr>
    </table>
  </td></tr>
  </table>
</body>
</html>`
}

function hero(bg: string, title: string, subtitle = ""): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="background:${bg};padding:52px 40px 48px;text-align:center;border-bottom:3px solid ${B.gold};">
      <h1 style="margin:0;color:${B.white};font-size:28px;font-weight:800;font-family:${F};letter-spacing:-0.5px;line-height:1.2;">${title}</h1>
      ${subtitle ? `<p style="margin:14px 0 0;color:rgba(255,255,255,0.7);font-size:14px;font-weight:400;font-family:${F};letter-spacing:0.2px;">${subtitle}</p>` : ""}
    </td></tr>
  </table>`
}

function sect(c: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:36px 44px;font-family:${F};">${c}</td></tr></table>`
}

function btn(text: string, url: string, color = B.burgundy): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr><td align="center" style="background:${color};border-radius:50px;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 44px;color:#fff;font-size:13px;font-weight:700;font-family:${F};text-decoration:none;letter-spacing:1px;text-transform:uppercase;">${text}</a>
    </td></tr>
  </table>`
}

function goldLine(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:4px 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:${B.goldLight};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr></table>`
}

function badge(id: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
    <tr><td style="background:${B.goldLight};border:1px solid ${B.gold};border-radius:50px;padding:7px 22px;">
      <span style="color:${B.burgundy};font-size:11px;font-weight:700;font-family:${F};letter-spacing:1.5px;text-transform:uppercase;">Order #${id}</span>
    </td></tr>
  </table>`
}

function steps(list: { label: string; active: boolean; done: boolean }[]): string {
  const cells = list.map((s, i) => {
    const bg = s.done ? B.green : s.active ? B.burgundy : "#e5e7eb"
    const tc = s.done || s.active ? B.dark : "#c0c0c0"
    const fw = s.active ? "700" : "500"
    const connector = i < list.length - 1
      ? `<td style="width:20%;vertical-align:middle;padding:0 0 18px;"><div style="height:2px;background:${s.done ? B.green : '#e5e7eb'};"></div></td>`
      : ""
    return `<td align="center" style="width:15%;">
      <div style="width:32px;height:32px;border-radius:50%;background:${bg};margin:0 auto 10px;line-height:32px;text-align:center;">
        ${s.done ? `<span style="color:#fff;font-size:15px;">&#10003;</span>` : s.active ? `<span style="color:#fff;font-size:10px;font-weight:900;">&#9679;</span>` : `<span style="color:#fff;font-size:10px;">&#9679;</span>`}
      </div>
      <span style="color:${tc};font-size:10px;font-weight:${fw};font-family:${F};letter-spacing:0.3px;">${s.label}</span>
    </td>${connector}`
  }).join("")
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 32px;"><tr>${cells}</tr></table>`
}

function info(label: string, lines: string[], accent = B.burgundy): string {
  return `<div style="background:${B.cream};border-radius:12px;padding:22px 24px;margin:24px 0;border:1px solid #f0ebe3;">
    <p style="margin:0 0 12px;color:${accent};font-size:10px;text-transform:uppercase;letter-spacing:2px;font-weight:800;font-family:${F};">${label}</p>
    ${lines.map((l) => `<p style="margin:0 0 4px;color:${B.dark};font-size:13px;line-height:1.7;font-family:${F};">${l}</p>`).join("")}
  </div>`
}

function alert(text: string, type: "warn" | "err" | "ok" | "info"): string {
  const s = { warn: { bg: "#fffdf5", bd: B.gold, i: "!", c: "#78591a" }, err: { bg: "#fdf5f5", bd: B.red, i: "&#10007;", c: "#991b1b" }, ok: { bg: "#f5fdf8", bd: B.green, i: "&#10003;", c: "#065f46" }, info: { bg: "#f5f8fd", bd: B.blue, i: "i", c: "#1e40af" } }[type]
  return `<div style="background:${s.bg};border-radius:12px;padding:18px 22px;margin:24px 0;border:1px solid ${s.bd}20;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="32" valign="top" style="padding-right:14px;">
        <div style="width:26px;height:26px;border-radius:50%;background:${s.bd};text-align:center;line-height:26px;"><span style="color:#fff;font-size:12px;font-weight:700;">${s.i}</span></div>
      </td>
      <td valign="middle"><p style="margin:0;color:${s.c};font-size:13px;line-height:1.6;font-family:${F};">${text}</p></td>
    </tr></table>
  </div>`
}

function p(t: string, o: { center?: boolean; small?: boolean; muted?: boolean } = {}): string {
  return `<p style="margin:0 0 16px;color:${o.muted ? "#9ca3af" : "#374151"};font-size:${o.small ? "13px" : "15px"};line-height:1.8;font-family:${F};text-align:${o.center ? "center" : "left"};font-weight:400;">${t}</p>`
}

// ══════════════════════════════════════════════════════════
const emails = [
  // ── 1. AWAITING PAYMENT ─────────────────────────────
  {
    subject: "[TEST 1/8] Your Winepopper is reserved — complete your payment",
    html: wrap(
      hero(B.burgundy, "Awaiting Payment", "Your order is reserved and waiting for payment confirmation") +
      sect(badge("WP-1042") + steps([
        { label: "Order Placed", active: false, done: true },
        { label: "Payment", active: true, done: false },
        { label: "Processing", active: false, done: false },
        { label: "Shipped", active: false, done: false },
      ]) + p("Hi Pedro,") + p("Your Winepopper is reserved and ready to go. Once your payment clears, we'll start preparing it for shipment.") +
      info("Order Summary", [
        "<strong>Winepopper Aluminum</strong> &times; 1 &mdash; $34.90",
        "<strong>Refill Gas Capsules (4-Pack)</strong> &times; 1 &mdash; $9.90",
        '<hr style="border:none;border-top:1px solid #e5e7eb;margin:8px 0;">',
        "<strong>Total: $44.80</strong>",
      ]) + alert("<strong>Payment pending.</strong> If you used a bank transfer or alternative method, it may take a few minutes to process.", "warn")) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("View My Order", "https://winepopperusa.com/tracking")}<p style="margin:16px 0 0;color:${B.gray};font-size:12px;font-family:${F};">Having trouble? <a href="mailto:contact@winepopperusa.com" style="color:${B.burgundy};font-weight:600;">Contact us</a></p></div>`),
      "Your Winepopper is reserved — complete your payment to get started."
    ),
  },
  // ── 2. ORDER CONFIRMED ──────────────────────────────
  {
    subject: "[TEST 2/8] You're all set — your Winepopper is on its way soon",
    html: wrap(
      hero(B.green, "You're All Set!", "Payment confirmed — your Winepopper journey begins") +
      sect(badge("WP-1042") + steps([
        { label: "Order Placed", active: false, done: true },
        { label: "Payment", active: false, done: true },
        { label: "Processing", active: true, done: false },
        { label: "Shipped", active: false, done: false },
      ]) + p("Hi Pedro,") + p("Your payment went through and your order is locked in. We're about to start preparing your Winepopper — you'll be popping corks in no time.") +
      alert("Payment of <strong>$44.80</strong> confirmed.", "ok") +
      info("Order Details", [
        "<strong>Winepopper Aluminum</strong> &times; 1 &mdash; $34.90",
        "<strong>Refill Gas Capsules (4-Pack)</strong> &times; 1 &mdash; $9.90",
        '<hr style="border:none;border-top:1px solid #e5e7eb;margin:8px 0;">',
        "<strong>Total charged:</strong> $44.80",
        "<strong>Shipping to:</strong> 350 5th Ave, New York, NY 10118",
      ]) + p("Every order is backed by our <strong>30-day satisfaction guarantee</strong>. No questions asked.", { small: true, muted: true })) +
      goldLine() +
      sect(`<div style="text-align:center;">${p("We'll send you tracking info as soon as your order ships.", { center: true, small: true, muted: true })}${btn("Browse More", "https://winepopperusa.com/products")}</div>`),
      "Payment confirmed! Your Winepopper is being prepared."
    ),
  },
  // ── 3. PAYMENT FAILED ──────────────────────────────
  {
    subject: "[TEST 3/8] Quick fix needed — your Winepopper is waiting",
    html: wrap(
      hero(B.burgundyDark, "Payment Didn't Go Through", "No worries — your cart is saved and ready") +
      sect(badge("WP-1042") + p("Hi Pedro,") + p("Your payment didn't go through, but your Winepopper is still waiting for you. Here's how to fix it:") +
      alert("<strong>Card declined</strong> — insufficient funds.", "err") +
      info("Quick Fixes", ["1. Double-check your card number and expiration", "2. Try a different card or payment method", "3. Contact your bank — they may have blocked the charge"], B.red)) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("Complete My Order", "https://winepopperusa.com/checkout")}<p style="margin:16px 0 0;color:${B.gray};font-size:12px;font-family:${F};">Need a hand? <a href="mailto:contact@winepopperusa.com" style="color:${B.burgundy};font-weight:600;">We're here to help</a></p></div>`),
      "Your payment didn't go through — your cart is saved, just try again."
    ),
  },
  // ── 4. PROCESSING ──────────────────────────────────
  {
    subject: "[TEST 4/8] Your Winepopper is being packed with care",
    html: wrap(
      hero(B.burgundy, "Packing Your Order", "Almost ready — we're inspecting everything before it ships") +
      sect(badge("WP-1042") + steps([
        { label: "Order Placed", active: false, done: true },
        { label: "Payment", active: false, done: true },
        { label: "Processing", active: true, done: false },
        { label: "Shipped", active: false, done: false },
      ]) + p("Hi Pedro,") + p("Your Winepopper is being packed right now. We test every unit before shipping to make sure it works perfectly from your very first pour.") +
      alert("Estimated ship date: <strong>1&ndash;2 business days</strong>", "info")) +
      goldLine() +
      sect(`<div style="text-align:center;">${p("First time using a gas corkscrew? Watch a quick demo:", { center: true, small: true, muted: true })}${btn("See How It Works", "https://winepopperusa.com/how-it-works")}</div>`),
      "Your Winepopper is being packed and tested — ships in 1–2 days."
    ),
  },
  // ── 5. SHIPPED ─────────────────────────────────────
  {
    subject: "[TEST 5/8] It's on its way! Track your Winepopper",
    html: wrap(
      hero(B.burgundy, "On Its Way!", "Your Winepopper has left the building") +
      sect(badge("WP-1042") + steps([
        { label: "Order Placed", active: false, done: true },
        { label: "Payment", active: false, done: true },
        { label: "Processing", active: false, done: true },
        { label: "Shipped", active: true, done: false },
      ]) + p("Hi Pedro,") + p("Your Winepopper just shipped! Track it in real-time below — and start picking which bottle you'll open first.") +
      info("Tracking Information", [
        "<strong>Carrier:</strong> USPS Priority Mail",
        "<strong>Tracking:</strong> 9400111899223847583290",
        "<strong>Estimated delivery:</strong> Mar 28 &ndash; Mar 31",
      ], B.green)) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("Track My Package", "https://winepopperusa.com/tracking", B.green)}<p style="margin:16px 0 0;color:${B.gray};font-size:11px;font-family:${F};"><a href="https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223847583290" style="color:${B.gray};">Track on USPS.com</a></p></div>`),
      "Your Winepopper just shipped — start picking your first bottle!"
    ),
  },
  // ── 6. OUT FOR DELIVERY ────────────────────────────
  {
    subject: "[TEST 6/8] Arriving today — your Winepopper is almost there",
    html: wrap(
      hero(B.amber, "Arriving Today!", "Your Winepopper is on the truck and headed your way") +
      sect(badge("WP-1042") + steps([
        { label: "Shipped", active: false, done: true },
        { label: "In Transit", active: false, done: true },
        { label: "Out for Delivery", active: true, done: false },
        { label: "Delivered", active: false, done: false },
      ]) + p("Hi Pedro,") + p("Your Winepopper is out for delivery right now. Time to pick a bottle — tonight, you pop your wine like champagne.") +
      alert("Your package is on the delivery vehicle and will arrive today.", "info")) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("Track Live", "https://winepopperusa.com/tracking", B.amber)}</div>`),
      "Your Winepopper is out for delivery — arriving today!"
    ),
  },
  // ── 7. DELIVERED ───────────────────────────────────
  {
    subject: "[TEST 7/8] Your Winepopper has arrived — time to pop!",
    html: wrap(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="background:${B.green};padding:52px 40px 48px;text-align:center;border-bottom:3px solid ${B.gold};">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
            <tr><td style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);text-align:center;vertical-align:middle;">
              <span style="color:#fff;font-size:28px;line-height:56px;">&#10003;</span>
            </td></tr>
          </table>
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;font-family:${F};letter-spacing:-0.5px;">Time to Pop!</h1>
          <p style="margin:14px 0 0;color:rgba(255,255,255,0.7);font-size:14px;font-family:${F};">Your Winepopper has arrived safely</p>
        </td></tr>
      </table>` +
      sect(badge("WP-1042") + steps([
        { label: "Shipped", active: false, done: true },
        { label: "In Transit", active: false, done: true },
        { label: "Out for Delivery", active: false, done: true },
        { label: "Delivered", active: false, done: true },
      ]) + p("Hi Pedro,") + p("Your Winepopper just arrived! Grab your favorite bottle, insert the needle, press the button, and watch the cork glide out in under 3 seconds.") + p("Welcome to the effortless pour.") +
      `<div style="background:${B.goldLight};border-radius:12px;padding:24px;margin:24px 0;text-align:center;border:1px solid #e8dcc8;">
        <p style="margin:0 0 6px;color:${B.burgundy};font-size:18px;font-weight:700;font-family:${F};">Love the experience?</p>
        <p style="margin:0;color:${B.gray};font-size:13px;font-family:${F};">Your friends get 10% off with code <strong style="color:${B.burgundy};">FRIEND10</strong> — and you'll earn credit toward your next order.</p>
      </div>`) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("Shop More", "https://winepopperusa.com/products")}<p style="margin:16px 0 0;color:${B.gray};font-size:12px;font-family:${F};">Questions? <a href="mailto:contact@winepopperusa.com" style="color:${B.burgundy};font-weight:600;">We're here to help</a></p></div>`),
      "Your Winepopper just arrived — grab a bottle and pop your first cork!"
    ),
  },
  // ── 8. REFUNDED ────────────────────────────────────
  {
    subject: "[TEST 8/8] Your refund is on its way",
    html: wrap(
      hero(B.burgundyDark, "Refund Confirmed", "We've processed your refund") +
      sect(badge("WP-1042") + p("Hi Pedro,") + p("Your refund of <strong>$44.80</strong> has been processed. You'll see it back on your original payment method within 5&ndash;10 business days.") +
      info("Refund Details", [
        "<strong>Amount:</strong> $44.80",
        "<strong>Method:</strong> Original payment method",
        "<strong>Timeline:</strong> 5&ndash;10 business days",
      ]) + p("The door is always open. If you'd like to give Winepopper another try, use code <strong style=\"color:" + B.burgundy + ";\">WELCOMEBACK</strong> for 15% off your next order.")) +
      goldLine() +
      sect(`<div style="text-align:center;">${btn("Share Feedback", "mailto:contact@winepopperusa.com")}<p style="margin:16px 0 0;color:${B.gray};font-size:12px;font-family:${F};">We'd love to hear how we can improve. <a href="mailto:contact@winepopperusa.com" style="color:${B.burgundy};font-weight:600;">Reply anytime</a></p></div>`),
      "Your refund of $44.80 has been processed."
    ),
  },
]

async function main() {
  console.log(`\nSending ${emails.length} emails to ${TO}...\n`)
  for (let i = 0; i < emails.length; i++) {
    const e = emails[i]
    try {
      const result = await resend.emails.send({
        from: FROM,
        to: TO,
        subject: e.subject,
        html: e.html,
      })
      console.log(`  ✓ ${i + 1}/${emails.length} - ${e.subject} (id: ${result.data?.id})`)
    } catch (error) {
      console.error(`  ✗ ${i + 1}/${emails.length}: ${(error as Error).message}`)
    }
    if (i < emails.length - 1) await new Promise((r) => setTimeout(r, 1200))
  }
  console.log("\nDone!\n")
}

main().catch(console.error)
