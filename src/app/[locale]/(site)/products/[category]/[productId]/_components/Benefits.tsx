import { FC } from "react";
import { useTranslations } from "next-intl";
import { Store, Truck, Users, CheckCircle } from "lucide-react";

const Benefits: FC = () => {
  const t = useTranslations("Description");

  const benefits = [
    {
      icon: Store,
      title: t("showroom_title"),
      description: t("showroom_description"),
    },
    {
      icon: Truck,
      title: t("delivery_title_free"),
      description: t("delivery_description"),
    },
    {
      icon: Users,
      title: t("consultation_title"),
      description: t("consultation_description"),
    },
    {
      icon: CheckCircle,
      title: t("installation_title"),
      description: t("installation_description"),
    },
  ];

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white border rounded p-4 space-y-2 text-center"
              >
                <div className="flex justify-center">
                  <Icon className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-base text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;