"use client";

import { FC, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import PhoneNumberInputWithLabel from "@/components/Inputs/PhoneNumberInputWithLabel";
import TextareaWithLabel from "@/components/Inputs/TextareaWithLabel";
import contactServices from "@/services/contactServices";

// type FormType = "consultation" | "calculation";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  language: string;
  productId: string;
  className?: string;
}

const ContactForm: FC<ContactFormProps> = ({ className, productId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("Contact");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const payload = { ...data, formType: "consultation", productId }
      console.log("Form submitted:", payload);
      await contactServices.sendConsultationRequest(payload)
      
      toast.success(`${t("form_submitted")} ${t("contact_soon")}`);
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("error_occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // const tabsConfig = {
  //   consultation: {
  //     title: t("consultation"),
  //     subtitle: t("consultation_desc"),
  //     icon: Phone,
  //     color: "blue",
  //   }
  //   calculation: {
  //     title: t("calculation_help"),
  //     subtitle: t("calculation_desc"),
  //     icon: Calculator,
  //     color: "green",
  //   },
  // };

  return (
    <div className={cn("w-full", className)} data-contact-form>
      <div className="bg-white border rounded-lg p-4">
        <div className="mb-4">
          <h3 className="font-bold text-2xl text-gray-900 mb-2">
            {t("need_help")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("contact_expert")}
          </p>
        </div>

        {/* <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FormType)}> */}
            {/* <TabsList className="grid w-full grid-cols-1 mb-6 bg-white border p-1">
            {Object.entries(tabsConfig).map(([key, config]) => {
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <span>{config.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList> */}
{/* 
          {Object.entries(tabsConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="space-y-4"> */}
              {/* <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {config.subtitle}
                </p>
              </div> */}

              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <TextInputWithLabel
                    label={t("name_label")}
                    nameInSchema="name"
                    placeholder={t("name_placeholder")}
                    disabled={isSubmitting}
                    messageClass="hidden"
                  />

                  <PhoneNumberInputWithLabel
                    label={t("phone_label")}
                    nameInSchema="phone"
                    placeholder={t("phone_placeholder")}
                    inputClass="border border-gray-300 p-2 rounded-md"
                    disabled={isSubmitting}
                    messageClass="hidden"
                  />

                    <TextareaWithLabel
                        label={t("message_label")}
                        nameInSchema="message"
                        placeholder={t("message_placeholder")}
                        textareaClass="resize-none min-h-24"
                    />

                  <Separator className="my-4" />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full font-bold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0 rounded-md transition-all duration-300"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t("send_request")}
                      </div>
                    )}
                  </Button>
                </form>
              </FormProvider>
            {/* </TabsContent> */}
          {/* ))} */}
        {/* </Tabs> */}
      </div>
    </div>
  );
};

export default ContactForm;