import TextareaWithLabel from "@/components/Inputs/TextareaWithLabel";
import TextInputWithLabel from "@/components/Inputs/TextInputWithLabel";
import { Button } from "@/components/ui/button";
import { contactFormSchema, ContactFormType } from "@/lib/schemas/contactFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

const ContactUsForm = ({ onSubmit }) => {
  const t = useTranslations('Contact');
  const pathname = usePathname();
  const isHebrew = pathname.split("/")[1] === "he";
  const validationSchema = contactFormSchema(t);
  
  const form = useForm<ContactFormType>({
      resolver: zodResolver(validationSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        message: '',
        website: ''
      }
    });
  const { handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
          {/* Honeypot: hidden from users, traps bots that auto-fill fields */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            {...form.register("website")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInputWithLabel<ContactFormType>
              label=""
              nameInSchema="name"
              placeholder={t("name")}
              inputClass={`h-12 ${errors.name ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
            />
            
            <TextInputWithLabel<ContactFormType>
              label=""
              nameInSchema="phone"
              placeholder={t("phone")}
              inputClass={`h-12 ${errors.phone ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
            />
          </div>
          
          <TextInputWithLabel<ContactFormType>
            label=""
            nameInSchema="email"
            type="email"
            placeholder={t("email")}
            inputClass={`h-12 ${errors.email ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
          />
          
          <div className="flex-1">
            <TextareaWithLabel<ContactFormType>
              label=""
              nameInSchema="message"
              placeholder={t("message")}
              textareaClass={`resize-none ${errors.message ? "error" : ""} ${isHebrew ? "hebrew-text" : ""}`}
            />
          </div>
          
          <Button
            type="submit" 
            className="w-full bg-[#171717] hover:bg-[#2a2a2a] py-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t("sending") : t("send")}
          </Button>
        </form>
      </FormProvider>
  );
}

export default ContactUsForm;