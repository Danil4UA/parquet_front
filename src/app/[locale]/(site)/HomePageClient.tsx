"use client";

import { useQuery } from "@tanstack/react-query";
import { allReviewsQuery } from "@/constants/queryInfo";
import type { SiteContent } from "@/services/contentServices";
import type { Product } from "@/types/products";
import HomeHero from "@/components/Home/HomeHero";
import VisualizerShowcase, { Showcase } from "@/components/Home/VisualizerShowcase";
import CategoryBento, { CategorySummary } from "@/components/Home/CategoryBento";
import PopularProducts from "@/components/Home/PopularProducts";
import WorksGrid from "@/components/Home/WorksGrid";
import HowWeWork from "@/components/Home/HowWeWork";
import ReviewsSection from "@/components/Reviews/ReviewsSection";
import { DEFAULT_HERO_IMAGE } from "@/constants/siteMedia";

interface HomePageClientProps {
  content: SiteContent;
  /** Automatic pool: products with interior photos in catalog order. */
  products: Product[];
  /** Admin's own choice for "Most chosen" / "Our work"; null = automatic. */
  pickedPopular: Product[] | null;
  pickedWorks: Product[] | null;
  categories: CategorySummary[];
  showcase: Showcase | null;
  language: string;
}

const POPULAR_COUNT = 8;
const WORKS_COUNT = 6;

export default function HomePageClient({ content, products, pickedPopular, pickedWorks, categories, showcase, language }: HomePageClientProps) {
  const reviews = useQuery(allReviewsQuery(language));
  const reviewsData = reviews.data?.data;

  // The admin's hero photo (Homepage page) wins; otherwise our default installation photo.
  const heroImage = content.hero_image || DEFAULT_HERO_IMAGE;

  const popular = pickedPopular?.length ? pickedPopular : products.slice(0, POPULAR_COUNT);
  const works = pickedWorks?.length
    ? pickedWorks
    : products.length > POPULAR_COUNT ? products.slice(POPULAR_COUNT, POPULAR_COUNT + WORKS_COUNT) : products.slice(0, WORKS_COUNT);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <HomeHero
        image={heroImage}
        rating={reviewsData?.rating}
        totalReviews={reviewsData?.total_reviews}
        fadeTo={showcase ? "#F5F5F4" : "#FFFFFF"}
      />
      {showcase && <VisualizerShowcase showcase={showcase} />}
      <CategoryBento categoryImages={content.category_images || {}} summary={categories} products={products} language={language} />
      <PopularProducts products={popular} />
      <WorksGrid products={works} />
      <HowWeWork />
      <ReviewsSection reviewsData={reviews} />
    </div>
  );
}
