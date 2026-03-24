import { Hero } from "@/modules/home/components/hero"
import { SocialProofBar } from "@/modules/home/components/social-proof-bar"
import { HowItWorks } from "@/modules/home/components/how-it-works"
import { LifestyleSection } from "@/modules/home/components/lifestyle-section"
import { FeaturesGrid } from "@/modules/home/components/features-grid"
import { FeaturedProduct } from "@/modules/home/components/featured-product"
import { ProductLineup } from "@/modules/home/components/product-lineup"
import { Testimonials } from "@/modules/home/components/testimonials"
import { FAQSection } from "@/modules/home/components/faq-section"
import { CTASection } from "@/modules/home/components/cta-section"

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofBar />
      <HowItWorks />
      <LifestyleSection />
      <FeaturedProduct />
      <FeaturesGrid />
      <ProductLineup />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  )
}
