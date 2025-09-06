import Radio from "@/shared/ui/Radio/Radio";
import { COMMON_STYLES, getSectionTitleClass } from "./orderClasses";

interface DeliveryMethodSectionProps {
  deliveryMethod: string;
  orderForm: any;
  t: (key: string) => string;
  isHebrew: boolean;
}

export default function DeliveryMethodSection ({
  deliveryMethod,
  orderForm,
  t,
  isHebrew
}: DeliveryMethodSectionProps){
    return <div className="space-y-4">
    <h3 className={getSectionTitleClass(isHebrew)}>
      {t("deliveryMethod")}
    </h3>
    <div className="space-y-3">
      <div 
        className={`
          ${COMMON_STYLES.radioContainer}
          ${deliveryMethod === "shipping" 
            ? COMMON_STYLES.radioContainerActive
            : COMMON_STYLES.radioContainerInactive
          }
        `}
        onClick={() => orderForm.setValue("deliveryMethod", "shipping")}
      >
        <Radio
          name="deliveryMethod" 
          value="shipping" 
          label={t("shipping")} 
          containerClass={`flex items-center gap-3 ${isHebrew ? "flex-row-reverse" : ""}`}
        />
      </div>
      <div 
        className={`
          ${COMMON_STYLES.radioContainer}
          ${deliveryMethod === "pickup" 
            ? COMMON_STYLES.radioContainerActive
            : COMMON_STYLES.radioContainerInactive
          }
        `}
        onClick={() => orderForm.setValue("deliveryMethod", "pickup")}
      >
        <Radio 
          name="deliveryMethod" 
          value="pickup" 
          label={t("pickup")} 
          containerClass={`flex items-center gap-3 ${isHebrew ? "flex-row-reverse" : ""}`}
        />
      </div>
    </div>
  </div>
}
