import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { products, getProductByHandle } from "@/lib/products-data"
import { getProductSchema, getBreadcrumbSchema } from "@/lib/structured-data"
import { siteConfig } from "@/lib/config"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductInfo from "@/modules/products/components/product-info"

interface PageProps {
  params: Promise<{ handle: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = getProductByHandle(handle)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} | Winepopper USA`,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
      type: "website",
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params
  const product = getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const breadcrumbs = [
    { name: "Home", url: siteConfig.url },
    { name: "Products", url: `${siteConfig.url}/products` },
    { name: product.title, url: `${siteConfig.url}/products/${handle}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductSchema(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema(breadcrumbs)) }}
      />
      <div className="container-main py-10 md:py-16">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm font-body text-brand-gray-500">
            <li>
              <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link href="/products" className="hover:text-brand-red transition-colors">Products</Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="text-brand-black font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <ImageGallery
            images={product.images}
            videoUrl={product.handle === "winepopper-aluminum" ? "/images/3s.mp4" : undefined}
          />
          <ProductInfo product={product} />
        </div>
      </div>
    </>
  )
}
