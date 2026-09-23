import HomePageClient from "./HomePageClient";
import type { SiteContent } from "@/services/contentServices";
import type { Product } from "@/types/products";
import type { Showcase } from "@/components/Home/VisualizerShowcase";
import type { CategorySummary } from "@/components/Home/CategoryBento";

// Everything the first screen needs is fetched on the server so it is in the initial HTML
// (better LCP and SEO); the page revalidates every 5 minutes.
export const revalidate = 300;

const API = process.env.NEXT_PUBLIC_URL_API;

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return fallback;
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const content = await fetchJson<SiteContent>("/api/content", {});
  const pickedPopular = content.home_popular?.length ? content.home_popular : null;
  const pickedWorks = content.home_works?.length ? content.home_works : null;
  const byIds = (ids: string[]) => fetchJson<{ products: Product[] }>(`/api/products/batch?ids=${ids.join(",")}&language=${locale}`, { products: [] });

  const [catalog, popular, works, summary, showcase] = await Promise.all([
    // Automatic pool: products with a photo of a finished interior, in the catalog's default order (interior first, daily shuffle).
    fetchJson<{ products: Product[] }>(`/api/products?category=all&interiorPhoto=with&availability=in_stock&limit=14&language=${locale}`, { products: [] }),
    pickedPopular ? byIds(pickedPopular) : Promise.resolve(null),
    pickedWorks ? byIds(pickedWorks) : Promise.resolve(null),
    fetchJson<{ categories: CategorySummary[] }>("/api/products/categories-summary", { categories: [] }),
    // Only the result the admin picked on the Homepage page; nothing picked = no demo block.
    content.home_showcase
      ? fetchJson<{ showcase: Showcase | null }>(`/api/visualizer/showcase?language=${locale}&id=${content.home_showcase}`, { showcase: null })
      : Promise.resolve({ showcase: null }),
  ]);

  return (
    <HomePageClient
      content={content}
      products={catalog.products}
      pickedPopular={popular?.products ?? null}
      pickedWorks={works?.products ?? null}
      categories={summary.categories}
      showcase={showcase.showcase}
      language={locale}
    />
  );
}
