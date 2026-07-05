"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Contact } from "lucide-react";
import RouteConstants from "@/constants/RouteConstants";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

interface HomeHeaderProps {
  heroImages?: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HomeHeader = ({ heroImages = [] }: HomeHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("HomePage");
  const { isMobile } = useIsMobileDebounce();

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  // Hero photos are managed from the admin Media page; with none configured
  // the header falls back to a plain dark background.
  const hasSlides = heroImages.length > 0;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (hasSlides && currentSlide >= heroImages.length) {
      setCurrentSlide(0);
    }
  }, [hasSlides, heroImages.length, currentSlide]);

  useEffect(() => {
    if (!isAutoPlaying || !hasSlides) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, hasSlides, heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      isHebrew
        ? (prev - 1 + heroImages.length) % heroImages.length
        : (prev + 1) % heroImages.length
    );
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      isHebrew
        ? (prev + 1) % heroImages.length
        : (prev - 1 + heroImages.length) % heroImages.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height))] overflow-hidden">
      {/* Background slides (dark fallback while nothing is configured) */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Hero ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={isMobile ? 70 : 90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Prev/Next buttons */}
      {heroImages.length > 1 && (
      <>
      {/* On phones the arrows sit at the bottom next to the dots so they never overlap the text */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-20 p-3 rounded-full text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-20 p-3 rounded-full text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      </>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-start sm:items-center pt-[var(--navbar-height)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:py-20">
          <div className="max-w-3xl">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 leading-tight ${
                isHebrew ? "text-right" : "text-left"
              }`}
            >
              {t("effect_parquet")}
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className={`text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl leading-relaxed ${
                isHebrew ? "text-right" : "text-left"
              }`}
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => router.push(`/${lng}/${RouteConstants.ALL_PRODUCTS_PAGE}`)}
                className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-white text-gray-900 font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-black/20 hover:bg-gray-100 hover:shadow-xl transition-all duration-200"
              >
                {t("view_products")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => router.push(`/${lng}/${RouteConstants.CONTACT_US_PAGE}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 border border-white/20 text-white/80 font-semibold rounded-xl text-sm sm:text-base hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-200"
              >
                <Contact className="w-4 h-4" />
                {t("contact_us")}
              </button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className={`flex gap-8 sm:gap-12 mt-10 sm:mt-14 ${isHebrew ? "justify-end" : "justify-start"}`}
            >
              {[
                { value: "300+", label: t("happy_clients") },
                { value: "3",    label: t("years_of_experience") },
                { value: "246",  label: t("excellent_products") },
              ].map(stat => (
                <div key={stat.value} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      {heroImages.length > 1 && (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
      )}

    </div>
  );
};

export default HomeHeader;
