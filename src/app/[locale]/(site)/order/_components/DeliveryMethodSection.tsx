import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { OrderFormType } from "@/lib/schemas/orderFormSchema";
import { formatPrice } from "@/Utils/productsUtils";

interface DeliveryMethodSectionProps {
  deliveryMethod: OrderFormType["deliveryMethod"];
  shippingCost: number;
}

/** Two option cards: delivery with its price, or free pickup from the showroom. */
export default function DeliveryMethodSection({ deliveryMethod, shippingCost }: DeliveryMethodSectionProps) {
  const t = useTranslations("Order");
  const tContact = useTranslations("ContactContent");
  const { register } = useFormContext<OrderFormType>();

  const options: { value: OrderFormType["deliveryMethod"]; title: string; note: string; price: string }[] = [
    { value: "shipping", title: t("shipping"), note: "", price: formatPrice(shippingCost) },
    { value: "pickup", title: t("pickup"), note: tContact("address"), price: t("free") },
  ];

  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-4 p-0 text-xl font-semibold text-[#171717]">{t("deliveryMethod")}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ value, title, note, price }) => {
          const active = deliveryMethod === value;
          return (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-[14px] border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#171717] ${
                active ? "border-[#171717] bg-[#F5F5F4]" : "border-[#DCDCDB] hover:border-[#9A9A9A]"
              }`}
            >
              <input type="radio" value={value} className="sr-only" {...register("deliveryMethod")} />
              <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-[#171717]" : "border-[#9A9A9A]"}`}>
                {active && <span className="size-2.5 rounded-full bg-[#171717]" />}
              </span>
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-[#171717]">{title}</span>
                  <span className="text-sm font-medium text-[#171717] tabular-nums">{price}</span>
                </span>
                {note && <span className="text-sm text-[#6B6B6B]">{note}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
