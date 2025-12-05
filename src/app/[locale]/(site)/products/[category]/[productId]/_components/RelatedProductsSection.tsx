import LoadingSpinner from "@/components/LoadingSpinner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { allProductsByCategory } from "@/constants/queryInfo";
import { useQueries } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import RouteConstants from "@/constants/RouteConstants";
import { useTranslations } from "next-intl";

const RelatedProductsSection = () => {
  const t = useTranslations("Product");
  const pathname = usePathname();
  const router = useRouter();

  const lng = pathname.split("/")[1];

  const [allProductsData] = useQueries({
    queries: [allProductsByCategory({
      category: "all",
      language: lng,
      page: 1,
      limit: 12,
      isRandom: "true",
    })],
  });

  const relatedProducts = allProductsData?.data?.data?.products || [];
  
  const plugin = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
      stopOnFocusIn: false
    })
  );

  const handleSeeMoreProducts = () => {
    router.push(`/${lng}/${RouteConstants.ALL_PRODUCTS_PAGE}`);
  };

  if (allProductsData.isPending) {
    return (
      <section className="py-4 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[85%]">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              You also might like
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    );
  }

  if (!relatedProducts.length) {
    return null;
  }

  return (
    <section className="pb-4 bg-gray-50" dir="ltr">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {t("SpecialsForYou")}
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Mobile Grid */}
        <div className="block lg:hidden mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {relatedProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="w-full">
                <ProductCard 
                  product={product} 
                  className="h-full duration-200 bg-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden lg:block mb-4">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: "trimSnaps",
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-4">
              {relatedProducts.map((product, index) => (
                <CarouselItem 
                  key={`desktop-related-${product._id}-${index}`} 
                  className="pl-4 basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                >
                  <ProductCard 
                    product={product} 
                    className="h-full duration-200 bg-transparent"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6 bg-white shadow-md hover:shadow-lg transition-shadow" />
            <CarouselNext className="-right-6 bg-white shadow-md hover:shadow-lg transition-shadow" />
          </Carousel>
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Button
            className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
            onClick={handleSeeMoreProducts}
            size="lg"
          >
            {t("SeeMoreProducts")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsSection;