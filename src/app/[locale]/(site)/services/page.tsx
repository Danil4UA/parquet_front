"use client";

import PageTitleSection from "@/components/Pages/PageTitleSection";
import RouteConstants from "@/constants/RouteConstants";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ServicesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const lng = pathname.split("/")[1];

  const services = [
    {
      title: t("Services.service_1_title"),
      description: t("Services.service_1_description"),
      features: [
        t("Services.service_1_feature_1"),
        t("Services.service_1_feature_2"),
        t("Services.service_1_feature_3"),
        t("Services.service_1_feature_4")
      ]
    },
    {
      title: t("Services.service_2_title"),
      description: t("Services.service_2_description"),
      features: [
        t("Services.service_2_feature_1"),
        t("Services.service_2_feature_2"),
        t("Services.service_2_feature_3"),
        t("Services.service_2_feature_4")
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">

    <PageTitleSection title={t("Services.page_title")} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-10 text-center bg-white border border-gray-200 rounded-xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("Services.cta_title")}
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              {t("Services.cta_description")}
            </p>
            <button 
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300"
                onClick={() => router.push(`/${lng}/${RouteConstants.CONTACT_US_PAGE}`)}
            >
              {t("Services.cta_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}