import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
  /** Rendered on top of the main image (e.g. a call-to-action pill). */
  overlay?: React.ReactNode;
}

const SWIPE_THRESHOLD_PX = 50;
const ZOOM_SCALE = 2.5;

const Gallery = ({ images, overlay }: GalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // When set, the lightbox image is zoomed in around this point (in % of the image box)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

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
      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center rounded-2xl overflow-hidden">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoomOrigin(null);
    setLightboxOpen(true);
  };

  const closeLightbox = (open: boolean) => {
    setLightboxOpen(open);
    if (!open) setZoomOrigin(null);
  };

  const showPrev = () => {
    setZoomOrigin(null);
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setZoomOrigin(null);
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const toggleZoom = (e: React.MouseEvent<HTMLElement>) => {
    if (zoomOrigin) {
      setZoomOrigin(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || zoomOrigin || images.length < 2) {
      touchStartX.current = null;
      return;
    }
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD_PX) showPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) showNext();
    touchStartX.current = null;
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative" dir="ltr">
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
                <div
                  className="aspect-square relative overflow-hidden bg-muted cursor-zoom-in lg:rounded-xl"
                  onClick={() => openLightbox(index)}
                >
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
              <CarouselPrevious className="left-3 hidden [@media(hover:hover)]:inline-flex" />
              <CarouselNext className="right-3 hidden [@media(hover:hover)]:inline-flex" />
            </>
          )}
        </Carousel>

        {images.length > 1 && (
          <Badge
            variant="secondary"
            className="absolute bottom-4 right-3 bg-[#171717]/70 text-white tabular-nums backdrop-blur-sm hover:bg-[#171717]/70"
          >
            {current} / {count}
          </Badge>
        )}
        {overlay}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 lg:px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, index) => (
            <Button
              key={index}
              variant="ghost"
              aria-label={`Image ${index + 1}`}
              aria-current={current - 1 === index}
              className={`size-16 shrink-0 p-0 overflow-hidden rounded-md border-2 transition-colors hover:bg-transparent ${
                current - 1 === index ? 'border-[#171717]' : 'border-transparent hover:border-[#C6C6C4]'
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

      <Dialog open={lightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent
          overlayClassName="z-[110] bg-[#0E0E0E]/95"
          className="z-[120] block max-w-none w-screen h-dvh p-0 gap-0 bg-transparent border-0 rounded-none sm:rounded-none shadow-none text-white [&>button]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
          }}
        >
          <DialogTitle className="sr-only">Product image {lightboxIndex + 1}</DialogTitle>

          <div className="absolute right-3 top-3 z-30">
            <DialogClose className="flex items-center justify-center rounded-full bg-black/60 p-2 transition-colors hover:bg-black/80">
              <X className="size-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          {images.length > 1 && (
            <div className="absolute left-4 top-4 z-20 rounded bg-black/60 px-2 py-1 text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}

          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden px-2 pb-24 pt-14 sm:px-16"
            dir="ltr"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => closeLightbox(false)}
          >
            <Image
              src={images[lightboxIndex]}
              width={1600}
              height={1600}
              alt={`Product image ${lightboxIndex + 1}`}
              quality={90}
              className={cn(
                "h-auto w-auto max-h-full max-w-full object-contain select-none transition-transform duration-300",
                zoomOrigin ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
              style={zoomOrigin ? {
                transform: `scale(${ZOOM_SCALE})`,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              } : undefined}
              onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
            />

            {images.length > 1 && !zoomOrigin && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2 transition-colors hover:bg-black/80"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-2 transition-colors hover:bg-black/80"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && !zoomOrigin && (
            <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2 px-4" dir="ltr">
              {images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Image ${index + 1}`}
                  aria-current={lightboxIndex === index}
                  onClick={(e) => { e.stopPropagation(); setZoomOrigin(null); setLightboxIndex(index); }}
                  className={cn(
                    "relative size-14 overflow-hidden rounded-md border-2 transition-[border-color,opacity]",
                    lightboxIndex === index ? "border-white opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={src} fill alt="" sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
