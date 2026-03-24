import type { Metadata } from "next"
import { Montserrat, Rubik } from "next/font/google"
import Script from "next/script"
import "@/styles/globals.css"
import { siteConfig, analyticsConfig } from "@/lib/config"
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
  title: "Winepopper USA | Open Wine with a Click",
  description:
    "Automatic gas corkscrew that opens wine in under 3 seconds. Preserves aroma, never breaks corks. Shop Winepopper corkscrews and refill capsules.",
  metadataBase: new URL(siteConfig.url),
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
      <body className="min-h-screen flex flex-col">
        {/* ── Analytics Scripts ─────────────────────────── */}
        {analyticsConfig.gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsConfig.gaMeasurementId}');
              `}
            </Script>
          </>
        )}

        {analyticsConfig.googleAdsId && (
          <Script id="gads-init" strategy="afterInteractive">
            {`
              gtag('config', '${analyticsConfig.googleAdsId}');
            `}
          </Script>
        )}

        {analyticsConfig.metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${analyticsConfig.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

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

        {/* ── Layout Shell ─────────────────────────────── */}
        <AnnouncementBar />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
