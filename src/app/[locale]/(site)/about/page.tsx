import PageTitleSection from "@/components/Pages/PageTitleSection";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations();
    
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <PageTitleSection title={t("About.page_title")} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t("About.company_title")}
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                {t("About.intro_question")}
              </p>
              <p>
                {t("About.experience_text")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("About.mission_title")}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t("About.mission_text")}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("About.values_title")}</h3>
              <p className="text-gray-700 leading-relaxed">
                {t("About.values_text")}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-gray-600">{t("About.stats_clients")}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">200+</div>
                <div className="text-gray-600">{t("About.stats_products")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
