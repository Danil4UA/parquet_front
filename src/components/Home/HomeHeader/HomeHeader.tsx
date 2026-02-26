"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Contact } from "lucide-react";
import homeBackGround from "../../../../public/assets/home_background.jpg";
import homeBackGround_2 from "../../../../public/assets/home_background_2.jpg";
import homeBackGround_3 from "../../../../public/assets/main_1.jpg";
import RouteConstants from "@/constants/RouteConstants";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

const heroImages = [
  homeBackGround_2.src,
  homeBackGround.src,
  homeBackGround_3.src,
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HomeHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("HomePage");
  const { isMobile } = useIsMobileDebounce();

  const lng = pathname.split("/")[1];
  const isHebrew = lng === "he";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
      {/* Background slides */}
      <div className="absolute inset-0">
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
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center pt-[var(--navbar-height)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
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
                className="group flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-stone-700/80 border border-stone-500/50 text-white font-semibold rounded-xl text-sm sm:text-base hover:bg-stone-600/90 hover:border-stone-400/60 transition-all duration-200"
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
                { value: "1000+", label: t("happy_clients") },
                { value: "5+",    label: t("years_of_experience") },
                { value: "100+",  label: t("excellent_products") },
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="hidden lg:flex absolute bottom-6 left-8 z-20 flex-col items-center gap-2 text-white/40">
        <span className="text-xs transform -rotate-90 origin-center whitespace-nowrap">{t("scroll_down")}</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
};

export default HomeHeader;
