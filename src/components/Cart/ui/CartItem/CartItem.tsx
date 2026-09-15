"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemType, removeFromCart, updateQuantity } from "../../model/slice/cartSlice";
import { formatPrice } from "@/Utils/productsUtils";

interface CartItemProps {
  item: CartItemType;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ""));

/**
 * Quantity is stored in m² for flooring. One step = one box (boxCoverage m²),
 * so +/- always lands on a whole number of boxes; typed values are kept as-is.
 */
const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("Cart");
  const { _id, name, images, quantity, price, discount, boxCoverage } = item;

  const step = Number(boxCoverage) > 0 ? Number(boxCoverage) : 1;
  const isArea = Number(boxCoverage) > 0;
  const [draft, setDraft] = useState(format(quantity));

  useEffect(() => {
    setDraft(format(quantity));
  }, [quantity]);

  const unitPrice = discount ? Number(price) * (1 - Number(discount) / 100) : Number(price);
  const boxes = isArea ? Math.ceil(round2(quantity / step)) : quantity;
  const lineTotal = unitPrice * quantity;

  const setQuantity = (next: number) => {
    const value = round2(next);
    if (value <= 0) {
      dispatch(removeFromCart(_id));
      return;
    }
    dispatch(updateQuantity({ productId: _id, quantity: value }));
  };

  const commitDraft = () => {
    const parsed = parseFloat(draft.replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) {
      setDraft(format(quantity));
      return;
    }
    setQuantity(parsed);
  };

  return (
    <div className="flex gap-3 rounded-xl border border-[#E5E5E5] p-3">
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-[#F5F5F4]">
        <Image src={images[0]} alt={name} fill className="object-cover" sizes="72px" />
        {discount ? (
          <span className="absolute start-1 top-1 rounded bg-[#B3261E] px-1 text-[10px] font-semibold text-white">-{discount}%</span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#171717]">{name}</h3>
          <button
            type="button"
            onClick={() => dispatch(removeFromCart(_id))}
            aria-label="Remove"
            className="-me-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-md text-[#8A8A8A] transition-colors hover:bg-[#F5F5F4] hover:text-[#B3261E]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[#DCDCDB]" dir="ltr">
              <button
                type="button"
                onClick={() => setQuantity(quantity - step)}
                aria-label="-"
                className="flex h-full w-8 items-center justify-center text-[#171717] transition-colors hover:bg-[#F5F5F4]"
              >
                <Minus className="size-3.5" />
              </button>
              <input
                inputMode="decimal"
                value={draft}
                onChange={(e) => setDraft(e.target.value.replace(/[^\d.,]/g, ""))}
                onBlur={commitDraft}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                aria-label={t("total_area")}
                className="h-full w-12 bg-transparent text-center text-sm font-semibold tabular-nums text-[#171717] outline-none"
              />
              {isArea && <span className="pe-2 text-xs text-[#6B6B6B]">{t("sqm")}</span>}
              <button
                type="button"
                onClick={() => setQuantity(quantity + step)}
                aria-label="+"
                className="flex h-full w-8 items-center justify-center text-[#171717] transition-colors hover:bg-[#F5F5F4]"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            {isArea && (
              <p className="mt-1 text-xs text-[#6B6B6B] tabular-nums">
                {t("boxes_count", { count: boxes })} · {step} {t("sqm")} {t("per_box")}
              </p>
            )}
          </div>

          <div className="text-end">
            <div className="text-base font-bold tabular-nums text-[#171717]">{formatPrice(lineTotal)}</div>
            <div className="text-xs text-[#6B6B6B] tabular-nums">
              {discount ? <span className="me-1 line-through">{formatPrice(Number(price))}</span> : null}
              {formatPrice(unitPrice)} {isArea ? t("per_sqm") : t("each")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);
