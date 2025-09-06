import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import { getInputClass, getSectionTitleClass } from "./orderClasses";
import { OrderFormType } from "@/lib/schemas/orderFormSchema";
import PhoneNumberInputWithLabel from "@/components/Inputs/PhoneNumberInputWithLabel";

interface CustomerInformationSectionProps {
  deliveryMethod: string;
  t: (key: string) => string;
  isHebrew: boolean;
}

export default function CustomerInformationSection ({
  deliveryMethod,
  t,
  isHebrew
}: CustomerInformationSectionProps){
    return <div className="space-y-4">
    <h3 className={getSectionTitleClass(isHebrew)}>
      {t("customerInformation")}
    </h3>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInputWithLabel<OrderFormType>
          label=""
          nameInSchema="name"
          placeholder={t("name")}
          inputClass={getInputClass(isHebrew)}
        />
        <TextInputWithLabel<OrderFormType>
          label=""
          nameInSchema="lastName"
          placeholder={t("lastName")}
          inputClass={getInputClass(isHebrew)}
        />
      </div>

      {deliveryMethod === "shipping" && (
        <div className="space-y-4">
          <TextInputWithLabel<OrderFormType>
            label=""
            nameInSchema="address"
            placeholder={t("address")}
            inputClass={getInputClass(isHebrew)}
          />                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInputWithLabel<OrderFormType>
              label=""
              nameInSchema="apartment"
              placeholder={t("apartment")}
              inputClass={getInputClass(isHebrew)}
            />
            <TextInputWithLabel<OrderFormType>
              label=""
              nameInSchema="postalCode"
              placeholder={t("postalCode")}
              inputClass={getInputClass(isHebrew)}
            />
          </div>
          
          <TextInputWithLabel<OrderFormType>
            label=""
            nameInSchema="city"
            placeholder={t("city")}
            inputClass={getInputClass(isHebrew)}
          />
        </div>
      )}

      <PhoneNumberInputWithLabel<OrderFormType>
        nameInSchema="phoneNumber"
        label=""
        placeholder={t("phoneNumber")}
        itemClass="w-full"
        phoneClass="w-full h-12"
        labelClass="hidden"
        inputClass={`
          w-full rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          transition-all duration-200
          ${isHebrew ? "hebrew-text text-right" : ""}
        `}
        messageClass="mt-2"
      />
    </div>
  </div>
}