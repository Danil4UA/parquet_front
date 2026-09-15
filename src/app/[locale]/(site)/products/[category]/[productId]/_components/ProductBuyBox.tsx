"use client";

import { FC, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/products";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { trackAddToCart } from "@/lib/fbPixel";
import { createAddToCartEvent, formatPrice } from "@/Utils/productsUtils";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
import { WASTE_RESERVE, boxesForArea, isFlooring, roundArea } from "./productPageUtils";

interface ProductBuyBoxProps {
  product: Product;
  productPriceWithDiscount: number;
  ctaRef?: (node: HTMLDivElement | null) => void;
}

const AREA_STEP = 1;
const MAX_AREA = 999;

const ProductBuyBox: FC<ProductBuyBoxProps> = ({ product, productPriceWithDiscount, ctaRef }) => {
  const dispatch = useDispatch();
  const t = useTranslations("ProductPage");
  const tProduct = useTranslations("Product");
  const tFilter = useTranslations("Filter");
  const tDescription = useTranslations("Description");

  const isAvailable = product.isAvailable !== false;
  const flooring = isFlooring(product.category);
  const boxCoverage = Number(product.boxCoverage) || 0;
  const hasBoxes = flooring && boxCoverage > 0;

  const [areaInput, setAreaInput] = useState<string>("");
  const [withReserve, setWithReserve] = useState(true);

  const area = useMemo(() => {
    const parsed = parseFloat(areaInput.replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) return 0;
    return Math.min(parsed, MAX_AREA);
  }, [areaInput]);

  const plannedArea = withReserve ? roundArea(area * (1 + WASTE_RESERVE)) : area;
  const boxes = hasBoxes ? boxesForArea(plannedArea, boxCoverage) : 0;
  const coveredArea = hasBoxes ? roundArea(boxes * boxCoverage) : plannedArea;
  const total = Math.round(productPriceWithDiscount * (hasBoxes ? coveredArea : area || 1));

  const changeArea = (delta: number) => {
    const next = Math.max(0, Math.min(MAX_AREA, (area || 0) + delta));
    setAreaInput(next === 0 ? "" : String(next));
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    // Cart quantity is stored in m² for flooring (the order page converts it to boxes).
    const quantity = hasBoxes ? (coveredArea > 0 ? coveredArea : boxCoverage) : Math.max(1, Math.round(area) || 1);
    dispatch(addToCart({ ...product, quantity }));
    dispatch(setCollapsedСart(false));

    const analyticsEvent = createAddToCartEvent(product, quantity);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push(analyticsEvent);
    trackAddToCart(product._id, Number(product.price), quantity);
  };

  const colorLabel = product.color && tFilter.has(product.color) ? tFilter(product.color) : product.color;
  const boxPrice = hasBoxes ? Math.round(productPriceWithDiscount * boxCoverage) : null;

  return (
    <section aria-labelledby="product-title" className="space-y-5">
      <header className="space-y-1.5">
        <h1 id="product-title" className="text-[22px] sm:text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#171717] text-balance">
          {product.name}
        </h1>
        <p className="text-[13px] text-[#6B6B6B] flex flex-wrap items-center gap-x-3 gap-y-1">
          {product.model && (
            <span>
              {t("article")} <span className="text-[#171717] tabular-nums">{product.model}</span>
            </span>
          )}
          {colorLabel && <span>{colorLabel}</span>}
          <span className={cn("inline-flex items-center gap-1.5", isAvailable ? "text-[#2F7A4A]" : "text-[#B3261E]")}>
            <span className={cn("size-1.5 rounded-full", isAvailable ? "bg-[#2F7A4A]" : "bg-[#B3261E]")} />
            {isAvailable ? t("in_stock") : tProduct("OutOfStock")}
          </span>
        </p>
      </header>

      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
        <span className={cn("text-[30px] font-bold leading-none tabular-nums", product.discount ? "text-[#B3261E]" : "text-[#171717]")}>
          {formatPrice(productPriceWithDiscount)}
        </span>
        {product.discount ? (
          <span className="text-base text-[#8A8A8A] line-through tabular-nums">{formatPrice(Number(product.price))}</span>
        ) : null}
        {flooring && <span className="text-sm text-[#6B6B6B]">{t("per_sqm")}</span>}
        {boxPrice !== null && (
          <span className="basis-full text-sm text-[#6B6B6B] tabular-nums">
            <span className="font-medium text-[#171717]">{formatPrice(boxPrice)}</span> {t("per_box")} · {t("box_covers", { area: boxCoverage })}
          </span>
        )}
      </div>

      {hasBoxes && (
        <div className="rounded-xl bg-[#F5F5F4] p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="room-area" className="text-[15px] font-semibold text-[#171717]">
              {t("calc_title")}
            </label>
            <span className="text-xs text-[#6B6B6B]">{t("calc_area_label")}</span>
          </div>

          <div className="flex items-stretch gap-2">
            <div className="flex flex-1 items-center rounded-lg border border-[#DCDCDB] bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => changeArea(-AREA_STEP)}
                aria-label="-"
                className="h-12 w-12 shrink-0 flex items-center justify-center text-[#171717] hover:bg-[#F5F5F4] active:bg-[#EBEBEA] transition-colors"
              >
                <Minus className="size-4" />
              </button>
              <input
                id="room-area"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value.replace(/[^\d.,]/g, ""))}
                className="no-spinner h-12 w-full min-w-0 bg-transparent text-center text-xl font-semibold tabular-nums text-[#171717] outline-none placeholder:text-[#B5B5B3]"
                dir="ltr"
              />
              <span className="pe-3 text-sm text-[#6B6B6B]">{tDescription("square_meters")}</span>
              <button
                type="button"
                onClick={() => changeArea(AREA_STEP)}
                aria-label="+"
                className="h-12 w-12 shrink-0 flex items-center justify-center text-[#171717] hover:bg-[#F5F5F4] active:bg-[#EBEBEA] transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#4B4B4B] select-none">
            <input
              type="checkbox"
              checked={withReserve}
              onChange={(e) => setWithReserve(e.target.checked)}
              className="size-4 accent-[#171717]"
            />
            {t("calc_reserve")}
          </label>

          {area > 0 ? (
            <div className="flex items-end justify-between gap-3 border-t border-[#E3E3E2] pt-3">
              <div className="text-sm text-[#4B4B4B] leading-snug">
                <div className="font-semibold text-[#171717] tabular-nums">{t("calc_boxes", { count: boxes })}</div>
                <div className="tabular-nums">{t("calc_covers", { area: coveredArea })}</div>
              </div>
              <div className="text-end">
                <div className="text-xs text-[#6B6B6B]">{t("calc_total")}</div>
                <div className="text-2xl font-bold tabular-nums text-[#171717] leading-none">{formatPrice(total)}</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8A8A8A]">{t("calc_hint")}</p>
          )}
        </div>
      )}

      <div ref={ctaRef} className="flex items-center gap-3">
        <Button
          size="lg"
          disabled={!isAvailable}
          onClick={handleAddToCart}
          className={cn(
            "h-14 flex-1 rounded-xl text-base font-semibold bg-[#171717] text-white hover:bg-[#2A2A2A] active:scale-[0.99] transition-[background-color,transform] duration-200",
            !isAvailable && "bg-[#DEDEDE] text-[#7A7A7A] hover:bg-[#DEDEDE]"
          )}
        >
          {!isAvailable
            ? tProduct("OutOfStock")
            : hasBoxes && area > 0
              ? t("add_area_to_cart", { area: coveredArea })
              : t("add_to_cart")}
        </Button>
        <FavoriteButton
          product={product}
          className="h-14 w-14 shrink-0 rounded-xl border border-[#E5E5E5] bg-white shadow-none hover:scale-100 hover:bg-[#F5F5F4]"
          iconSize={22}
        />
      </div>
    </section>
  );
};

export default ProductBuyBox;
