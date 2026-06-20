"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

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

              {/* Information we collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("collected_title")}</h2>
                <div className="space-y-3">
                  <p>{t("collected_intro")}</p>
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("collected_1")}</li>
                    <li>{t("collected_2")}</li>
                    <li>{t("collected_3")}</li>
                    <li>{t("collected_4")}</li>
                    <li>{t("collected_5")}</li>
                  </ul>
                </div>
              </section>

              {/* How we collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("methods_title")}</h2>
                <div className="space-y-3">
                  <p>{t("methods_1")}</p>
                  <p>{t("methods_2")}</p>
                  <p>{t("methods_3")}</p>
                </div>
              </section>

              {/* Use of information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("use_title")}</h2>
                <div className="space-y-3">
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("use_1")}</li>
                    <li>{t("use_2")}</li>
                    <li>{t("use_3")}</li>
                    <li>{t("use_4")}</li>
                    <li>{t("use_5")}</li>
                  </ul>
                </div>
              </section>

              {/* Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("sharing_title")}</h2>
                <div className="space-y-3">
                  <p>{t("sharing_intro")}</p>
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("sharing_1")}</li>
                    <li>{t("sharing_2")}</li>
                    <li>{t("sharing_3")}</li>
                    <li>{t("sharing_4")}</li>
                  </ul>
                  <p>{t("sharing_outro")}</p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("cookies_title")}</h2>
                <div className="space-y-3">
                  <p>{t("cookies_1")}</p>
                  <p>{t("cookies_2")}</p>
                </div>
              </section>

              {/* Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("security_title")}</h2>
                <div className="space-y-3">
                  <p>{t("security_1")}</p>
                  <p>{t("security_2")}</p>
                </div>
              </section>

              {/* User rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("rights_title")}</h2>
                <div className="space-y-3">
                  <p>{t("rights_intro")}</p>
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("rights_1")}</li>
                    <li>{t("rights_2")}</li>
                    <li>{t("rights_3")}</li>
                    <li>{t("rights_4")}</li>
                  </ul>
                </div>
              </section>

              {/* Updates */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("updates_title")}</h2>
                <p>{t("updates_1")}</p>
              </section>

              {/* Contact */}
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
