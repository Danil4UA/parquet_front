import HomePageClient from "./HomePageClient";
import type { SiteContent } from "@/services/contentServices";

// Hero/category images come from the admin Media page. Fetching them on the
// server puts the first hero photo into the initial HTML (better LCP);
// the page revalidates every 5 minutes.
export const revalidate = 300;

async function getSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/content`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch site content:", error);
    return {};
  }
}

export default async function HomePage() {
  const content = await getSiteContent();

  return <HomePageClient content={content} />;
}
