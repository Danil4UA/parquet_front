"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

// Date of the last substantive change to the text (previously the page showed "today", which was misleading).
const LAST_UPDATED = new Date("2026-09-23");

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

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

              {/* Information we collect */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("collected_title")}</h2>
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
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("methods_title")}</h2>
                <div className="space-y-3">
                  <p>{t("methods_1")}</p>
                  <p>{t("methods_2")}</p>
                  <p>{t("methods_3")}</p>
                </div>
              </section>

              {/* Use of information */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("use_title")}</h2>
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
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("sharing_title")}</h2>
                <div className="space-y-3">
                  <p>{t("sharing_intro")}</p>
                  <ul className="list-disc ps-6 space-y-2">
                    <li>{t("sharing_1")}</li>
                    <li>{t("sharing_2")}</li>
                    <li>{t("sharing_3")}</li>
                    <li>{t("sharing_4")}</li>
                    <li>{t("sharing_5")}</li>
                  </ul>
                  <p>{t("sharing_outro")}</p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("cookies_title")}</h2>
                <div className="space-y-3">
                  <p>{t("cookies_1")}</p>
                  <p>{t("cookies_2")}</p>
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

              {/* Security */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("security_title")}</h2>
                <div className="space-y-3">
                  <p>{t("security_1")}</p>
                  <p>{t("security_2")}</p>
                </div>
              </section>

              {/* User rights */}
              <section>
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("rights_title")}</h2>
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
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("updates_title")}</h2>
                <p>{t("updates_1")}</p>
              </section>

              {/* Contact */}
              <section className="border-t border-[#E2DFDA] pt-8 mt-8">
                <h2 className="text-xl font-semibold text-[#171717] mb-3">{t("contact_title")}</h2>
                <p>{t("contact_text")}</p>
              </section>
            </div>
          </div>

          <div className="mt-10 text-sm text-[#6B6B6B]">
            {t("last_updated")} {LAST_UPDATED.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
