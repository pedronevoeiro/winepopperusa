import type { Metadata } from "next"
import { Montserrat, Rubik } from "next/font/google"
import Script from "next/script"
import "@/styles/globals.css"
import { siteConfig, analyticsConfig } from "@/lib/config"
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/structured-data"
import AnnouncementBar from "@/modules/layout/components/announcement-bar"
import Nav from "@/modules/layout/components/nav"
import Footer from "@/modules/layout/components/footer"
import CartDrawer from "@/modules/cart/components/cart-drawer"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Winepopper USA | Open Wine with a Click",
    template: "%s | Winepopper USA",
  },
  description:
    "Automatic gas corkscrew that opens wine in under 3 seconds. Preserves aroma, never breaks corks. Shop Winepopper corkscrews and refill capsules.",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Winepopper USA | Open Wine with a Click",
    description:
      "Automatic gas corkscrew that opens wine in under 3 seconds. Preserves aroma, never breaks corks.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Winepopper USA | Open Wine with a Click",
    description:
      "Automatic gas corkscrew that opens wine in under 3 seconds. Preserves aroma, never breaks corks.",
    images: [siteConfig.ogImage],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${rubik.variable}`}>
      <head>
        {/* ── Google Tag Manager ─────────────────────────── */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TB4KGFB9');`}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ── Google Tag Manager (noscript) ──────────────── */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TB4KGFB9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* ── Structured Data ────────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteSchema()) }}
        />

        {/* ── Hotjar ───────────────────────────────────── */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6675847,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>

        {/* ── Skip to content (accessibility) ────────── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-md focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>

        {/* ── Layout Shell ─────────────────────────────── */}
        <AnnouncementBar />
        <Nav />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
