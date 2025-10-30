"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageTitleSection title={t("page_title")} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 shadow-sm">
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <section>
                <p className="mb-4">{t("intro_description")}</p>
                <p>{t("intro_subtitle")}</p>
              </section>

              {/* General */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("general_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("registration_title")}</h2>
                <div className="space-y-3">
                  <p>{t("registration_1")}</p>
                  <p>{t("registration_2")}</p>
                  <p>{t("registration_3")}</p>
                  <p>{t("registration_4")}</p>
                </div>
              </section>

              {/* Purchasing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("purchasing_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("payment_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("delivery_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("cancellation_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("warranty_title")}</h2>
                <div className="space-y-3">
                  <p>{t("warranty_1")}</p>
                  <p>{t("warranty_2")}</p>
                  <p>{t("warranty_3")}</p>
                  <p>{t("warranty_4")}</p>
                </div>
              </section>

              {/* Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("privacy_title")}</h2>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("copyright_title")}</h2>
                <div className="space-y-3">
                  <p>{t("copyright_1")}</p>
                  <p>{t("copyright_2")}</p>
                  <p>{t("copyright_3")}</p>
                  <p>{t("copyright_4")}</p>
                </div>
              </section>

              {/* Legal */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("legal_title")}</h2>
                <div className="space-y-3">
                  <p>{t("legal_1")}</p>
                  <p>{t("legal_2")}</p>
                  <p>{t("legal_3")}</p>
                </div>
              </section>

              {/* Contact */}
              <section className="border-t border-gray-200 pt-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
              </section>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            {t("last_updated")} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}