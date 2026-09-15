"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Product } from "@/types/products";

interface ProductDescriptionProps {
  product: Product;
}

const COLLAPSE_AFTER = 260;
const COLLAPSED_HEIGHT = 120;

const ProductDescription: FC<ProductDescriptionProps> = ({ product }) => {
  const t = useTranslations("Description");
  const tPage = useTranslations("ProductPage");
  const [expanded, setExpanded] = useState(false);

  const text = product.detailedDescription?.trim();
  if (!text) return null;

  const paragraphs = text.split(/\n+/).filter(Boolean);
  const collapsible = text.length > COLLAPSE_AFTER;

  return (
    <section aria-labelledby="description-title" className="space-y-3">
      <h2 id="description-title" className="text-lg font-semibold text-[#171717]">
        {t("product_description_title")}
      </h2>
      <motion.div
        initial={false}
        animate={{ height: collapsible && !expanded ? COLLAPSED_HEIGHT : "auto" }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden"
      >
        <div className="space-y-3 text-[15px] leading-relaxed text-[#3D3D3D] max-w-[65ch]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent transition-opacity duration-300",
            collapsible && !expanded ? "opacity-100" : "opacity-0"
          )}
        />
      </motion.div>
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-sm font-medium text-[#171717] underline underline-offset-4 decoration-[#C6C6C4] hover:decoration-[#171717] transition-colors"
        >
          {expanded ? tPage("read_less") : tPage("read_more")}
        </button>
      )}
    </section>
  );
};

export default ProductDescription;
