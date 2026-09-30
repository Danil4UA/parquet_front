"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

export default function AccessibilityPage() {
  const t = useTranslations("Accessibility");

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("page_title")} />
      <div className="mx-auto max-w-[1180px] px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10">
        <div className="max-w-[760px]">
          <div>
            <div className="space-y-9 text-[#4B4B4B] leading-relaxed">
              <section>
                <p className="mb-4">{t("intro_1")}</p>
                <p>{t("intro_2")}</p>
              </section>

              {/* Standard compliance */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("standard_title")}</h2>
                <div className="space-y-3">
                  <p>{t("standard_1")}</p>
                  <p>{t("standard_2")}</p>
                </div>
              </section>

              {/* Accessibility features */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("features_title")}</h2>
                <div className="space-y-3">
                  <p>{t("features_intro")}</p>
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("features_1")}</li>
                    <li>{t("features_2")}</li>
                    <li>{t("features_3")}</li>
                    <li>{t("features_4")}</li>
                    <li>{t("features_5")}</li>
                    <li>{t("features_6")}</li>
                  </ul>
                </div>
              </section>

              {/* How to use */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("how_to_use_title")}</h2>
                <p>{t("how_to_use_1")}</p>
              </section>

              {/* Known limitations / ongoing work */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("limitations_title")}</h2>
                <p>{t("limitations_1")}</p>
              </section>

              {/* Physical accessibility */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("physical_title")}</h2>
                <p>{t("physical_1")}</p>
              </section>

              {/* Contact / accessibility coordinator */}
              <section className="border-t border-[#E2DFDA] pt-8 mt-8">
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
              </section>
            </div>
          </div>

          <div className="mt-10 text-sm text-[#6B6B6B]">
            {t("last_updated")} {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
