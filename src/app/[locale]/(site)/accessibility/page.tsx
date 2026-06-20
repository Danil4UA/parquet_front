"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

export default function AccessibilityPage() {
  const t = useTranslations("Accessibility");

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageTitleSection title={t("page_title")} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-sm">
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <section>
                <p className="mb-4">{t("intro_1")}</p>
                <p>{t("intro_2")}</p>
              </section>

              {/* Standard compliance */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("standard_title")}</h2>
                <div className="space-y-3">
                  <p>{t("standard_1")}</p>
                  <p>{t("standard_2")}</p>
                </div>
              </section>

              {/* Accessibility features */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("features_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("how_to_use_title")}</h2>
                <p>{t("how_to_use_1")}</p>
              </section>

              {/* Known limitations / ongoing work */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("limitations_title")}</h2>
                <p>{t("limitations_1")}</p>
              </section>

              {/* Physical accessibility */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("physical_title")}</h2>
                <p>{t("physical_1")}</p>
              </section>

              {/* Contact / accessibility coordinator */}
              <section className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
              </section>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            {t("last_updated")} {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
