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
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

type IReviewsSection = {
    reviewsData: UseQueryResult<AxiosResponse<ReviewsResponse>, Error>
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const desktopFadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function ReviewsSection({ reviewsData }: IReviewsSection) {
  const t = useTranslations("HomePage");
  const { isMobile } = useIsMobileDebounce();

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

  const averageRating = "4.9";


  const currentFadeVariants = isMobile ? fadeInVariants : desktopFadeInVariants;
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 sm:py-16 overflow-hidden" dir={"ltr"}>
      {!isMobile && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-800 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={currentFadeVariants}
          transition={{ 
            duration: isMobile ? 0.3 : 0.8,
            ease: "easeOut"
          }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-semibold text-lg">{averageRating}</span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
            isMobile 
              ? "text-white" 
              : "bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
          }`}>
            {t("customer_reviews")}
          </h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={currentFadeVariants}
          transition={{
            duration: isMobile ? 0.3 : 0.8,
            delay: isMobile ? 0.1 : 0.2,
            ease: "easeOut"
          }}
        >
          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: "center",
                loop: true,
                dragFree: !isMobile,
                containScroll: "trimSnaps"
              }}
            >
              <CarouselContent className="-ml-3 md:-ml-4 lg:-ml-6">
                {reviews.map((review: Review, index: number) => (
                  <CarouselItem
                    key={`review-${review.author_name}-${index}`}
                    className="pl-3 md:pl-4 lg:pl-6 basis-[88%] sm:basis-1/2 lg:basis-1/3 min-h-0"
                  >
                    <div className="h-full">
                      <ReviewCard review={review} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="hidden md:inline-flex left-4 xl:left-6 bg-gray-900/40 backdrop-blur-md border-gray-700/50 text-white hover:bg-gray-800/60 transition-all duration-300" />
              <CarouselNext className="hidden md:inline-flex right-4 xl:right-6 bg-gray-900/40 backdrop-blur-md border-gray-700/50 text-white hover:bg-gray-800/60 transition-all duration-300" />
            </Carousel>

            {total_reviews > reviews.length && (
              <div className="text-center mt-8 sm:mt-12">
                <Button 
                  onClick={handleMoreReviewsClick}
                  className="group px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-900/50 border border-gray-600"
                >
                  <span className="flex items-center gap-2">
                    {t("get_more_reviews")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
      )}
    </section>
  );
}