"use client";

import HomeHeader from "@/components/Home/HomeHeader/HomeHeader";
import HomeMain from "@/components/Home/HomeMain/HomeMain";
import ReviewsSection from "@/components/Reviews/ReviewsSection";
import { useQueries } from "@tanstack/react-query";
import { allReviewsQuery } from "@/constants/queryInfo";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];

  const [
    reviewsData,
  ] = useQueries({
    queries: [
      allReviewsQuery(lng)
    ]
  })
  return (
    <div className="w-full flex flex-col min-h-screen">
      <HomeHeader />
      <HomeMain />
      <ReviewsSection
        reviewsData={reviewsData}
      />
    </div>
  );
}
