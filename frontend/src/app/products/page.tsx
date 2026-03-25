import type { Metadata } from "next"
import { products } from "@/lib/products-data"
import ProductCard from "@/modules/products/components/product-card"

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Shop the full range of Winepopper automatic gas corkscrews and accessories. Open wine in under 3 seconds — effortlessly.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Our Products | Winepopper USA",
    description:
      "Shop the full range of Winepopper automatic gas corkscrews and accessories.",
  },
}

export default function ProductsPage() {
  return (
    <main className="container-main py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-center text-brand-black mb-10">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
