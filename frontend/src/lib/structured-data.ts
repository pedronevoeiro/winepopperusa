import { siteConfig } from "./config"
import { products as staticProducts, type Product } from "./products-data"

const BASE_URL = siteConfig.url

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo-winepopper.svg`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "customer service",
      email: siteConfig.contact.email,
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1720 NE Miami Gardens Drive",
      addressLocality: "North Miami Beach",
      addressRegion: "FL",
      postalCode: "33179",
      addressCountry: "US",
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.youtube],
  }
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: BASE_URL,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  }
}

export function getFAQSchema() {
  const faqs = [
    {
      q: "OK but how does it actually work?",
      a: "It's almost too simple: place it on the bottle, press the button, and a tiny burst of food-grade gas pushes the cork out from below. Under 3 seconds, no effort, satisfying POP included.",
    },
    {
      q: "Will it break my cork?",
      a: "Nope. That's the beauty of it. No piercing, no pulling, no crumbling. The gas pushes the cork out in one piece, every time. Even works perfectly on old, fragile corks.",
    },
    {
      q: "How many pops do I get per cartridge?",
      a: "About 30 bottles per cartridge. The Aluminum model comes with 2 cartridges, so that's roughly 60 pops out of the box. Refill packs are always available when you need more.",
    },
    {
      q: "Does the gas change how the wine tastes?",
      a: "Not even a little. It's food-grade inert gas — completely neutral. If anything, it helps preserve the wine by preventing oxidation during extraction. Your wine stays exactly as the winemaker intended.",
    },
    {
      q: "Natural corks, synthetic corks — does it matter?",
      a: "Doesn't matter at all. Natural, synthetic, old, new — the Winepopper handles them all. The only thing it can't open is a screw cap, but you don't need us for that.",
    },
    {
      q: "What if I don't love it?",
      a: "Then we'll give you your money back. 30 days, no questions, no hassle. But honestly? The real risk is that everyone who sees yours will want one too.",
    },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }
}

export function getProductSchema(product: Product) {
  const variant = product.variants[0]
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) => `${BASE_URL}${img.url}`),
    brand: {
      "@type": "Brand",
      name: "Winepopper",
    },
    sku: variant.sku,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.handle}`,
      priceCurrency: "USD",
      price: (v.price / 100).toFixed(2),
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: v.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
      bestRating: "5",
      worstRating: "1",
    },
  }
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function getProductListSchema() {
  return getProductListSchemaFromProducts(staticProducts)
}

export function getProductListSchemaFromProducts(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Winepopper Products",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/products/${product.handle}`,
      name: product.title,
    })),
  }
}
