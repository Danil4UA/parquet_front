"use client";

import { FC, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/products";
import { formatPrice } from "@/Utils/productsUtils";
import { socialLinks } from "@/Utils/utils";
import { cn } from "@/lib/utils";
import { isFlooring } from "./productPageUtils";

interface StickyBuyBarProps {
  product: Product;
  price: number;
  visible: boolean;
  onAddToCart: () => void;
}

const StickyBuyBar: FC<StickyBuyBarProps> = ({ product, price, visible, onAddToCart }) => {
  const t = useTranslations("ProductPage");
  const tProduct = useTranslations("Product");
  const isAvailable = product.isAvailable !== false;
  const cartOpen = useSelector((state: RootState) => !state.cart.isCollapsedCart);
  const shown = visible && !cartOpen;

  // Lets global fixed elements (e.g. the accessibility widget) move out of the bar's way.
  // Set on <html>: third-party widgets overwrite body.className.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-buy-bar", shown);
    return () => document.documentElement.removeAttribute("data-buy-bar");
  }, [shown]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ y: 96 }}
          animate={{ y: 0 }}
          exit={{ y: 96 }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
          className="fixed inset-x-0 bottom-0 z-[90] lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 border-t border-[#E5E5E5] bg-white/95 px-4 py-2.5 shadow-[0_-8px_24px_-12px_rgba(23,23,23,0.25)] backdrop-blur">
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-xs text-[#6B6B6B]">{product.name}</div>
              <div className="flex items-baseline gap-1 tabular-nums">
                <span className={cn("text-lg font-bold", product.discount ? "text-[#B3261E]" : "text-[#171717]")}>
                  {formatPrice(price)}
                </span>
                {isFlooring(product.category) && <span className="text-xs text-[#6B6B6B]">{t("per_sqm")}</span>}
              </div>
            </div>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("whatsapp")}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] text-[#25D366] hover:bg-[#F5F5F4] transition-colors"
            >
              <MessageCircle className="size-5" />
            </a>
            <button
              type="button"
              disabled={!isAvailable}
              onClick={onAddToCart}
              className={cn(
                "h-11 shrink-0 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#2A2A2A] active:scale-[0.98]",
                !isAvailable && "bg-[#DEDEDE] text-[#7A7A7A] hover:bg-[#DEDEDE]"
              )}
            >
              {isAvailable ? t("add_to_cart") : tProduct("OutOfStock")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyBar;
