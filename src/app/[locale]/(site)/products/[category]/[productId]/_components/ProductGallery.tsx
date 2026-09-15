"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import Gallery from "@/components/Gallery/Gallery";

interface ProductGalleryProps {
  images: string[];
  onVisualize?: () => void;
  visualizerStatus?: "idle" | "processing" | "ready";
}

const ProductGallery: FC<ProductGalleryProps> = ({ images, onVisualize, visualizerStatus = "idle" }) => {
  const t = useTranslations("ProductPage");
  const label = visualizerStatus === "ready" ? t("visualizer_ready_pill") : visualizerStatus === "processing" ? t("visualizer_processing_pill") : t("see_in_room");

  return (
    <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
      <Gallery
        images={images}
        overlay={
          onVisualize ? (
            <button
              type="button"
              onClick={onVisualize}
              className="group absolute bottom-3 start-3 z-10 inline-flex h-11 items-center gap-2 rounded-full bg-[#171717]/90 ps-3 pe-4 text-sm font-medium text-white shadow-[0_6px_20px_-6px_rgba(23,23,23,0.6)] backdrop-blur transition-[transform,background-color] duration-200 hover:bg-[#171717] active:scale-[0.98]"
            >
              <span className="relative flex size-7 items-center justify-center rounded-full bg-white/15 text-white">
                <Camera className="size-4" strokeWidth={2} />
                {visualizerStatus === "ready" && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[#2F7A4A] ring-2 ring-[#171717]" />}
                {visualizerStatus === "processing" && <span className="absolute -right-0.5 -top-0.5 size-2.5 animate-pulse rounded-full bg-white ring-2 ring-[#171717]" />}
              </span>
              {label}
            </button>
          ) : null
        }
      />
    </div>
  );
};

export default ProductGallery;
