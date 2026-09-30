import { useTranslations } from "next-intl";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import PhoneNumberInputWithLabel from "@/components/Inputs/PhoneNumberInputWithLabel";
import { OrderFormType } from "@/lib/schemas/orderFormSchema";

interface CustomerInformationSectionProps {
  deliveryMethod: OrderFormType["deliveryMethod"];
}

const inputClass = "h-12 rounded-[10px] border-[#DCDCDB] bg-white text-base shadow-none focus-visible:border-[#171717] focus-visible:ring-[#171717] md:text-base";
const labelClass = "text-sm font-medium text-[#4B4B4B]";

/** Who the order is for; the address fields appear only when delivery is chosen. */
export default function CustomerInformationSection({ deliveryMethod }: CustomerInformationSectionProps) {
  const t = useTranslations("Order");

  const field = (name: "name" | "lastName" | "address" | "city" | "apartment" | "postalCode", required: boolean, autoComplete: string, itemClass?: string) => (
    <TextInputWithLabel<OrderFormType>
      label={required ? `${t(name)} *` : t(name)}
      nameInSchema={name}
      autoComplete={autoComplete}
      itemClass={itemClass}
      labelClass={labelClass}
      inputClass={inputClass}
    />
  );

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-[#171717]">{t("customerInformation")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", true, "given-name")}
        {field("lastName", true, "family-name")}

        <PhoneNumberInputWithLabel<OrderFormType>
          nameInSchema="phoneNumber"
          label={`${t("phoneNumber")} *`}
          itemClass="sm:col-span-2"
          labelClass={labelClass}
          inputClass="rounded-[10px] border border-[#DCDCDB] bg-white px-3"
          phoneClass="h-12 w-full"
        />

        {deliveryMethod === "shipping" && (
          <>
            {field("address", true, "street-address", "sm:col-span-2")}
            {field("city", false, "address-level2", "sm:col-span-2")}
            {field("apartment", false, "address-line2")}
            {field("postalCode", false, "postal-code")}
          </>
        )}
      </div>
    </section>
  );
}
