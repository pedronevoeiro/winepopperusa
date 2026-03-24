/**
 * Static product data — used as fallback when Medusa backend is unavailable.
 * In production, this data comes from the Medusa API.
 */

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number // cents
  compareAtPrice?: number // cents
  weight?: number
  available: boolean
}

export interface Product {
  id: string
  title: string
  handle: string
  description: string
  shortDescription: string
  variants: ProductVariant[]
  images: ProductImage[]
  features?: string[]
  specs?: Record<string, string>
  kitContents?: string[]
}

export const products: Product[] = [
  {
    id: "winepopper-aluminum",
    title: "Winepopper Aluminum",
    handle: "winepopper-aluminum",
    shortDescription: "Premium aluminum & steel build — 2 cartridges included (~60 pops)",
    description: `Experience effortless wine opening with the Winepopper Aluminum. Using advanced pneumatic pressure technology, this premium corkscrew extracts any cork in under 3 seconds — without pulling, twisting, or breaking. The inert gas preserves the wine's natural properties, aroma, and flavor.`,
    variants: [
      {
        id: "var-aluminum-default",
        title: "Default",
        sku: "FWPPE001",
        price: 3490,
        compareAtPrice: 4990,
        weight: 400,
        available: true,
      },
    ],
    images: [
      {
        url: "/images/optimized/winepopper-fotos-ok-01.webp",
        alt: "Winepopper Aluminum - Premium packaging box",
      },
      {
        url: "/images/optimized/winepopper-fotos-ok-02.webp",
        alt: "Winepopper Aluminum - Complete kit contents",
      },
      {
        url: "/images/optimized/DSC04582.webp",
        alt: "Winepopper Aluminum - Lifestyle shot with wine bottle and glass",
      },
      {
        url: "/images/optimized/DSC09273.webp",
        alt: "Winepopper Aluminum - Product detail shot",
      },
      {
        url: "/images/optimized/winepopper-fotos-ok-24.webp",
        alt: "Winepopper Aluminum - In use with open bottle and red wine",
      },
    ],
    features: [
      "Opens wine in under 3 seconds",
      "Preserves wine aroma and flavor",
      "Never breaks or damages corks",
      "Eco-friendly ozone-safe gas",
      "Compact and travel-ready",
      "Works with natural and synthetic corks",
    ],
    specs: {
      Material: "Stainless Steel & Aluminum",
      Dimensions: "15 × 5 × 5 cm",
      Weight: "400g",
      Color: "Black",
      Compatibility: "Natural & synthetic corks (not screw caps)",
    },
    kitContents: [
      "1× Winepopper Aluminum Corkscrew",
      "2× Gas Cartridges (~30 openings each)",
      "1× Foil Cutter",
      "1× Instruction Manual",
    ],
  },
  {
    id: "winepopper-lite",
    title: "Winepopper Lite",
    handle: "winepopper-lite",
    shortDescription: "Lightweight plastic body (150g) — perfect for travel & everyday use",
    description: `The Winepopper Lite brings the same revolutionary pneumatic technology in a lightweight, compact design. Perfect for everyday use and travel. Place over the bottle, press, and the cork glides out in seconds.`,
    variants: [
      {
        id: "var-lite-default",
        title: "Default",
        sku: "FWPPE002",
        price: 2490,
        compareAtPrice: 3490,
        weight: 150,
        available: true,
      },
    ],
    images: [
      {
        url: "/images/optimized/winepopper-fotos-ok-06.webp",
        alt: "Winepopper Lite - Complete kit vertical view",
      },
      {
        url: "/images/optimized/winepopper-fotos-ok-07.webp",
        alt: "Winepopper Lite - Kit contents detail",
      },
      {
        url: "/images/optimized/winepopper-fotos-ok-08.webp",
        alt: "Winepopper Lite - Vertical view with accessories",
      },
    ],
    features: [
      "Same pneumatic technology",
      "Ultra-lightweight at 150g",
      "Perfect for travel",
      "Preserves wine properties",
      "Easy one-button operation",
      "Compatible with refill capsules",
    ],
    specs: {
      Weight: "150g",
      Color: "Black",
      Compatibility: "Natural & synthetic corks (not screw caps)",
    },
    kitContents: [
      "1× Winepopper Lite Corkscrew",
      "1× Gas Cartridge (~30 openings)",
      "1× Foil Cutter",
      "1× Instruction Manual",
    ],
  },
  {
    id: "refill-gas-capsule",
    title: "Refill Gas Capsule",
    handle: "refill-gas-capsule",
    shortDescription: "~30 pops per capsule — fits both Aluminum & Lite models",
    description: `Compatible replacement gas capsules for all Winepopper models. Each capsule provides approximately 30 bottle openings with clean, safe, and consistent pressure. Ozone-friendly inert gas.`,
    variants: [
      {
        id: "var-refill-1",
        title: "1 Capsule",
        sku: "FWPPE-REFILL-1",
        price: 990,
        available: true,
      },
      {
        id: "var-refill-2",
        title: "2 Capsules",
        sku: "FWPPE-REFILL-2",
        price: 1580,
        available: true,
      },
      {
        id: "var-refill-4",
        title: "4 Capsules",
        sku: "FWPPE-REFILL-4",
        price: 2760,
        available: true,
      },
      {
        id: "var-refill-10",
        title: "10 Capsules",
        sku: "FWPPE-REFILL-10",
        price: 5980,
        available: true,
      },
    ],
    images: [
      {
        url: "/images/optimized/winepopper-fotos-ok-11.webp",
        alt: "Refill Gas Capsule",
      },
    ],
    features: [
      "~30 openings per capsule",
      "Ozone-friendly inert gas",
      "Compatible with all Winepopper models",
      "Easy twist-on installation",
      "Clean, safe, consistent pressure",
      "Bulk savings available",
    ],
    specs: {
      Compatibility: "Winepopper Aluminum & Lite",
      Openings: "~30 per capsule",
      Gas: "Ozone-friendly inert gas",
    },
  },
]

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle)
}

export function getFeaturedProduct(): Product {
  return products[0] // Winepopper Aluminum
}
