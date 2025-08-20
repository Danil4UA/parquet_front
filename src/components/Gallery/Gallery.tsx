import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface GalleryProps {
  images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative " dir="ltr">
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                  <Image 
                    src={src} 
                    fill
                    alt={`Product image ${index + 1}`} 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>

        {images.length > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm"
          >
            {current} / {count}
          </Badge>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 px-1 py-2 sm:py-4 !mt-0">
          {images.map((src, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`aspect-square p-0 h-auto overflow-hidden rounded-md transition-all ${
                current - 1 === index 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:opacity-80'
              }`}
              onClick={() => goToSlide(index)}
            >
              <div className="relative w-full h-full">
                <Image 
                  src={src} 
                  fill
                  alt={`Thumbnail ${index + 1}`} 
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, 10vw"
                />
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;