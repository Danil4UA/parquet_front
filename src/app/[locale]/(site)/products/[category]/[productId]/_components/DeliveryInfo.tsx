import { FC } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Truck, Clock, Gift } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import RouteConstants from "@/constants/RouteConstants";
import GlobalConstants from "@/constants/GlobalConstants";

interface DeliveryInfoProps {
  router: any;
  language: string;
}

const DeliveryInfo: FC<DeliveryInfoProps> = ({ router, language }) => {
  const t = useTranslations("Description");

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  const deliveryOptions = [
    {
      icon: Gift,
      text: t("delivery_free_with_installation"),
      highlight: true
    },
    {
      icon: Truck,
      text: t("delivery_standard_cost", { cost: GlobalConstants.DELIVERY_COST }),
      highlight: false
    },
    {
      icon: Clock,
      text: t("delivery_pickup"),
      highlight: false
    }
  ];

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-white border rounded p-4 space-y-3"
    >
      <h2 className="font-bold text-2xl text-gray-900">
        {t("delivery_title")}
      </h2>
      
      <Separator />
      
      <div className="space-y-3">
        {deliveryOptions.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <div key={index} className="flex items-center gap-3 py-2">
              <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className={`text-sm ${option.highlight ? 'font-semibold text-green-700' : 'font-medium text-gray-700'}`}>
                {option.text}
              </span>
              {option.highlight && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 ml-auto">
                  {t("free")}
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 text-center">
        {t("see_our")}{" "}
        <span 
          className="text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2 transition-colors cursor-pointer"
          onClick={() => router.push(`/${language}/${RouteConstants.TERMS_AND_CONDITIONS_PAGE}`)}
        >
          {t("terms_and_conditions")}
        </span>
      </p>
    </motion.div>
  );
};

export default DeliveryInfo;