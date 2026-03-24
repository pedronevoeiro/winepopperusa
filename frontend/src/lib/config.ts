export const siteConfig = {
  name: "Winepopper USA",
  tagline: "Pop your wine like champagne.",
  description:
    "Automatic gas corkscrew that opens wine in under 3 seconds. Preserves aroma, never breaks corks. Shop Winepopper corkscrews and refill capsules.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://winepopperusa.com",
  ogImage: "/images/og-image.jpg",
  social: {
    instagram: "https://instagram.com/winepopperusa",
    youtube: "https://youtube.com/@winepopperusa",
  },
  contact: {
    email: "contact@winepopperusa.com",
    phone: "+1 (561) 315-7443",
    address: "1720 NE Miami Gardens Drive, North Miami Beach, FL 33179",
  },
  shipping: {
    standard: { price: 599, label: "Standard Shipping (5-7 days)", days: "5-7" },
    express: { price: 1299, label: "Express Shipping (2-3 days)", days: "2-3" },
    freeThreshold: 5000, // Free shipping on orders over $50
  },
} as const

export const medusaConfig = {
  backendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
} as const

export const analyticsConfig = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
} as const

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
} as const
