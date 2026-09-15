"use client";

import { FC, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import PhoneNumberInputWithLabel from "@/components/Inputs/PhoneNumberInputWithLabel";
import TextareaWithLabel from "@/components/Inputs/TextareaWithLabel";
import contactServices from "@/services/contactServices";
import useSubmitCooldown from "@/hooks/useSubmitCooldown";


const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  message: z.string().optional(),
  // Honeypot: hidden from real users, only bots fill it in.
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  language: string;
  productId: string;
  className?: string;
  /** "dark" renders the card for placement on the dark installation section. */
  variant?: "default" | "dark" | "embedded";
}

const ContactForm: FC<ContactFormProps> = ({ className, productId, variant = "default" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { secondsLeft, isCoolingDown, start: startCooldown } = useSubmitCooldown("consultation_cooldown", 60);
  const t = useTranslations("Contact");
  const tDescription = useTranslations("Description");

  const dark = variant === "dark";
  const embedded = variant === "embedded";
  const labelClass = dark ? "text-white/70" : undefined;
  const fieldClass = dark
    ? "h-11 rounded-lg border-white/15 bg-white/[0.07] text-white placeholder:text-white/40 focus-visible:ring-white/40"
    : "h-11 rounded-lg border-[#DCDCDB] bg-white";

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (isCoolingDown) return;
    setIsSubmitting(true);

    try {
      const payload = { ...data, formType: "consultation", productId }
      await contactServices.sendConsultationRequest(payload)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead', form_name: 'consultation' });
      toast.success(`${t("form_submitted")} ${t("contact_soon")}`);
      startCooldown();
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t("error_occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)} data-contact-form>
      <div
        className={cn(
          variant === "default" && "rounded-2xl border border-[#E5E5E5] bg-white p-4 sm:p-5",
          embedded && "rounded-2xl bg-[#F5F5F4] p-5 sm:p-6"
        )}
      >
        <div className="mb-4">
          <h3 className={cn("mb-1 text-lg font-semibold", dark ? "text-white" : "text-[#171717]")}>
            {dark || embedded ? tDescription("cta_title") : t("need_help")}
          </h3>
          <p className={cn("text-sm", dark ? "text-white/60" : "text-[#6B6B6B]")}>
            {dark || embedded ? tDescription("cta_description") : t("contact_expert")}
          </p>
        </div>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Honeypot: hidden from users, traps bots that auto-fill fields */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    {...form.register("website")}
                  />

                  <TextInputWithLabel
                    label={`${t("name_label")} *`}
                    nameInSchema="name"
                    placeholder={t("name_placeholder")}
                    disabled={isSubmitting}
                    labelClass={labelClass}
                    inputClass={fieldClass}
                    messageClass="hidden"
                  />

                  <PhoneNumberInputWithLabel
                    label={`${t("phone_label")} *`}
                    nameInSchema="phone"
                    placeholder={t("phone_placeholder")}
                    inputClass={cn("rounded-lg border px-3", dark ? "border-white/15 bg-white/[0.07] text-white" : "border-[#DCDCDB] bg-white")}
                    phoneClass={dark ? "bg-transparent text-white placeholder:text-white/40 outline-none" : undefined}
                    countryClass={dark ? "bg-transparent text-white" : undefined}
                    labelClass={labelClass}
                    disabled={isSubmitting}
                    messageClass="hidden"
                  />

                    <TextareaWithLabel
                        label={`${t("message_label")} (${t("optional")})`}
                        nameInSchema="message"
                        placeholder={t("message_placeholder")}
                        labelClass={labelClass}
                        textareaClass={cn("resize-none min-h-24 rounded-lg", dark ? "border-white/15 bg-white/[0.07] text-white placeholder:text-white/40 focus-visible:ring-white/40" : "border-[#DCDCDB] bg-white")}
                    />

                  <Button
                    type="submit"
                    disabled={isSubmitting || isCoolingDown}
                    className={cn(
                      "h-12 w-full rounded-xl text-[15px] font-semibold active:scale-[0.99] transition-[background-color,transform] duration-200",
                      dark ? "bg-white text-[#171717] hover:bg-[#EBEBEA]" : "bg-[#171717] text-white hover:bg-[#2A2A2A]"
                    )}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </div>
                    ) : isCoolingDown ? (
                      <div className="flex items-center gap-2">
                        {t("try_again_in", { seconds: secondsLeft })}
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
      </div>
    </div>
  );
};

export default ContactForm;