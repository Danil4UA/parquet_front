import { FC } from "react";
import { useTranslations } from "next-intl";
import { Truck, Clock, Gift } from "lucide-react";
import { Link } from "@/i18n/routing";
import RouteConstants from "@/constants/RouteConstants";
import GlobalConstants from "@/constants/GlobalConstants";

const DeliveryInfo: FC = () => {
  const t = useTranslations("Description");

  const rows = [
    { icon: Gift, text: t("delivery_free_with_installation"), highlight: true },
    { icon: Truck, text: t("delivery_standard_cost", { cost: GlobalConstants.DELIVERY_COST }), highlight: false },
    { icon: Clock, text: t("delivery_pickup"), highlight: false },
  ];

  return (
    <section aria-labelledby="delivery-title" className="space-y-3">
      <h2 id="delivery-title" className="text-lg font-semibold text-[#171717]">
        {t("delivery_title")}
      </h2>
      <ul className="space-y-2.5">
        {rows.map((row, index) => {
          const Icon = row.icon;
          return (
            <li key={index} className="flex items-start gap-3">
              <Icon className="mt-0.5 size-[18px] shrink-0 text-[#6B6B6B]" strokeWidth={1.75} />
              <span className={row.highlight ? "text-[15px] font-semibold text-[#2F7A4A]" : "text-[15px] text-[#3D3D3D]"}>
                {row.text}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-[#8A8A8A]">
        {t("see_our")}{" "}
        <Link
          href={RouteConstants.TERMS_AND_CONDITIONS_PAGE}
          className="font-medium text-[#4B4B4B] underline underline-offset-2 hover:text-[#171717]"
        >
          {t("terms_and_conditions")}
        </Link>
      </p>
    </section>
  );
};

export default DeliveryInfo;
