"use client";

import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";
import { contactData, socialLinks } from "@/Utils/utils";
import SectionHead from "./SectionHead";

/** Four numbered steps of buying from the shop, a closing line, then the phone number and WhatsApp. */
const HowWeWork = () => {
  const t = useTranslations("HomePage");

  const items = [
    { title: t("how_1_t"), text: t("how_1_p") },
    { title: t("how_2_t"), text: t("how_2_p") },
    { title: t("how_3_t"), text: t("how_3_p") },
    { title: t("how_4_t"), text: t("how_4_p") },
  ];

  return (
    <section className="bg-[#F5F5F4] py-11 sm:py-[72px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
        <SectionHead title={t.rich("how_title", { strong: (chunks) => <strong>{chunks}</strong> })} />
        <ol className="m-0 grid list-none border-t border-[#E2DFDA] p-0 md:grid-cols-2 md:gap-x-10">
          {items.map(({ title, text }, index) => (
            <li key={title} className="grid grid-cols-[28px_1fr] gap-3.5 border-b border-[#E2DFDA] py-[18px]">
              <span className="text-base font-semibold tabular-nums text-[#9A9A9A]" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <b className="mb-0.5 block text-base font-semibold text-[#171717]">{title}</b>
                <p className="m-0 text-sm text-[#4B4B4B]">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mb-0 mt-6 text-lg font-medium text-[#171717] sm:text-xl">{t("how_outro")}</p>
        <div className="mt-[22px] flex flex-wrap items-center gap-2.5">
          <a href={`tel:${contactData.phone.replace(/[^\d+]/g, "")}`} className="text-xl font-medium tracking-[.02em] text-[#171717] tabular-nums" dir="ltr">
            {contactData.phone}
          </a>
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[46px] items-center gap-2 rounded-[14px] bg-[#171717] px-[18px] text-sm font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
          >
            <MessageSquare className="size-[18px]" strokeWidth={1.75} />
            {t("whatsapp_cta")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
