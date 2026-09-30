import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemType, removeFromCart, updateQuantity } from "@/components/Cart/model/slice/cartSlice";
import { OrderFormType } from "@/lib/schemas/orderFormSchema";

interface OrderSummarySectionProps {
  cartItems: CartItemType[];
  totalBoxes: Record<string, number>;
  totalArea: Record<string, number>;
  itemTotalPrices: Record<string, number>;
  unitPrices: Record<string, number>;
  deliveryMethod: OrderFormType["deliveryMethod"];
  shippingCost: number;
  totalPrice: number;
  money: (value: number) => string;
}

const stepButton = "flex h-full w-9 items-center justify-center text-[#171717] transition-colors hover:bg-[#F5F5F4]";

/** What is being ordered: one row per product with an amount stepper, then boxes, delivery and the total. */
export default function OrderSummarySection({
  cartItems,
  totalBoxes,
  totalArea,
  itemTotalPrices,
  unitPrices,
  deliveryMethod,
  shippingCost,
  totalPrice,
  money,
}: OrderSummarySectionProps) {
  const t = useTranslations("Order");
  const tCart = useTranslations("Cart");
  const dispatch = useDispatch();

  // Same rule as the cart drawer: flooring is stored in m² and one step is one box; at zero the item is removed.
  const changeQuantity = (item: CartItemType, direction: 1 | -1) => {
    const step = Number(item.boxCoverage) > 0 ? Number(item.boxCoverage) : 1;
    const next = Math.round((item.quantity + direction * step) * 100) / 100;
    if (next <= 0) dispatch(removeFromCart(item._id));
    else dispatch(updateQuantity({ productId: item._id, quantity: next }));
  };
  // Only flooring is sold by the box; accessories are counted in pieces.
  const boxesCount = cartItems.reduce((sum, item) => sum + (item.boxCoverage ? totalBoxes[item._id] ?? 0 : 0), 0);

  return (
    <aside className="h-fit rounded-2xl bg-[#F5F5F4] p-6 sm:p-8 lg:sticky lg:top-[calc(var(--navbar-height)+24px)]">
      <h2 className="m-0 mb-5 text-xl font-semibold text-[#171717]">{t("orderSummary")}</h2>

      <ul className="m-0 grid list-none gap-5 p-0">
        {cartItems.map((item) => (
          <li key={item._id} className="grid grid-cols-[64px_1fr] gap-3.5">
            <div className="relative size-16 overflow-hidden rounded-xl bg-white">
              {item.images?.[0] && <Image src={item.images[0]} alt={item.name} fill sizes="64px" className="object-cover" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="m-0 line-clamp-2 text-sm font-medium leading-snug text-[#171717]" title={item.name}>{item.name}</p>
                <div className="shrink-0 text-sm font-semibold text-[#171717] tabular-nums">{money(itemTotalPrices[item._id] ?? 0)}</div>
              </div>
              <p className="m-0 mt-1 text-[13px] leading-snug text-[#6B6B6B]">
                {item.boxCoverage
                  ? `${tCart("boxes_count", { count: totalBoxes[item._id] ?? 0 })} · ${totalArea[item._id] ?? 0} ${tCart("sqm")} · ${money(unitPrices[item._id] ?? 0)} ${tCart("per_sqm")}`
                  : `${money(unitPrices[item._id] ?? 0)} ${tCart("each")}`}
              </p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex h-9 items-center overflow-hidden rounded-[10px] border border-[#DCDCDB] bg-white" dir="ltr">
                  <button type="button" onClick={() => changeQuantity(item, -1)} aria-label="-" className={stepButton}>
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-[84px] px-1 text-center text-sm font-semibold tabular-nums text-[#171717]" dir="auto">
                    {item.boxCoverage ? tCart("boxes_count", { count: totalBoxes[item._id] ?? 0 }) : item.quantity}
                  </span>
                  <button type="button" onClick={() => changeQuantity(item, 1)} aria-label="+" className={stepButton}>
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item._id))}
                  aria-label="Remove"
                  className="flex size-9 items-center justify-center rounded-full text-[#8A8A8A] transition-colors hover:bg-white hover:text-[#B3261E]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dl className="m-0 mt-6 grid gap-2.5 border-t border-[#E2DFDA] pt-5 text-[15px]">
        {boxesCount > 0 && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[#4B4B4B]">{t("totalPackages")}</dt>
            <dd className="m-0 font-medium text-[#171717] tabular-nums">{boxesCount}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[#4B4B4B]">{deliveryMethod === "shipping" ? t("delivery") : t("pickup")}</dt>
          <dd className="m-0 font-medium text-[#171717] tabular-nums">{deliveryMethod === "shipping" ? money(shippingCost) : t("free")}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#E2DFDA] pt-5">
        <div>
          <div className="text-lg font-semibold text-[#171717]">{t("total")}</div>
          <div className="text-[13px] text-[#6B6B6B]">{t("includingTaxes")}</div>
        </div>
        <div className="text-[28px] font-semibold leading-none tracking-[-0.01em] text-[#171717] tabular-nums">{money(totalPrice)}</div>
      </div>
    </aside>
  );
}
