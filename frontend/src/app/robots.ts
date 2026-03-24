import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/cart", "/api"],
    },
    sitemap: "https://winepopperusa.com/sitemap.xml",
  };
}
