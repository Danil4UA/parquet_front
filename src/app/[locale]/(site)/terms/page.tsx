"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

// Date of the last substantive change to the text (previously the page showed "today", which was misleading).
const LAST_UPDATED = new Date("2026-09-23");

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("page_title")} />
      <div className="mx-auto max-w-[1180px] px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10">
        <div className="max-w-[760px]">
          <div>
            <div className="space-y-9 text-[#4B4B4B] leading-relaxed">
              <section>
                <p className="mb-4">{t("intro_description")}</p>
                <p>{t("intro_subtitle")}</p>
              </section>

              {/* General */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("general_title")}</h2>
                <div className="space-y-3">
                  <p>{t("general_1")}</p>
                  <p>{t("general_2")}</p>
                  <p>{t("general_3")}</p>
                  <p>{t("general_4")}</p>
                  <p>{t("general_5")}</p>
                  <p>{t("general_6")}</p>
                  <p>{t("general_7")}</p>
                </div>
              </section>

              {/* Registration */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("registration_title")}</h2>
                <div className="space-y-3">
                  <p>{t("registration_1")}</p>
                  <p>{t("registration_2")}</p>
                  <p>{t("registration_3")}</p>
                  <p>{t("registration_4")}</p>
                </div>
              </section>

              {/* Purchasing */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("purchasing_title")}</h2>
                <div className="space-y-3">
                  <p>{t("purchasing_1")}</p>
                  <p>{t("purchasing_2")}</p>
                  <p>{t("purchasing_3")}</p>
                  <p>{t("purchasing_4")}</p>
                  <p>{t("purchasing_5")}</p>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("payment_title")}</h2>
                <div className="space-y-3">
                  <p>{t("payment_1")}</p>
                  <p>{t("payment_2")}</p>
                  <p>{t("payment_3")}</p>
                  <p>{t("payment_4")}</p>
                  <p>{t("payment_5")}</p>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("delivery_title")}</h2>
                <div className="space-y-3">
                  <p>{t("delivery_1")}</p>
                  <p>{t("delivery_2")}</p>
                  <p>{t("delivery_3")}</p>
                  <p>{t("delivery_4")}</p>
                  <p>{t("delivery_5")}</p>
                  <p>{t("delivery_6")}</p>
                  <p>{t("delivery_7")}</p>
                  <p>{t("delivery_8")}</p>
                </div>
              </section>

              {/* Cancellation */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("cancellation_title")}</h2>
                <div className="space-y-3">
                  <p>{t("cancellation_1")}</p>
                  <p>{t("cancellation_2")}</p>
                  <p>{t("cancellation_3")}</p>
                  <p>{t("cancellation_4")}</p>
                  <p>{t("cancellation_5")}</p>
                  <p>{t("cancellation_6")}</p>
                </div>
              </section>

              {/* Warranty */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("warranty_title")}</h2>
                <div className="space-y-3">
                  <p>{t("warranty_1")}</p>
                  <p>{t("warranty_2")}</p>
                  <p>{t("warranty_3")}</p>
                  <p>{t("warranty_4")}</p>
                </div>
              </section>

              {/* AI room visualizer */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("visualizer_title")}</h2>
                <div className="space-y-3">
                  <p>{t("visualizer_1")}</p>
                  <p>{t("visualizer_2")}</p>
                  <p>{t("visualizer_3")}</p>
                  <p>{t("visualizer_4")}</p>
                  <p>{t("visualizer_5")}</p>
                  <p>{t("visualizer_6")}</p>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("privacy_title")}</h2>
                <div className="space-y-3">
                  <p>{t("privacy_1")}</p>
                  <p>{t("privacy_2")}</p>
                  <p>{t("privacy_3")}</p>
                  <p>{t("privacy_4")}</p>
                  <p>{t("privacy_5")}</p>
                </div>
              </section>

              {/* Copyright */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("copyright_title")}</h2>
                <div className="space-y-3">
                  <p>{t("copyright_1")}</p>
                  <p>{t("copyright_2")}</p>
                  <p>{t("copyright_3")}</p>
                  <p>{t("copyright_4")}</p>
                </div>
              </section>

              {/* Legal */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("legal_title")}</h2>
                <div className="space-y-3">
                  <p>{t("legal_1")}</p>
                  <p>{t("legal_2")}</p>
                  <p>{t("legal_3")}</p>
                </div>
              </section>

              {/* Contact */}
              <section className="border-t border-[#E2DFDA] pt-8 mt-8">
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
              </section>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-10 text-sm text-[#6B6B6B]">
            {t("last_updated")} {LAST_UPDATED.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}