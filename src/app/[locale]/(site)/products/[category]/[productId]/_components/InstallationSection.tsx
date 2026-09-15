"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { Check, Store, Truck, Users, ShieldCheck } from "lucide-react";
import ContactForm from "./ContactForm";

interface InstallationSectionProps {
  language: string;
  productId: string;
}

const InstallationSection: FC<InstallationSectionProps> = ({ language, productId }) => {
  const t = useTranslations("Description");
  const tPage = useTranslations("ProductPage");

  const benefits = [t("benefit_1"), t("benefit_2"), t("benefit_3"), t("benefit_4")];

  const whyUs = [
    { icon: Store, title: t("showroom_title"), text: t("showroom_description") },
    { icon: Truck, title: t("delivery_title_free"), text: t("delivery_description") },
    { icon: Users, title: t("consultation_title"), text: t("consultation_description") },
    { icon: ShieldCheck, title: t("installation_title"), text: t("installation_description") },
  ];

  return (
    <section aria-labelledby="turnkey-title" className="border-t border-[#E5E5E5] pt-10 text-[#171717] lg:pt-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 id="turnkey-title" className="text-[24px] sm:text-[28px] font-semibold leading-tight tracking-[-0.01em] text-balance">
              {t("main_title")}
            </h2>
            <p className="text-[15px] text-[#4B4B4B] leading-relaxed max-w-[52ch]">{t("subtitle")}</p>
          </div>

          <ul className="space-y-2.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3 text-[15px]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-[#171717]">{benefit}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-[#6B6B6B]">{t("response_time")}</p>

          <dl className="hidden lg:grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[#E5E5E5] pt-5">
            {whyUs.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-[#6B6B6B]" strokeWidth={1.5} />
                  <div>
                    <dt className="text-sm font-medium">{item.title}</dt>
                    <dd className="text-xs text-[#6B6B6B] leading-snug">{item.text}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="mt-7 lg:mt-0">
          <ContactForm language={language} productId={productId} variant="embedded" />
        </div>
      </div>

      <div className="mt-8 border-t border-[#E5E5E5] pt-6 lg:hidden">
        <h3 className="mb-3 text-sm font-medium text-[#6B6B6B]">{tPage("why_us")}</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {whyUs.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-2.5">
                <Icon className="mt-0.5 size-[18px] shrink-0 text-[#6B6B6B]" strokeWidth={1.5} />
                <div>
                  <dt className="text-[13px] font-medium leading-snug">{item.title}</dt>
                  <dd className="text-xs text-[#6B6B6B] leading-snug">{item.text}</dd>
                </div>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default InstallationSection;
