import { medusaConfig } from "./config"
import {
  products as staticProducts,
  type Product,
  type ProductVariant,
  type ProductImage,
} from "./products-data"

/**
 * Fetch products from the Medusa v2 Store API.
 * Falls back to static data when the backend is unavailable.
 *
 * Static data is used to enrich the API response with frontend-specific
 * fields that Medusa doesn't store (shortDescription, features, specs,
 * kitContents, local optimized images).
 */

const MEDUSA_URL = medusaConfig.backendUrl
const PUBLISHABLE_KEY = medusaConfig.publishableKey

// Static enrichment data keyed by handle
const staticByHandle = new Map(staticProducts.map((p) => [p.handle, p]))

function headers(): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" }
  if (PUBLISHABLE_KEY) {
    h["x-publishable-api-key"] = PUBLISHABLE_KEY
  }
  return h
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVariant(v: any, staticVariants: ProductVariant[]): ProductVariant {
  const staticMatch = staticVariants.find((sv) => sv.sku === v.sku)
  const price =
    v.prices?.[0]?.amount ??
    v.calculated_price?.calculated_amount ??
    staticMatch?.price ??
    0
  const compareAtPrice =
    v.metadata?.compare_at_price ??
    v.calculated_price?.original_amount ??
    staticMatch?.compareAtPrice

  return {
    id: v.id,
    title: v.title ?? "Default",
    sku: v.sku ?? staticMatch?.sku ?? "",
    price,
    ...(compareAtPrice && compareAtPrice > price ? { compareAtPrice } : {}),
    weight: v.weight ?? staticMatch?.weight,
    available: v.inventory_quantity == null || v.inventory_quantity > 0,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  const staticProduct = staticByHandle.get(p.handle)
  const staticVariants = staticProduct?.variants ?? []

  // Prefer local optimized images over Medusa/CDN images
  const images: ProductImage[] =
    staticProduct?.images ??
    (p.images ?? []).map((img: { url: string }) => ({
      url: img.url,
      alt: p.title,
    }))

  // Strip HTML tags for plain-text description
  const plainDescription = (p.description ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: staticProduct?.description ?? plainDescription,
    shortDescription:
      staticProduct?.shortDescription ?? plainDescription.slice(0, 120),
    variants: (p.variants ?? []).map((v: unknown) =>
      mapVariant(v, staticVariants)
    ),
    images,
    features: staticProduct?.features,
    specs: staticProduct?.specs,
    kitContents: staticProduct?.kitContents,
  }
}

/**
 * Fetch all published products from the Medusa API.
 * Falls back to static data on failure.
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?fields=*variants,*variants.prices,+variants.inventory_quantity&limit=50`,
      {
        headers: headers(),
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) throw new Error(`Medusa API ${res.status}`)

    const data = await res.json()
    const mapped = (data.products ?? []).map(mapProduct)

    // Return in the same order as static data for consistency
    if (mapped.length > 0) return mapped
  } catch {
    console.warn("[medusa-products] API unavailable, using static fallback")
  }

  return staticProducts
}

/**
 * Fetch a single product by handle from the Medusa API.
 * Falls back to static data on failure.
 */
export async function fetchProductByHandle(
  handle: string
): Promise<Product | undefined> {
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?handle=${handle}&fields=*variants,*variants.prices,+variants.inventory_quantity`,
      {
        headers: headers(),
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) throw new Error(`Medusa API ${res.status}`)

    const data = await res.json()
    const products = data.products ?? []

    if (products.length > 0) {
      return mapProduct(products[0])
    }
  } catch {
    console.warn(
      `[medusa-products] API unavailable for handle "${handle}", using static fallback`
    )
  }

  return staticByHandle.get(handle)
}

/**
 * Get the featured product (Winepopper Aluminum).
 */
export async function fetchFeaturedProduct(): Promise<Product> {
  const product = await fetchProductByHandle("winepopper-aluminum")
  return product ?? staticProducts[0]
}
