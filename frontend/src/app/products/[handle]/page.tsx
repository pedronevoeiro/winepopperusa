import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { products, getProductByHandle } from "@/lib/products-data"
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
    return { title: "Product Not Found | Winepopper USA" }
  }

  return {
    title: `${product.title} | Winepopper USA`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.title} | Winepopper USA`,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params
  const product = getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  return (
    <main className="container-main py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <ImageGallery
          images={product.images}
          videoUrl={product.handle === "winepopper-aluminum" ? "/images/3s.mp4" : undefined}
        />
        <ProductInfo product={product} />
      </div>
    </main>
  )
}
