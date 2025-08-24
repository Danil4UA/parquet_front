"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Contact } from "lucide-react";
import homeBackGround from "../../../../public/assets/home_background.jpg";
import homeBackGround_2 from "../../../../public/assets/home_background_2.jpg";
import homeBackGround_3 from "../../../../public/assets/main_1.jpg";
import RouteConstants from "@/constants/RouteConstants";

const heroImages = [
  homeBackGround_2.src,
  homeBackGround.src,
  homeBackGround_3.src,
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const HomeHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lng = pathname.split("/")[1];
  const t = useTranslations("HomePage");
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
    if (isHebrew) {
      setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    } else {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (isHebrew) {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    }
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height))] overflow-hidden">
      {/* Carousel Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Hero ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
            {/* Dark gradient overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-gray-900/40 backdrop-blur-md border border-gray-700/50 text-white hover:bg-gray-800/60 transition-all duration-300 group"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-gray-900/40 backdrop-blur-md border border-gray-700/50 text-white hover:bg-gray-800/60 transition-all duration-300 group"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Заголовок с анимацией */}
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ duration: 0.8, delay: 0 }}
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight ${
                isHebrew ? "text-right" : "text-left"
              }`}
            >
              <span className="block transform hover:scale-105 transition-transform duration-300">
                {t("effect_parquet")}
              </span>
            </motion.h1>

            {/* Описание с анимацией */}
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed ${
                isHebrew ? "text-right" : "text-left"
              }`}
            >
              {t("description")}
            </motion.p>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`flex flex-col mt-[75px] sm:flex-row gap-3 sm:gap-4 ${isHebrew ? "sm:justify-start" : "sm:justify-start"}`}
            >
              <button
                onClick={() => router.push(`/${lng}/${RouteConstants.ALL_PRODUCTS_PAGE}`)}
                className="group relative px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-900/50 text-sm sm:text-base border border-gray-700"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t("view_products")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>

              <button 
                className="group px-4 sm:px-8 py-3 sm:py-4 bg-gray-900/30 backdrop-blur-sm border border-gray-600/50 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-gray-800/40 hover:scale-105 text-sm sm:text-base"
                onClick={(() => router.push(`${lng}/${RouteConstants.CONTACT_US_PAGE}`))}
              >
                <span className="flex items-center justify-center gap-2">
                  <Contact className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t("contact_us")}
                </span>
              </button>
            </motion.div>

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center sm:justify-start gap-4 sm:gap-8 mt-6 sm:mt-12"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">1000+</div>
                <div className="text-xs sm:text-sm text-gray-300/80">{t("happy_clients")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">5+</div>
                <div className="text-xs sm:text-sm text-gray-300/80">{t("years_of_experience")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">100+</div>
                <div className="text-xs sm:text-sm text-gray-300/80">{t("excellent_products")}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-gray-400/60 hover:bg-gray-300/80"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="hidden lg:block absolute bottom-6 sm:bottom-8 left-6 sm:left-8 z-20 text-gray-300/70"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm transform -rotate-90 origin-center whitespace-nowrap">{t("scroll_down")}</span>
          <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-gray-300/70 to-transparent animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeHeader;