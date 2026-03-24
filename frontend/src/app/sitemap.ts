import { MetadataRoute } from "next";

const BASE_URL = "https://winepopperusa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/products",
    "/contact",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
  ];

  const productPages = [
    "/products/winepopper-aluminum",
    "/products/winepopper-lite",
    "/products/refill-gas-capsule",
  ];

  const allPages = [...staticPages, ...productPages];

  return allPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/products/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7,
  }));
}
