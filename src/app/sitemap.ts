import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://effectparquet.com";

  // Base pages for all languages
  const basePages = [
    "",
    "/contact",
    "/products/all",
    "/products/sales",
    "/products/laminate",
    "/products/spc",
    "/products/wood",
    "/products/panels",
    "/products/cladding",
    "/products/cleaning"
  ];

  const languages = ["he", "ru", "en"];

  const pages = languages.flatMap((lang) =>
    basePages.map((page) => ({
      url: `${siteUrl}/${lang}${page}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: page === "" ? 1 : 0.8
    }))
  );

  pages.unshift({
    url: siteUrl,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 1
  });

  return pages;
}
