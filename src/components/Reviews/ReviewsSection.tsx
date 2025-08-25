"use client";

import { Review, ReviewsResponse } from "@/types/reviews"
import { UseQueryResult } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import ReviewCard from "./ReviewCard";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import Utils from "@/Utils/utils";

type IReviewsSection = {
    reviewsData: UseQueryResult<AxiosResponse<ReviewsResponse>, Error>
}

export default function ReviewsSection({ reviewsData }: IReviewsSection) {
  const t = useTranslations("HomePage");

  const reviews = reviewsData?.data?.data?.reviews || [];
  const total_reviews = reviewsData?.data?.data?.total_reviews || 0;

  const plugin = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true,
      stopOnFocusIn: false
    })
  );

  const handleMoreReviewsClick = () => {
    window.open(Utils.moreReviewsLink, "_blank")
  }
    
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white mb-8" dir={"ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("customer_reviews")}
          </h2>
        </div>
        
        <div className="block md:hidden">
          <div className="space-y-4">
            {reviews.slice(0, 6).map((review: any, index: number) => (
              <div key={`mobile-${review.author_name}-${index}`}>
                <ReviewCard review={review} />
              </div>
            ))}

            {total_reviews > 5 && (
            <div className="text-center mt-6">
                <Button 
                    className="text-sm"
                    onClick={handleMoreReviewsClick}
                >
                    {t("get_more_reviews")}
                </Button>
            </div>
            )}
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: "center",
                loop: true,
                dragFree: true,
                containScroll: "trimSnaps"
              }}
            >
            <CarouselContent className="-ml-2 md:-ml-4 lg:-ml-6">
                {reviews.map((review: Review, index: number) => (
                  <CarouselItem
                    key={`desktop-${review.author_name}-${index}`}
                    // className="pl-6 md:basis-1/2 lg:basis-1/3 min-h-0"
                    className="pl-2 md:pl-4 lg:pl-6 md:basis-1/2 lg:basis-1/3 min-h-0"
                  >
                    <div className="h-full">
                      <ReviewCard review={review} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 xl:-left-6" />
              <CarouselNext className="-right-4 xl:-right-6" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}